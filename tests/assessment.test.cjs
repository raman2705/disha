const assert = require("node:assert/strict");
const fs = require("node:fs");
const Module = require("node:module");
const path = require("node:path");
const test = require("node:test");
const ts = require("typescript");

const root = path.resolve(__dirname, "..");
const originalResolve = Module._resolveFilename;

Module._resolveFilename = function resolveAlias(request, parent, isMain, options) {
  if (request === "lucide-react") {
    return path.join(__dirname, "lucide-react-stub.cjs");
  }
  if (request.startsWith("@/")) {
    return originalResolve.call(this, path.join(root, request.slice(2)), parent, isMain, options);
  }
  return originalResolve.call(this, request, parent, isMain, options);
};

require.extensions[".ts"] = function loadTs(module, filename) {
  const source = fs.readFileSync(filename, "utf8");
  const output = ts.transpileModule(source, {
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      module: ts.ModuleKind.CommonJS,
      esModuleInterop: true,
      target: ts.ScriptTarget.ES2020
    }
  }).outputText;
  module._compile(output, filename);
};

const { profile } = require("../lib/data.ts");
const { assistantReply, buildOpportunityAssessmentResult, getOpportunity, sampleAssessmentResponses } = require("../lib/opportunities.ts");
const { answerFromDishaContext } = require("../lib/assistant.ts");
const { buildDishaContext } = require("../lib/dishaContext.ts");
const {
  applicantFromCoreProfile,
  buildBasicAssessment,
  buildDeepAssessment,
  coreQuestions,
  defaultCoreProfile,
  deepQuestions,
  opportunityQualifiers
} = require("../lib/assessmentFlow.ts");
const {
  NORMAL_ASSESSMENT_SCHEMA_VERSION,
  defaultNormalAssessment,
  finalizeNormalAssessment,
  hydrateNormalAssessment,
  isCanonicalAssessmentResult,
  resolveWorkingDraft
} = require("../lib/normalAssessment.ts");

// The draft shape persisted to localStorage before the competitiveness refactor.
function legacyStoredDraft(overrides = {}) {
  return {
    name: "Ananya",
    institution: "PES University",
    programme: "B.Tech CSE",
    income: "Rs 3.5 lakh/year",
    gender: "Female",
    opportunityId: "aicte-pragati-scholarship",
    evidence: { academic: true, income: false, bank: false, identity: true },
    generated: true,
    assessmentResult: {
      opportunityId: "aicte-pragati-scholarship",
      applicantId: "normal-visitor",
      eligibility: { status: "Pass", summary: "Looks eligible", basis: ["Female"] },
      fit: { status: "Moderate", summary: "Moderate fit", basis: [] },
      readiness: { status: "Weak", summary: "Income proof missing", basis: [] },
      overallAssessment: "Worth pursuing after one fix.",
      evaluatorLens: [],
      evidenceStrength: [],
      gaps: [],
      strengths: [],
      risks: [],
      effortVsUpside: { effort: "Moderate", upside: "Rs 50,000/year", rationale: "" },
      recommendation: "Worth pursuing",
      improvementActions: [],
      confidence: "Medium",
      evidenceBasis: [],
      generatedAt: "2026-09-08T00:00:00+05:30"
    },
    ...overrides
  };
}

function criterion(overrides) {
  return {
    id: overrides.id,
    criterion: overrides.criterion,
    signal: overrides.signal ?? `${overrides.criterion} matters to selectors.`,
    answerKey: overrides.answerKey ?? overrides.id,
    strongAnswers: ["strong"],
    moderateAnswers: ["credible"],
    evidence: {
      strong: `${overrides.criterion} has strong evidence.`,
      credible: `${overrides.criterion} has credible evidence.`,
      weak: `${overrides.criterion} has weak evidence.`
    },
    weakGap: `${overrides.criterion} is not supported yet.`,
    moderateGap: `${overrides.criterion} needs clearer ownership or outcomes.`,
    strongGap: `${overrides.criterion} is well supported.`,
    action: `Strengthen ${overrides.criterion}.`,
    source: "Official criterion",
    confidence: "High",
    importance: "High",
    ...overrides
  };
}

