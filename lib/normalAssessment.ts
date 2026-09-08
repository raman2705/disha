import { profile, type DemoProfile } from "@/lib/data";
import { buildOpportunityAssessmentResult, getOpportunity, type AssessmentResult, type Opportunity } from "@/lib/opportunities";

/**
 * Bumped whenever the persisted draft or the canonical AssessmentResult shape changes.
 * Anything persisted under an older version is re-derived from the canonical engine on read.
 */
export const NORMAL_ASSESSMENT_SCHEMA_VERSION = 2;

export type NormalAssessmentDraft = {
  schemaVersion: number;
  name: string;
  age: string;
  citizenship: string;
  city: string;
  currentStatus: "student" | "working" | "researcher" | "founder" | "other" | "";
  institution: string;
  programme: string;
  highestQualification: string;
  field: string;
  currentYear: string;
  graduationYear: string;
  cgpa: string;
  income: string;
  gender: string;
  researchExperience: "no" | "coursework project" | "research internship" | "thesis/dissertation" | "independent research" | "multiple research experiences" | "";
  researchOutputs: string[];
  workExperience: "none" | "under 6 months" | "6-12 months" | "1-2 years" | "2-5 years" | "5+ years" | "";
  experienceAreas: string[];
  ownership: "mainly assisted" | "owned individual tasks" | "owned a project/workstream" | "led multiple projects/team" | "";
  measurableOutcomes: "yes" | "no" | "unsure" | "";
  leadership: "no" | "informally" | "led a small project/team" | "held a formal leadership role" | "led significant teams/programs" | "";
  largestTeam: "1-5" | "6-10" | "11-25" | "25+" | "";
  leadershipDuration: "one-off" | "under 3 months" | "3-12 months" | "1+ year" | "";
  impactExperience: "none" | "occasional volunteering" | "regular volunteering" | "led an initiative" | "built/ran sustained program" | "";
  impactReach: "under 50" | "50-250" | "250-1000" | "1000+" | "unknown/not applicable" | "";
  startupStage: "none" | "exploring idea" | "idea validated" | "prototype/MVP" | "active users" | "revenue" | "funded/incubated" | "";
  goals: string[];
  opportunityInterests: string[];
  effortTolerance: "quick applications only" | "a few hours" | "several days" | "willing to invest significant effort for a strong opportunity" | "";
  opportunityId: string;
  evidence: {
    academic: boolean;
    income: boolean;
    bank: boolean;
    identity: boolean;
  };
  generated: boolean;
  assessmentResult: AssessmentResult | null;
};

export const defaultNormalAssessment: NormalAssessmentDraft = {
  schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION,
  name: "",
  age: "",
  citizenship: "Indian",
  city: "",
  currentStatus: "",
  institution: "",
  programme: "",
  highestQualification: "",
  field: "",
  currentYear: "",
  graduationYear: "",
  cgpa: "",
  income: "",
  gender: "",
  researchExperience: "",
  researchOutputs: [],
  workExperience: "",
  experienceAreas: [],
  ownership: "",
  measurableOutcomes: "",
  leadership: "",
  largestTeam: "",
  leadershipDuration: "",
  impactExperience: "",
  impactReach: "",
  startupStage: "",
  goals: [],
  opportunityInterests: [],
  effortTolerance: "",
  opportunityId: "",
  evidence: {
    academic: true,
    income: false,
    bank: false,
    identity: true
  },
  generated: false,
  assessmentResult: null
};

export function finalizeNormalAssessment(draft: NormalAssessmentDraft, opportunity: Opportunity): NormalAssessmentDraft {
  const preparedDraft = {
    ...draft,
    schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION,
    opportunityId: opportunity.id,
    generated: true
  };

  return {
    ...preparedDraft,
    assessmentResult: computeNormalAssessmentResult(preparedDraft, opportunity)
  };
}

export function computeNormalAssessmentResult(draft: NormalAssessmentDraft, opportunity: Opportunity): AssessmentResult {
  return buildOpportunityAssessmentResult(opportunity, responsesFromNormalAssessment(draft, opportunity), buildNormalApplicant(draft));
}

/**
 * Single read boundary for the persisted draft.
 *
 * A persisted `assessmentResult` is a cache of a derived value, never a source of truth: the
 * canonical engine in `lib/opportunities` owns the shape. Anything read back from storage is
 * therefore validated against the current canonical schema and, when it does not match (a draft
 * written before the competitiveness refactor still carries the old `fit`/`readiness` object),
 * re-derived from the persisted inputs instead of being handed to the UI.
 */
