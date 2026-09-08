import { type DemoProfile } from "@/lib/data";
import { applicantFromCoreProfile, buildBasicAssessment, buildDeepAssessment, defaultCoreProfile, deepQuestions } from "@/lib/assessmentFlow";
import { getOpportunity, type AssessmentResult, type CoreProfile, type Opportunity } from "@/lib/opportunities";

/**
 * Bumped whenever the persisted draft or the canonical AssessmentResult shape changes.
 * Anything persisted under an older version is re-derived from the canonical engine on read.
 *
 * v3 split the single flat questionnaire into a core profile plus opt-in deep answers, and added
 * depth/initialFit/coverage to the result.
 */
export const NORMAL_ASSESSMENT_SCHEMA_VERSION = 3;

export type NormalAssessmentDraft = {
  schemaVersion: number;
  name: string;
  opportunityId: string;
  /** The seven core answers plus any opportunity qualifiers. Enough for eligibility and initial fit. */
  core: CoreProfile;
  /** Opportunity-specific deep answers, keyed by question id. Empty until the user opts in. */
  deepAnswers: Record<string, string>;
  generated: boolean;
  assessmentResult: AssessmentResult | null;
};

export const defaultNormalAssessment: NormalAssessmentDraft = {
  schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION,
  name: "",
  opportunityId: "",
  core: defaultCoreProfile,
  deepAnswers: {},
  generated: false,
  assessmentResult: null
};

/**
 * Recomputes the draft's result through the canonical engine.
 *
 * Depth follows the evidence: a draft with no deep answers gets a basic result, and one with any
 * deep answer gets a deep result. Both come from the same builder, so the two tiers can never
 * disagree about eligibility.
 */
export function finalizeNormalAssessment(draft: NormalAssessmentDraft, opportunity: Opportunity): NormalAssessmentDraft {
  const preparedDraft: NormalAssessmentDraft = {
    ...draft,
    schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION,
    opportunityId: opportunity.id,
    generated: true
  };

  return { ...preparedDraft, assessmentResult: computeNormalAssessmentResult(preparedDraft, opportunity) };
}

export function computeNormalAssessmentResult(draft: NormalAssessmentDraft, opportunity: Opportunity): AssessmentResult {
  const answered = Object.values(draft.deepAnswers ?? {}).some(Boolean);
  return answered
    ? buildDeepAssessment(opportunity, draft.core, draft.deepAnswers, draft.name)
    : buildBasicAssessment(opportunity, draft.core, draft.name);
}

export function buildNormalApplicant(draft?: NormalAssessmentDraft): DemoProfile {
  return applicantFromCoreProfile(draft?.core ?? defaultCoreProfile, draft?.name?.trim() || "you");
}

/** How many of an opportunity's deep questions are still unanswered, for the reuse message. */
export function remainingDeepQuestions(draft: NormalAssessmentDraft, opportunity: Opportunity) {
  return deepQuestions(opportunity).filter((question) => !draft.deepAnswers?.[question.id]).length;
}

/**
 * Single read boundary for the persisted draft.
 *
 * A persisted `assessmentResult` is a cache of a derived value, never a source of truth: the
 * canonical engine in `lib/opportunities` owns the shape. Anything read back from storage is
 * therefore validated against the current canonical schema and, when it does not match (a draft
 * written before the competitiveness refactor, or before the basic/deep split), re-derived from
 * the persisted inputs instead of being handed to the UI.
 */
export function hydrateNormalAssessment(raw: unknown): NormalAssessmentDraft {
  const parsed = isRecord(raw) ? raw : {};
  const draft: NormalAssessmentDraft = {
    ...defaultNormalAssessment,
    schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION,
    name: typeof parsed.name === "string" ? parsed.name : "",
    opportunityId: typeof parsed.opportunityId === "string" ? parsed.opportunityId : "",
    core: hydrateCoreProfile(parsed),
    deepAnswers: stringMap(parsed.deepAnswers),
    generated: false,
    assessmentResult: null
  };

  const storedVersion = typeof parsed.schemaVersion === "number" ? parsed.schemaVersion : 0;
  const storedResult = parsed.assessmentResult;
  const wasGenerated = Boolean(parsed.generated && isRecord(storedResult));

  if (!wasGenerated) return draft;

  // A result written by the current engine can be trusted as-is.
  if (storedVersion === NORMAL_ASSESSMENT_SCHEMA_VERSION && isCanonicalAssessmentResult(storedResult)) {
    return { ...draft, generated: true, assessmentResult: storedResult };
  }

  // Otherwise the inputs survive but the derived result does not: recompute it canonically.
  const opportunity = draft.opportunityId ? getOpportunity(draft.opportunityId) : undefined;
  if (!opportunity) return draft;
  return finalizeNormalAssessment(draft, opportunity);
}

/**
 * Reads the core profile out of a stored draft, including drafts written before the core profile
 * existed. Pre-v3 drafts kept the same facts under flat keys, so those are carried across rather
 * than thrown away; anything that cannot be mapped is simply left blank and asked again.
 */
function hydrateCoreProfile(parsed: Record<string, unknown>): CoreProfile {
  const stored = isRecord(parsed.core) ? parsed.core : {};
  const legacy = legacyCoreFields(parsed);
  const pick = (key: keyof CoreProfile) => {
    const value = stored[key];
    if (typeof value === "string" && value) return value;
    return legacy.fields[key] ?? "";
  };

  return {
    ageBand: pick("ageBand"),
    domicile: pick("domicile"),
    educationLevel: pick("educationLevel"),
    fieldOfStudy: pick("fieldOfStudy"),
    yearStatus: pick("yearStatus"),
    academicPerformance: pick("academicPerformance"),
    householdIncome: pick("householdIncome"),
    qualifiers: {
      ...legacy.qualifiers,
      ...stringMap(isRecord(stored) ? stored.qualifiers : undefined)
    }
  };
}