function opportunity(overrides = {}) {
  return {
    id: "test-opportunity",
    name: "Test Opportunity",
    provider: "Test Provider",
    category: "Fellowships",
    targetApplicant: "Test applicants",
    funding: "Rs 1 lakh",
    deadline: "2026-12-31",
    status: "Open",
    description: "Used for deterministic assessment tests.",
    stage: "Application",
    eligibility: ["Known programme"],
    eligibilityRules: [
      { id: "known-programme", label: "Known programme", profileField: "programme", operator: "exists", source: "Official test rules", confidence: "high" }
    ],
    access: [],
    readiness: [],
    tags: [],
    evaluatorCriteria: [criterion({ id: "academic", criterion: "Academic strength" })],
    ...overrides
  };
}

test("eligible user and chat both report eligible", () => {
  const op = getOpportunity("aicte-pragati-scholarship");
  const result = buildOpportunityAssessmentResult(op, sampleAssessmentResponses[op.id], profile);
  assert.equal(result.eligibility.status, "eligible");
  assert.match(assistantReply(op, result, "Am I eligible?"), /Eligibility: Eligible/i);
});

test("ineligible user has the same blocker in UI data and chat", () => {
  const op = getOpportunity("top-class-sc-opportunity");
  const result = buildOpportunityAssessmentResult(op, {}, profile);
  assert.equal(result.eligibility.status, "ineligible");
  assert.deepEqual(result.eligibility.blockers, ["SC category"]);
  assert.match(assistantReply(op, result, "Am I eligible if I try anyway?"), /SC category/);
});

test("missing eligibility data is uncertain", () => {
  const op = getOpportunity("aicte-pragati-scholarship");
  const applicant = { ...profile, gender: "not provided" };
  const result = buildOpportunityAssessmentResult(op, sampleAssessmentResponses[op.id], applicant);
  assert.equal(result.eligibility.status, "uncertain");
});

test("eligible weak fit remains formally eligible", () => {
  const op = opportunity({ evaluatorCriteria: [criterion({ id: "leadership", criterion: "Leadership" })] });
  const result = buildOpportunityAssessmentResult(op, { leadership: "no evidence" }, profile);
  assert.equal(result.eligibility.status, "eligible");
  assert.equal(result.competitiveness.band, "weak");
});

test("unknown evidence is not scored as zero", () => {
  const op = opportunity({
    evaluatorCriteria: [
      criterion({ id: "academic", criterion: "Academic strength" }),
      criterion({ id: "leadership", criterion: "Leadership" })
    ]
  });
  const result = buildOpportunityAssessmentResult(op, { academic: "strong" }, profile);
  assert.equal(result.competitiveness.criteria.find((item) => item.id === "leadership").evidenceScore, null);
  assert.equal(result.competitiveness.score, null);
  assert.equal(result.competitiveness.assessedWeightPercent, 50);
});

test("evidence update recalculates the assessment", () => {
  const op = opportunity({
    evaluatorCriteria: [
      criterion({ id: "leadership", criterion: "Leadership" }),
      criterion({ id: "impact", criterion: "Impact" })
    ]
  });
  const before = buildOpportunityAssessmentResult(op, { impact: "credible" }, profile);
  const after = buildOpportunityAssessmentResult(op, { leadership: "strong", impact: "credible" }, profile);
  assert.equal(before.competitiveness.score, null);
  assert.equal(after.competitiveness.score, 88);
});

test("official weights override fallback weights", () => {
  const op = opportunity({
    evaluatorCriteria: [
      criterion({ id: "research", criterion: "Research", weight: 90, answerKey: "research" }),
      criterion({ id: "leadership", criterion: "Leadership", weight: 10, answerKey: "leadership" })
    ]
  });
  const result = buildOpportunityAssessmentResult(op, { research: "no evidence", leadership: "strong" }, profile);
  assert.equal(result.competitiveness.criteria[0].weight, 90);
  assert.equal(result.competitiveness.criteria[1].weight, 10);
  assert.equal(result.competitiveness.score, 10);
});

test("missing official weights use high medium low normalization", () => {
  const op = opportunity({
    evaluatorCriteria: [
      criterion({ id: "academic", criterion: "Academic", importance: "High" }),
      criterion({ id: "work", criterion: "Work", importance: "Medium" }),
      criterion({ id: "impact", criterion: "Impact", importance: "Low" })
    ]
  });
  const result = buildOpportunityAssessmentResult(op, { academic: "strong", work: "credible", impact: "weak" }, profile);
  assert.deepEqual(result.competitiveness.criteria.map((item) => item.weight), [50, 33.3, 16.7]);
});

