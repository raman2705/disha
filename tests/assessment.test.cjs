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
  const hydrated = hydrateNormalAssessment(legacyStoredDraft());
  assert.equal(hydrated.name, "Ananya");
  assert.equal(hydrated.institution, "PES University");
  assert.equal(hydrated.evidence.income, false);
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
  const saved = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", institution: "PES University", programme: "B.Tech CSE" }, opportunity);
  const hydrated = hydrateNormalAssessment(JSON.parse(JSON.stringify(saved)));
  assert.deepEqual(hydrated.assessmentResult, saved.assessmentResult);
  assert.equal(hydrated.generated, true);
});

test("a truncated or garbage payload falls back to defaults instead of throwing", () => {
  assert.deepEqual(hydrateNormalAssessment(null), defaultNormalAssessment);
  assert.deepEqual(hydrateNormalAssessment("nonsense"), defaultNormalAssessment);
  assert.deepEqual(hydrateNormalAssessment([1, 2, 3]), defaultNormalAssessment);

  const wrongTypes = hydrateNormalAssessment({ goals: "financial support", researchOutputs: null, evidence: "yes", generated: true, assessmentResult: {} });
  assert.deepEqual(wrongTypes.goals, []);
  assert.deepEqual(wrongTypes.researchOutputs, []);
  assert.deepEqual(wrongTypes.evidence, defaultNormalAssessment.evidence);
  assert.equal(wrongTypes.assessmentResult, null);
  assert.equal(wrongTypes.generated, false);
});

test("a canonical result stamped with an older schema version is recomputed", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const saved = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", institution: "PES University", programme: "B.Tech CSE" }, opportunity);
  const hydrated = hydrateNormalAssessment({ ...JSON.parse(JSON.stringify(saved)), schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION - 1 });
  assert.equal(hydrated.schemaVersion, NORMAL_ASSESSMENT_SCHEMA_VERSION);
  assert.deepEqual(hydrated.assessmentResult, saved.assessmentResult);
});

test("isCanonicalAssessmentResult rejects a result missing competitiveness fields", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const { assessmentResult } = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya" }, opportunity);
  assert.equal(isCanonicalAssessmentResult(assessmentResult), true);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, competitiveness: undefined }), false);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, competitiveness: { ...assessmentResult.competitiveness, band: "Moderate" } }), false);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, eligibility: { status: "Pass", summary: "", basis: [] } }), false);
  assert.equal(isCanonicalAssessmentResult({ ...assessmentResult, recommendationKey: "Worth pursuing" }), false);
});

test("/assess adopts the hydrated draft on a hard load without clobbering edits", () => {
  const opportunity = getOpportunity("aicte-pragati-scholarship");
  const stored = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", institution: "PES University", programme: "B.Tech CSE" }, opportunity);

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
  const stored = finalizeNormalAssessment({ ...defaultNormalAssessment, name: "Ananya", institution: "PES University", programme: "B.Tech CSE" }, opportunity);
  const beingTyped = { ...defaultNormalAssessment, name: "Ana" };

  // Once the visitor has typed, neither hydration nor a chat-driven recalculation may overwrite it.
  assert.equal(resolveWorkingDraft(beingTyped, stored, true), beingTyped);
  assert.equal(resolveWorkingDraft(beingTyped, defaultNormalAssessment, true), beingTyped);

  // An untouched form still mirrors a chat-driven update so the panel stays in step.
  const recalculated = finalizeNormalAssessment({ ...stored, leadership: "led significant teams/programs" }, opportunity);
  assert.equal(resolveWorkingDraft(stored, recalculated, false), recalculated);
});