function legacyCoreFields(parsed: Record<string, unknown>): { fields: Record<string, string>; qualifiers: Record<string, string> } {
  const text = (key: string) => (typeof parsed[key] === "string" ? (parsed[key] as string) : "");
  const qualification = text("highestQualification").toLowerCase();
  const educationLevel = qualification.includes("phd") || qualification.includes("doctor")
    ? "Doctoral (PhD)"
    : qualification.includes("post") || qualification.includes("pg") || qualification.includes("master")
      ? "Postgraduate"
      : qualification.includes("under") || qualification.includes("ug") || qualification.includes("bachelor")
        ? "Undergraduate"
        : "";

  return {
    fields: {
      fieldOfStudy: text("field"),
      educationLevel,
      domicile: text("city").split(",").pop()?.trim() ?? ""
    },
    qualifiers: text("gender") ? { gender: text("gender") } : {}
  };
}

/**
 * Structural check against the canonical `AssessmentResult` contract. Only the fields the UI and
 * the assistant actually read are asserted, so adding an optional field does not invalidate
 * previously persisted results.
 */
export function isCanonicalAssessmentResult(value: unknown): value is AssessmentResult {
  if (!isRecord(value)) return false;
  if (typeof value.opportunityId !== "string" || typeof value.opportunityName !== "string") return false;
  if (!isOneOf(value.depth, DEPTHS)) return false;

  const eligibility = value.eligibility;
  if (!isRecord(eligibility)) return false;
  if (!isOneOf(eligibility.status, ELIGIBILITY_STATUSES)) return false;
  if (!Array.isArray(eligibility.conditions) || !Array.isArray(eligibility.blockers)) return false;

  const initialFit = value.initialFit;
  if (!isRecord(initialFit)) return false;
  if (!isOneOf(initialFit.band, FIT_BANDS)) return false;
  if (!Array.isArray(initialFit.signals) || !Array.isArray(initialFit.reasons) || !Array.isArray(initialFit.missingInformation)) return false;

  const coverage = value.coverage;
  if (!isRecord(coverage) || typeof coverage.checkedCriteria !== "number" || typeof coverage.totalCriteria !== "number") return false;

  const competitiveness = value.competitiveness;
  if (!isRecord(competitiveness)) return false;
  if (competitiveness.score !== null && typeof competitiveness.score !== "number") return false;
  if (!isOneOf(competitiveness.band, COMPETITIVENESS_BANDS)) return false;
  if (typeof competitiveness.assessedWeightPercent !== "number") return false;
  if (!Array.isArray(competitiveness.criteria)) return false;

  const confidence = value.confidence;
  if (!isRecord(confidence) || !isOneOf(confidence.level, CONFIDENCE_LEVELS)) return false;

  const recommendation = value.recommendation;
  if (!isRecord(recommendation) || typeof recommendation.verdict !== "string" || typeof recommendation.explanation !== "string") return false;

  const effortVsUpside = value.effortVsUpside;
  if (!isRecord(effortVsUpside) || typeof effortVsUpside.effort !== "string") return false;

  if (!isOneOf(value.recommendationKey, RECOMMENDATION_KEYS)) return false;
  if (typeof value.recommendationLabel !== "string") return false;
  if (!Array.isArray(value.strengths) || !Array.isArray(value.gaps) || !Array.isArray(value.improvementActions)) return false;
  if (typeof value.overallAssessment !== "string" || typeof value.strongestEvidence !== "string" || typeof value.nextAction !== "string") return false;
  if (value.biggestGap !== null && !isRecord(value.biggestGap)) return false;

  return true;
}

/**
 * Reconciles the /assess form's local working copy with the stored draft.
 *
 * AppProvider reads localStorage in an effect, so on a hard load the form mounts *before* the
 * stored draft exists and its initial snapshot is the empty default. Mirror the stored draft into
 * the form until the visitor edits it; once they have, the local copy wins and later context
 * updates must not clobber the edit in progress.
 */
export function resolveWorkingDraft(
  working: NormalAssessmentDraft,
  stored: NormalAssessmentDraft,
  edited: boolean
): NormalAssessmentDraft {
  return edited || working === stored ? working : stored;
}

const DEPTHS = ["basic", "deep"] as const;
const FIT_BANDS = ["strong", "moderate", "low", "unknown"] as const;
const ELIGIBILITY_STATUSES = ["eligible", "ineligible", "uncertain"] as const;
const COMPETITIVENESS_BANDS = ["strong", "competitive", "developing", "weak", "unknown"] as const;
const CONFIDENCE_LEVELS = ["high", "medium", "low"] as const;
const RECOMMENDATION_KEYS = [
  "strongly_pursue",
  "worth_pursuing",
  "pursue_after_improving",
  "low_priority",
  "verify_eligibility",
  "do_not_apply",
  "insufficient_information"
] as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isOneOf(value: unknown, allowed: readonly string[]) {
  return typeof value === "string" && allowed.includes(value);
}

function stringMap(value: unknown): Record<string, string> {
  if (!isRecord(value)) return {};
  return Object.fromEntries(Object.entries(value).filter((entry): entry is [string, string] => typeof entry[1] === "string"));
}