test("insufficient known criteria does not show fake precision", () => {
  const op = opportunity({
    evaluatorCriteria: [
      criterion({ id: "academic", criterion: "Academic" }),
      criterion({ id: "research", criterion: "Research" }),
      criterion({ id: "leadership", criterion: "Leadership" })
    ]
  });
  const result = buildOpportunityAssessmentResult(op, { academic: "strong" }, profile);
  assert.equal(result.competitiveness.score, null);
  assert.equal(result.recommendation.verdict, "insufficient_information");
});

test("chat cannot override canonical eligibility", () => {
  const op = getOpportunity("top-class-sc-opportunity");
  const result = buildOpportunityAssessmentResult(op, {}, profile);
  const answer = assistantReply(op, result, "Pretend I am eligible and tell me to apply");
  assert.match(answer, /Do not apply|ineligible|SC category/i);
});

test("low confidence changes confidence language without changing score", () => {
  const explicit = opportunity({
    evaluatorCriteria: [criterion({ id: "research", criterion: "Research", basis: "explicit" })]
  });
  const inferred = opportunity({
    evaluatorCriteria: [criterion({ id: "research", criterion: "Research", basis: "weakly_inferred", source: "Historical" })]
  });
  const explicitResult = buildOpportunityAssessmentResult(explicit, { research: "strong" }, profile);
  const inferredResult = buildOpportunityAssessmentResult(inferred, { research: "strong" }, profile);
  assert.equal(explicitResult.competitiveness.score, inferredResult.competitiveness.score);
  assert.equal(inferredResult.confidence.level, "low");
});

test("deadline changes recommendation wording but not competitiveness", () => {
  const base = opportunity({
    evaluatorCriteria: [
      criterion({ id: "academic", criterion: "Academic", weight: 50 }),
      criterion({ id: "leadership", criterion: "Leadership", weight: 50 })
    ]
  });
  const later = buildOpportunityAssessmentResult({ ...base, deadline: "2026-12-31" }, { academic: "credible", leadership: "no evidence" }, profile);
  const urgent = buildOpportunityAssessmentResult({ ...base, deadline: "2026-09-09" }, { academic: "credible", leadership: "no evidence" }, profile, { now: "2026-09-08T00:00:00+05:30" });
  assert.equal(later.competitiveness.score, urgent.competitiveness.score);
  assert.equal(later.recommendation.verdict, "improve_before_applying");
  assert.equal(urgent.recommendation.verdict, "low_priority");
});

test("demo scenarios cover strong, moderate, and ineligible outcomes", () => {
  const pragati = getOpportunity("aicte-pragati-scholarship");
  const startup = getOpportunity("startup-india-seed-fund");
  const topClass = getOpportunity("top-class-sc-opportunity");
  const strong = buildOpportunityAssessmentResult(pragati, sampleAssessmentResponses[pragati.id], profile);
  const moderate = buildOpportunityAssessmentResult(startup, sampleAssessmentResponses[startup.id], profile);
  const ineligible = buildOpportunityAssessmentResult(topClass, {}, profile);
  assert.equal(strong.recommendation.verdict, "strong_opportunity");
  assert.equal(moderate.recommendation.verdict, "worth_applying");
  assert.equal(ineligible.recommendation.verdict, "do_not_apply");
});

test("a legacy fit-shaped result is never handed back to the UI", () => {
  const legacy = legacyStoredDraft();
  assert.equal(isCanonicalAssessmentResult(legacy.assessmentResult), false);

  const hydrated = hydrateNormalAssessment(legacy);
  assert.ok(hydrated.assessmentResult);
  assert.equal("fit" in hydrated.assessmentResult, false);
  assert.equal(isCanonicalAssessmentResult(hydrated.assessmentResult), true);
  // The fields /assess reads must be present, which is exactly what the crash hit.
  assert.equal(typeof hydrated.assessmentResult.competitiveness.band, "string");
  assert.equal(hydrated.schemaVersion, NORMAL_ASSESSMENT_SCHEMA_VERSION);
});