export function hydrateNormalAssessment(raw: unknown): NormalAssessmentDraft {
  const parsed = isRecord(raw) ? raw : {};
  const draft: NormalAssessmentDraft = {
    ...defaultNormalAssessment,
    ...(parsed as Partial<NormalAssessmentDraft>),
    schemaVersion: NORMAL_ASSESSMENT_SCHEMA_VERSION,
    researchOutputs: stringList(parsed.researchOutputs, defaultNormalAssessment.researchOutputs),
    experienceAreas: stringList(parsed.experienceAreas, defaultNormalAssessment.experienceAreas),
    goals: stringList(parsed.goals, defaultNormalAssessment.goals),
    opportunityInterests: stringList(parsed.opportunityInterests, defaultNormalAssessment.opportunityInterests),
    evidence: {
      academic: boolish(isRecord(parsed.evidence) ? parsed.evidence.academic : undefined, defaultNormalAssessment.evidence.academic),
      income: boolish(isRecord(parsed.evidence) ? parsed.evidence.income : undefined, defaultNormalAssessment.evidence.income),
      bank: boolish(isRecord(parsed.evidence) ? parsed.evidence.bank : undefined, defaultNormalAssessment.evidence.bank),
      identity: boolish(isRecord(parsed.evidence) ? parsed.evidence.identity : undefined, defaultNormalAssessment.evidence.identity)
    },
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
 * Structural check against the canonical `AssessmentResult` contract. Only the fields the UI and
 * the assistant actually read are asserted, so adding an optional field does not invalidate
 * previously persisted results.
 */
export function isCanonicalAssessmentResult(value: unknown): value is AssessmentResult {
  if (!isRecord(value)) return false;
  if (typeof value.opportunityId !== "string" || typeof value.opportunityName !== "string") return false;

  const eligibility = value.eligibility;
  if (!isRecord(eligibility)) return false;
  if (!isOneOf(eligibility.status, ELIGIBILITY_STATUSES)) return false;
  if (!Array.isArray(eligibility.conditions) || !Array.isArray(eligibility.blockers)) return false;

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

function stringList(value: unknown, fallback: string[]) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [...fallback];
}

function boolish(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

export function buildNormalApplicant(draft?: NormalAssessmentDraft): DemoProfile {
  const name = draft?.name?.trim() || "you";
  const institution = draft?.institution?.trim() || "your institution";
  const programme = draft?.programme?.trim() || "your programme";
  const income = draft?.income?.trim() || "not provided";
  const gender = draft?.gender?.trim() || "not provided";
  const role = draft?.currentStatus ? `${draft.currentStatus} profile` : programme;

  return {
    ...profile,
    id: "normal-visitor",
    name,
    initials: name === "you" ? "YO" : name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    role,
    college: institution,
    institutionType: institution.toLowerCase().includes("aicte") ? "AICTE-approved" : "Not confirmed",
    location: draft?.city?.trim() || "",
    programme,
    course: draft?.field?.trim() || programme,
    year: draft?.currentYear?.trim() || draft?.graduationYear?.trim() || "",
    cgpa: draft?.cgpa?.trim() || (draft?.evidence.academic ? "Academic or role proof added" : "Academic or role proof not added"),
    income,
    gender,
    bank: draft?.evidence.bank ? "Added" : "Not added",
    aadhaar: draft?.evidence.identity ? "Added" : "Not added",
    interests: [...(draft?.goals ?? []), ...(draft?.opportunityInterests ?? [])],
    strengths: draft?.generated ? buildProfileStrengths(draft) : [],
    gaps: draft?.generated ? ["Disha needs more factual evidence to be confident"] : [],
    evidence: [
      draft?.evidence.identity ? { id: "identity", label: "Identity details", summary: "Identity details confirmed", source: "self-reported" as const } : null,
      draft?.evidence.academic ? { id: "academic", label: "Academic or role proof", summary: "Academic or role proof available", source: "self-reported" as const } : null,
      draft?.evidence.income ? { id: "income", label: "Income proof", summary: "Income proof available", source: "self-reported" as const } : null,
      draft?.evidence.bank ? { id: "bank", label: "Bank details", summary: "Bank details available", source: "self-reported" as const } : null,
      draft?.researchExperience && draft.researchExperience !== "no" ? { id: "research", label: "Research", summary: `${draft.researchExperience}${draft.researchOutputs.length ? ` with ${draft.researchOutputs.join(", ")}` : ""}`, source: "activity" as const } : null,
      draft?.ownership ? { id: "work", label: "Work or project ownership", summary: `${draft.ownership}${draft.measurableOutcomes ? `; measurable outcomes: ${draft.measurableOutcomes}` : ""}`, source: "activity" as const } : null,
      draft?.leadership && draft.leadership !== "no" ? { id: "leadership", label: "Leadership", summary: `${draft.leadership}${draft.largestTeam ? ` for ${draft.largestTeam} people` : ""}${draft.leadershipDuration ? ` over ${draft.leadershipDuration}` : ""}`, source: "activity" as const } : null,
      draft?.impactExperience && draft.impactExperience !== "none" ? { id: "impact", label: "Impact", summary: `${draft.impactExperience}; reach ${draft.impactReach || "unknown"}`, source: "activity" as const } : null,
      draft?.startupStage && draft.startupStage !== "none" ? { id: "startup", label: "Startup stage", summary: draft.startupStage, source: "activity" as const } : null
    ].filter(Boolean) as DemoProfile["evidence"]
  };
}

export function responsesFromNormalAssessment(draft: NormalAssessmentDraft | undefined, opportunity: Opportunity): Record<string, string> {
  if (!draft?.generated) return {};
  if (opportunity.category === "Startup Funding") return startupResponses(draft);
  if (opportunity.category === "Research Grants") return researchResponses(draft);
  if (opportunity.category === "Fellowships") return fellowshipResponses(draft);
  if (opportunity.category === "Government Schemes") return governmentSchemeResponses(draft);
  return scholarshipResponses(draft);
}

function startupResponses(draft: NormalAssessmentDraft): Record<string, string> {
  return {
    problemEvidence: draft.measurableOutcomes === "yes" ? "Documented field research" : draft.evidence.academic ? "Founder interviews" : "Desk research",
    prototype: ["active users", "revenue", "funded/incubated"].includes(draft.startupStage) ? "Working prototype tested with users" : draft.startupStage === "prototype/MVP" ? "Clickable prototype" : "Idea only",
    team: draft.ownership === "led multiple projects/team" || draft.leadership === "led significant teams/programs" ? "Product, field and partnerships covered" : draft.programme.trim() ? "Solo founder" : "",
    fundUse: draft.evidence.bank ? "High-level budget" : "Not drafted",
    incubation: draft.evidence.identity ? "No incubator yet" : "",
    impactEvidence: draft.impactExperience === "led an initiative" || draft.impactExperience === "built/ran sustained program" || draft.measurableOutcomes === "yes" ? "Clear outcome metric" : "Impact not defined",
    scalePlan: draft.ownership === "led multiple projects/team" ? "One partner ready" : "No scale plan"
  };
}

function researchResponses(draft: NormalAssessmentDraft): Record<string, string> {
  return {
    novelty: draft.researchExperience === "independent research" || draft.researchExperience === "multiple research experiences" ? "Defined gap with preliminary result" : draft.evidence.academic ? "Defined literature gap" : "Broad idea",
    method: draft.programme.trim() ? "Method drafted" : "Method not drafted",
    trackRecord: draft.researchOutputs.some((output) => ["publication", "preprint", "conference presentation"].includes(output)) ? "Relevant publications" : draft.evidence.academic ? "Early researcher" : "",
    outcomes: draft.researchOutputs.length ? "Outputs listed" : "Outputs not clear"
  };
}

function fellowshipResponses(draft: NormalAssessmentDraft): Record<string, string> {
  return {
    researchFit: draft.programme.trim() ? "Clear research area" : "General interest",
    host: draft.institution.trim() ? "Conversation started" : "Not identified",
    documents: draft.evidence.academic ? "Draft documents" : "Not started"
  };
}

function scholarshipResponses(draft: NormalAssessmentDraft): Record<string, string> {
  return {
    eligibilityProof: draft.evidence.identity && draft.gender ? "Eligible but one document pending" : "Eligibility unclear",
    academicEvidence: draft.evidence.academic ? "Academic record visible but enrolment proof pending" : "Academic record unclear",
    readinessProof: draft.evidence.income && draft.evidence.bank ? "Records aligned" : "One correction needed"
  };
}

function governmentSchemeResponses(draft: NormalAssessmentDraft): Record<string, string> {
  return {
    applicantFit: draft.evidence.identity ? "Likely fit" : "Fit unclear",
    documents: draft.evidence.academic || draft.evidence.income ? "Draft documents" : "Not started",
    authority: draft.institution.trim() ? "Conversation started" : "Not identified"
  };
}

function buildProfileStrengths(draft: NormalAssessmentDraft) {
  return [
    draft.cgpa ? `Academic record: ${draft.cgpa}` : "",
    draft.researchExperience && draft.researchExperience !== "no" ? `Research: ${draft.researchExperience}` : "",
    draft.ownership ? `Ownership: ${draft.ownership}` : "",
    draft.leadership && draft.leadership !== "no" ? `Leadership: ${draft.leadership}` : "",
    draft.impactExperience && draft.impactExperience !== "none" ? `Impact: ${draft.impactExperience}` : "",
    draft.startupStage && draft.startupStage !== "none" ? `Startup stage: ${draft.startupStage}` : ""
  ].filter(Boolean);
}