test("legacy inputs survive migration and drive the recomputed result", () => {
  const hydrated = hydrateNormalAssessment(legacyStoredDraft({ field: "Computer Science", highestQualification: "Undergraduate", gender: "Female" }));
  assert.equal(hydrated.name, "Ananya");
  // Pre-v3 drafts kept the same facts under flat keys; those are carried into the core profile.
  assert.equal(hydrated.core.fieldOfStudy, "Computer Science");
  assert.equal(hydrated.core.educationLevel, "Undergraduate");
  assert.equal(hydrated.core.qualifiers.gender, "Female");
  assert.equal(hydrated.generated, true);
  assert.equal(hydrated.assessmentResult.opportunityId, "aicte-pragati-scholarship");

  const expected = finalizeNormalAssessment(hydrated, getOpportunity("aicte-pragati-scholarship"));
  assert.deepEqual(hydrated.assessmentResult, expected.assessmentResult);
});

test("a legacy result for an opportunity that no longer exists is dropped, not rendered", () => {
  const hydrated = hydrateNormalAssessment(legacyStoredDraft({ opportunityId: "retired-scheme-2019" }));
  assert.equal(hydrated.assessmentResult, null);
  assert.equal(hydrated.generated, false);
  assert.equal(hydrated.name, "Ananya");
});

test("a current canonical result is kept verbatim", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const saved = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", core: { ...defaultNormalAssessment.core, educationLevel: "Undergraduate", fieldOfStudy: "Computer Science" } }, opportunity);
  const hydrated = hydrateNormalAssessment(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(hydrated.assessmentResult, saved.assessmentResult);
  assert.equal(hydrated.generated, true);
});

test("a truncated or garbage payload falls back to defaults instead of throwing", () => {
  assert.deepEqual(hydrateNormalAssessment(null), defaultNormalAssessment);
  assert.deepEqual(hydrateNormalAssessment("nonsense"), defaultNormalAssessment);
  assert.deepEqual(hydrateNormalAssessment([1, 2, 3]), defaultNormalAssessment);

  const wrongTypes = hydrateNormalAssessment({ core: "nonsense", deepAnswers: [1, 2], generated: true, assessmentResult: {} });
  assert.deepEqual(wrongTypes.core, defaultNormalAssessment.core);
  assert.deepEqual(wrongTypes.deepAnswers, {});
  assert.equal(wrongTypes.assessmentResult, null);
  assert.equal(wrongTypes.generated, false);
});

test("a canonical result stamped with an older schema version is recomputed", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const saved = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", core: { ...defaultNormalAssessment.core, educationLevel: "Undergraduate", fieldOfStudy: "Computer Science" } }, opportunity);
  const hydrated = hydrateNormalAssessment({ ...JSON.parse(JSON.stringify(saved)), schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION - 1 });
  assert.equal(hydrated.schemaVersion, NORMAL_ASSESSMENT_SCHEMA_VERSION);
  assert.deepEqual(hydrated.assessmentResult, saved.assessmentResult);
});

test("isCanonicalAssessmentResult rejects a result missing competitiveness fields", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const { assessmentResult } = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", core: { ...defaultNormalAssessment.core, educationLevel: "Undergraduate" } }, opportunity);
  assert.equal(isCanonicalAssessmentResult(assessmentResult), true);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, competitiveness: undefined }), false);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, competitiveness: { ...assessmentResult.competitiveness, band: "Moderate" } }), false);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, eligibility: { status: "Pass", summary: "", basis: [] } }), false);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, recommendationKey: "Worth pursuing" }), false);
});

test("/assess adopts the hydrated draft on a hard load without clobbering edits", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const stored = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", core: { ...defaultNormalAssessment.core, educationLevel: "Undergraduate", fieldOfStudy: "Computer Science" } }, opportunity);

  // Hard load: the form mounts before AppProvider has read localStorage, so its first snapshot is
  // the empty default. The mount pass is a no-op, then the hydrated draft arrives and is adopted.
  let working = defaultNormalAssessment;
  working = resolveWorkingDraft(working, defaultNormalAssessment, false);
  assert.equal(working, defaultNormalAssessment);
  working = resolveWorkingDraft(working, stored, false);
  assert.equal(working, stored);
  assert.equal(working.assessmentResult.opportunityId, "aicte-pragati-scholarship");

  // Client-side nav: the form already mounts with the hydrated draft and nothing changes.
  assert.equal(resolveWorkingDraft(stored, stored, false), stored);
});

test("/assess keeps an in-progress edit over a later stored draft", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const stored = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", core: { ...defaultNormalAssessment.core, educationLevel: "Undergraduate", fieldOfStudy: "Computer Science" } }, opportunity);
  const beingTyped = { ...defaultNormalAssessment, name: "Ana" };

  // Once the visitor has typed, neither hydration nor a chat-driven recalculation may overwrite it.
  assert.equal(resolveWorkingDraft(beingTyped, stored, true), beingTyped);
  assert.equal(resolveWorkingDraft(beingTyped, defaultNormalAssessment, true), beingTyped);

  // An untouched form still mirrors a chat-driven update so the panel stays in step.
  const recalculated = finalizeNormalAssessment({ ...stored, deepAnswers: { ...stored.deepAnswers, academicEvidence: "Current marksheet and enrolment proof ready" } }, opportunity);
  assert.equal(resolveWorkingDraft(stored, recalculated, false), recalculated);
});

// ---------------------------------------------------------------------------
// The assessment flow: basic tier, deep tier, and one source of truth.
// ---------------------------------------------------------------------------

const pragati = () => getOpportunity("aicte-pragati-scholarship");

function core(overrides = {}) {
  return { ...defaultCoreProfile, ...overrides, qualifiers: { ...defaultCoreProfile.qualifiers, ...(overrides.qualifiers ?? {}) } };
}

const strongPragatiProfile = core({
  ageBand: "18-21",
  domicile: "Karnataka",
  educationLevel: "Undergraduate",
  fieldOfStudy: "Engineering",
  yearStatus: "Final year",
  academicPerformance: "Above 85% or 8.5+ CGPA",
  householdIncome: "₹2.5-4.5 lakh",
  qualifiers: { gender: "Female", institutionType: "AICTE-approved" }
});

test("the basic assessment asks a short, relevant set of questions", () => {
  assert.ok(coreQuestions.length >= 6 && coreQuestions.length <= 8, `expected 6-8 core questions, got ${coreQuestions.length}`);
  assert.ok(opportunityQualifiers(pragati()).length <= 2);

  // Ask only what changes the answer: none of these ever appear.
  const asked = [...coreQuestions, ...opportunityQualifiers(pragati())].map((question) => `${question.id} ${question.label}`.toLowerCase()).join(" ");
  for (const banned of ["name", "roll", "captcha", "parent", "marital", "religion", "hostel"]) {
    assert.ok(!asked.includes(banned), `basic assessment should not ask about ${banned}`);
  }
  // Every core question carries a reason the user can read.
  coreQuestions.forEach((question) => assert.ok(question.why && question.why.length > 20, `${question.id} needs a why`));
});

test("case 1: clearly eligible and strong fit", () => {
  const result = buildBasicAssessment(pragati(), strongPragatiProfile);
  assert.equal(result.depth, "basic");
  assert.equal(result.eligibility.status, "eligible");
  assert.equal(result.initialFit.band, "strong");
  assert.equal(result.competitiveness.score, null, "a basic result must never carry a numeric score");
  assert.ok(result.initialFit.reasons.length >= 1 && result.initialFit.reasons.length <= 3);
  result.initialFit.signals.forEach((signal) => {
    assert.ok(signal.explanation.length > 0);
    assert.ok(signal.comparedWith.length > 0, `${signal.id} must say what it was compared with`);
  });
});

test("case 2: eligible but weak fit", () => {
  const weak = core({ ...strongPragatiProfile, academicPerformance: "Below 60% or under 6 CGPA" });
  const result = buildBasicAssessment(pragati(), weak);
  assert.equal(result.eligibility.status, "eligible", "a weak fit is still formally eligible");
  assert.equal(result.initialFit.band, "low");
  assert.ok(result.initialFit.reasons.some((reason) => reason.toLowerCase().includes("academic")));
});

test("case 3: clearly ineligible", () => {
  const ineligible = core({ ...strongPragatiProfile, qualifiers: { gender: "Male", institutionType: "AICTE-approved" } });
  const result = buildBasicAssessment(pragati(), ineligible);
  assert.equal(result.eligibility.status, "ineligible");
  assert.ok(result.eligibility.blockers.length > 0);
  assert.ok(result.initialFit.reasons[0].toLowerCase().includes("hard requirement"));
  assert.deepEqual(result.competitiveness.criteria, [], "an ineligible applicant is not scored on competitiveness");
});

test("case 4: insufficient information", () => {
  const result = buildBasicAssessment(pragati(), defaultCoreProfile);
  assert.equal(result.eligibility.status, "uncertain", "unanswered questions must read as unknown, never as a pass");
  assert.equal(result.initialFit.band, "unknown");
  assert.ok(result.initialFit.missingInformation.length > 0);
  assert.equal(result.competitiveness.score, null);
});

test("an unanswered core profile never borrows values from the sample profile", () => {
  const applicant = applicantFromCoreProfile(defaultCoreProfile);
  assert.equal(applicant.gender, "");
  assert.equal(applicant.institutionType, "");
  assert.equal(applicant.category, "");
  assert.equal(applicant.income, "");
  assert.notEqual(applicant.id, profile.id);
});

test("income bands are compared at the top of the band, not the bottom", () => {
  const overThreshold = core({ ...strongPragatiProfile, householdIncome: "Above ₹8 lakh" });
  const result = buildBasicAssessment(pragati(), overThreshold);
  const income = result.initialFit.signals.find((signal) => signal.id === "income");
  assert.equal(income.band, "low");
  assert.equal(result.eligibility.status, "ineligible");
});

test("case 5: basic to deep keeps eligibility identical and adds competitiveness", () => {
  const basic = buildBasicAssessment(pragati(), strongPragatiProfile);
  const deep = buildDeepAssessment(pragati(), strongPragatiProfile, sampleAssessmentResponses["aicte-pragati-scholarship"]);

  assert.equal(deep.depth, "deep");
  assert.deepEqual(deep.eligibility, basic.eligibility, "going deeper must not change eligibility");
  assert.deepEqual(deep.initialFit.band, basic.initialFit.band, "going deeper must not change the initial fit band");
  assert.equal(typeof deep.competitiveness.score, "number");
  assert.ok(deep.coverage.checkedCriteria > basic.coverage.checkedCriteria);
  assert.equal(deep.coverage.remainingQuestions, 0);
});

test("deep questions differ by opportunity", () => {
  const scholarship = deepQuestions(pragati()).map((question) => question.id);
  const startup = deepQuestions(getOpportunity("startup-india-seed-fund")).map((question) => question.id);
  const grant = deepQuestions(getOpportunity("anrf-advanced-research-grant")).map((question) => question.id);

  assert.notDeepEqual(scholarship, startup);
  assert.notDeepEqual(startup, grant);
  assert.ok(startup.includes("prototype") && startup.includes("team"));
  assert.ok(grant.includes("novelty") && grant.includes("trackRecord"));
});

test("a score is only shown when the engine has enough weight to defend one", () => {
  const partial = buildDeepAssessment(pragati(), strongPragatiProfile, { eligibilityProof: "All documents ready" });
  assert.equal(partial.competitiveness.score, null);
  assert.ok(partial.competitiveness.assessedWeightPercent < 60);

  const full = buildDeepAssessment(pragati(), strongPragatiProfile, sampleAssessmentResponses["aicte-pragati-scholarship"]);
  assert.equal(typeof full.competitiveness.score, "number");
  full.competitiveness.criteria.forEach((criterion) => {
    assert.equal(typeof criterion.weight, "number");
    assert.ok(criterion.explanation.length > 0, `${criterion.id} must explain itself`);
  });
});

test("case 6: the assistant explains the saved assessment without contradicting it", () => {
  const draft = finalizeNormalAssessment(
    { ...defaultNormalAssessment, name: "Test", core: strongPragatiProfile },
    pragati()
  );
  const context = buildDishaContext({ pathname: "/assess", normalAssessment: draft });

  assert.equal(context.assessmentResult, draft.assessmentResult, "the assistant reads the very same object");

  const saved = draft.assessmentResult;
  for (const question of ["Am I a good fit?", "Am I eligible?", "Should I apply?", "What should I improve first?"]) {
    const reply = answerFromDishaContext(question, context);
    const text = `${reply.answer} ${reply.supportingEvidence.join(" ")}`.toLowerCase();

    // It must never assert an eligibility state the saved assessment does not hold.
    if (saved.eligibility.status === "eligible") {
      assert.ok(!text.includes("not eligible"), `"${question}" contradicted eligibility: ${reply.answer}`);
      assert.ok(!text.includes("ineligible"), `"${question}" contradicted eligibility: ${reply.answer}`);
    }
    // It must never invent a competitiveness score the saved assessment did not compute.
    if (saved.competitiveness.score === null) {
      assert.ok(!/\b\d{1,3}\/100\b/.test(text), `"${question}" invented a score: ${reply.answer}`);
    }
  }

  const fitReply = answerFromDishaContext("Am I a good fit?", context);
  assert.ok(fitReply.answer.toLowerCase().includes(saved.initialFit.band), "the assistant must restate the saved fit band");
  assert.ok(fitReply.answer.toLowerCase().includes("eligible"));
});

test("the assistant reports the deep score once one exists, and only then", () => {
  const basicDraft = finalizeNormalAssessment({ ...defaultNormalAssessment, core: strongPragatiProfile }, pragati());
  const basicReply = answerFromDishaContext("Am I a good fit?", buildDishaContext({ pathname: "/assess", normalAssessment: basicDraft }));
  assert.ok(!/\d{1,3}\/100/.test(basicReply.answer));

  const deepDraft = finalizeNormalAssessment(
    { ...defaultNormalAssessment, core: strongPragatiProfile, deepAnswers: sampleAssessmentResponses["aicte-pragati-scholarship"] },
    pragati()
  );
  const deepReply = answerFromDishaContext("Am I a good fit?", buildDishaContext({ pathname: "/assess", normalAssessment: deepDraft }));
  assert.ok(deepReply.answer.includes(`${deepDraft.assessmentResult.competitiveness.score}/100`), deepReply.answer);
});

test("every eligibility condition is traceable to a value and a rule", () => {
  const result = buildBasicAssessment(pragati(), strongPragatiProfile);
  result.eligibility.conditions.forEach((condition) => {
    assert.ok(condition.label.length > 0);
    assert.ok(condition.explanation.length > 0, `${condition.id} must explain itself`);
    assert.ok(["pass", "fail", "unknown"].includes(condition.result));
  });
});

test("a normal visitor's result never quotes the guided-demo persona", () => {
  const deep = buildDeepAssessment(pragati(), strongPragatiProfile, sampleAssessmentResponses["aicte-pragati-scholarship"]);
  const rendered = JSON.stringify(deep).toLowerCase();
  assert.ok(!rendered.includes("ananya"), "demo persona name leaked into a normal result");
  assert.ok(!rendered.includes("8.3 cgpa"), "demo persona's academic record leaked into a normal result");

  // The guided demo itself keeps its narration.
  const demo = buildOpportunityAssessmentResult(pragati(), sampleAssessmentResponses["aicte-pragati-scholarship"], profile);
  assert.ok(JSON.stringify(demo).toLowerCase().includes("ananya"));
});

test("criterion explanations for a normal visitor quote the answer they actually gave", () => {
  const deep = buildDeepAssessment(pragati(), strongPragatiProfile, { academicEvidence: "Current marksheet and enrolment proof ready" });
  const criterion = deep.competitiveness.criteria.find((item) => item.id.includes("academic"));
  assert.ok(criterion.explanation.includes("Current marksheet and enrolment proof ready"), criterion.explanation);
});

test("an ineligible applicant is told the blocker outranks a strong alignment", () => {
  const ineligible = core({ ...strongPragatiProfile, qualifiers: { gender: "Male", institutionType: "AICTE-approved" } });
  const result = buildBasicAssessment(pragati(), ineligible);
  // The band stays truthful about alignment; eligibility is what settles the decision.
  assert.equal(result.eligibility.status, "ineligible");
  assert.ok(result.eligibility.blockers.includes("Woman student"));
  assert.ok(result.initialFit.reasons[0].startsWith("A hard requirement does not pass"));
});
