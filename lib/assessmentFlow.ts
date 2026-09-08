import type { DemoProfile } from "@/lib/data";
import {
  buildOpportunityAssessmentResult,
  getAssessmentQuestions,
  incomeBandCeiling,
  type AssessmentResult,
  type CoreProfile,
  type EligibilityRule,
  type Opportunity
} from "@/lib/opportunities";

export type FlowQuestion = {
  id: string;
  label: string;
  /** Shown behind a "Why we're asking" disclosure. Must name what the answer changes. */
  why: string;
  options: string[];
  /** Free text is only used where a closed list would be wrong, such as field of study. */
  freeText?: boolean;
  placeholder?: string;
};

export const defaultCoreProfile: CoreProfile = {
  ageBand: "",
  domicile: "",
  educationLevel: "",
  fieldOfStudy: "",
  yearStatus: "",
  academicPerformance: "",
  householdIncome: "",
  qualifiers: {}
};

export const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya",
  "Mizoram", "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Jammu and Kashmir", "Ladakh", "Puducherry", "Chandigarh", "Other"
];

export const incomeBands = [
  "Below ₹1 lakh",
  "₹1-2.5 lakh",
  "₹2.5-4.5 lakh",
  "₹4.5-6 lakh",
  "₹6-8 lakh",
  "Above ₹8 lakh",
  "Prefer not to say"
];

/**
 * The seven questions Disha asks before it will say anything.
 *
 * Each one is here because it changes an answer: it feeds a published eligibility rule or one of
 * the alignment signals. Name, roll number, parent occupation, religion, marital status and hostel
 * status are deliberately absent, because nothing in the catalogue's rules reads them.
 */
export const coreQuestions: FlowQuestion[] = [
  {
    id: "educationLevel",
    label: "What is your current education level?",
    why: "Most opportunities publish a study stage they are open to. This is the single field that rules the most opportunities in or out.",
    options: ["School", "Diploma", "Undergraduate", "Postgraduate", "Doctoral (PhD)", "Post-doctoral or faculty", "Working professional", "Founder"]
  },
  {
    id: "yearStatus",
    label: "Where are you in that programme?",
    why: "Several schemes are open only in specific years, and deadlines are judged against when you finish.",
    options: ["Year 1", "Year 2", "Year 3", "Final year", "Graduated", "Not currently enrolled"]
  },
  {
    id: "fieldOfStudy",
    label: "What is your field or discipline?",
    why: "Used to check whether an opportunity names your discipline. A field Disha cannot match is never treated as a barrier.",
    options: [],
    freeText: true,
    placeholder: "Psychology, computer science, design, biotechnology..."
  },
  {
    id: "academicPerformance",
    label: "What is your most recent academic performance?",
    why: "Merit-based opportunities publish academic thresholds. Where academic record is not a published criterion, Disha labels it as a general readiness signal instead.",
    options: ["Above 85% or 8.5+ CGPA", "70-85% or 7-8.5 CGPA", "60-70% or 6-7 CGPA", "Below 60% or under 6 CGPA", "Not graded yet"]
  },
  {
    id: "domicile",
    label: "Which state are you domiciled in?",
    why: "State schemes and some national schemes restrict by domicile.",
    options: indianStates
  },
  {
    id: "ageBand",
    label: "What is your age?",
    why: "A few schemes publish age limits. Disha only uses a band, never a date of birth.",
    options: ["Under 18", "18-21", "22-25", "26-30", "31-35", "Over 35"]
  },
  {
    id: "householdIncome",
    label: "What is your annual household income?",
    why: "Need-based schemes publish income ceilings. Disha compares the top of the band you choose, so it never reports you as eligible on an optimistic reading.",
    options: incomeBands
  }
];

/**
 * Extra basic questions asked only when an opportunity's own hard rules read a field the core
 * profile does not carry. Capped at two: past that, it stops being a basic assessment.
 */
const qualifierLibrary: Record<string, FlowQuestion> = {
  gender: {
    id: "gender",
    label: "What is your gender?",
    why: "This opportunity restricts eligibility by gender, so the answer decides whether you can apply at all.",
    options: ["Female", "Male", "Other", "Prefer not to say"]
  },
  institutionType: {
    id: "institutionType",
    label: "What kind of institution are you at?",
    why: "This opportunity requires a particular kind of approved institution.",
    options: ["AICTE-approved", "UGC-recognised", "Government / aided", "Private / autonomous", "IIT / IISc / NIT / IISER", "Not sure"]
  },
  category: {
    id: "category",
    label: "Which social category applies to you?",
    why: "This scheme is reserved for a specific category, so it decides eligibility directly.",
    options: ["General", "OBC", "SC", "ST", "EWS", "Prefer not to say"]
  },
  college: {
    id: "college",
    label: "Are you attached to an institution or host organisation?",
    why: "This opportunity is applied for through an institution rather than directly.",
    options: ["Yes, currently enrolled or employed there", "In conversation with one", "No institution yet"]
  },
  role: {
    id: "role",
    label: "Which best describes your current role?",
    why: "This opportunity publishes a role requirement, such as a researcher or faculty route.",
    options: ["Student", "Researcher", "Faculty", "Working professional", "Founder", "Independent"]
  },
  interests: {
    id: "interests",
    label: "What are you pursuing this for?",
    why: "This opportunity runs a specific route, and the answer decides whether that route is the right one for you.",
    options: ["Study or scholarship funding", "Research funding", "A fellowship", "Student innovation funding", "Starting or growing a venture", "A government scheme"]
  },
  startupStage: {
    id: "startupStage",
    label: "What stage is your venture at?",
    why: "Funding routes publish the stage they accept, from idea through to revenue.",
    options: ["No venture yet", "Exploring an idea", "Prototype or MVP", "Active users", "Revenue", "Incorporated and funded"]
  }
};

/** Fields the seven core questions already answer, so an opportunity never asks for them twice. */
const coveredByCoreProfile = new Set(["income", "domicile", "location", "course", "programme", "year", "cgpa", "class12", "age", "citizenship"]);

export function opportunityQualifiers(opportunity: Opportunity): FlowQuestion[] {
  const rules = opportunity.eligibilityRules ?? [];
  const seen = new Set<string>();
  const wanted: FlowQuestion[] = [];

  for (const rule of sortByDecisiveness(rules)) {
    const field = String(rule.profileField);
    if (coveredByCoreProfile.has(field) || seen.has(field)) continue;
    const question = qualifierLibrary[field];
    if (!question) continue;
    seen.add(field);
    wanted.push(question);
    if (wanted.length === 2) break;
  }

  return wanted;
}

function sortByDecisiveness(rules: EligibilityRule[]) {
  const rank = (rule: EligibilityRule) => (rule.hard ? 0 : rule.confidence === "high" ? 1 : rule.confidence === "medium" ? 2 : 3);
  return [...rules].sort((a, b) => rank(a) - rank(b));
}

/** The opportunity-specific deep questions. Already varies by opportunity; surfaced here so the
 * flow has a single place to ask "what is left to ask?". */
export function deepQuestions(opportunity: Opportunity) {
  return getAssessmentQuestions(opportunity);
}

export function coreProfileComplete(core: CoreProfile, opportunity?: Opportunity) {
  const coreAnswered = coreQuestions.every((question) => Boolean(core[question.id as keyof CoreProfile]));
  if (!opportunity) return coreAnswered;
  return coreAnswered && opportunityQualifiers(opportunity).every((question) => Boolean(core.qualifiers[question.id]));
}

/**
 * Builds the applicant the engine evaluates against.
 *
 * Every field starts empty and is filled only from what the person actually told Disha. Nothing is
 * inherited from a sample profile, so an unanswered field reaches the rules as missing and the
 * rule returns "unknown" rather than quietly passing on somebody else's data.
 */
export function applicantFromCoreProfile(core: CoreProfile, name = "you"): DemoProfile {
  const qualifiers = core.qualifiers ?? {};
  const ceiling = core.householdIncome && core.householdIncome !== "Prefer not to say" ? incomeBandCeiling(core.householdIncome) : null;

  return {
    id: "core-profile",
    name,
    initials: name === "you" ? "YO" : name.slice(0, 2).toUpperCase(),
    role: qualifiers.role ?? (core.educationLevel ? `${core.educationLevel} applicant` : ""),
    college: qualifiers.college && qualifiers.college.startsWith("Yes") ? "Institution confirmed" : "",
    institutionType: qualifiers.institutionType && qualifiers.institutionType !== "Not sure" ? qualifiers.institutionType : "",
    location: core.domicile,
    domicile: core.domicile,
    programme: [core.educationLevel, core.fieldOfStudy].filter(Boolean).join(" "),
    course: core.fieldOfStudy,
    year: [core.educationLevel, core.yearStatus].filter(Boolean).join(", "),
    cgpa: core.academicPerformance,
    class12: "",
    income: ceiling === null || ceiling === Number.POSITIVE_INFINITY ? (core.householdIncome === "Above ₹8 lakh" ? "₹9 lakh/year" : "") : `₹${ceiling} lakh/year`,
    phone: "",
    email: "",
    aadhaar: "",
    bank: "",
    gender: qualifiers.gender && qualifiers.gender !== "Prefer not to say" ? qualifiers.gender : "",
    disability: "",
    minority: "",
    category: qualifiers.category && qualifiers.category !== "Prefer not to say" ? qualifiers.category : "",
    interests: interestsFromQualifiers(qualifiers),
    strengths: [],
    gaps: [],
    evidence: coreEvidence(core)
  };
}

function interestsFromQualifiers(qualifiers: Record<string, string>) {
  const map: Record<string, string> = {
    "Study or scholarship funding": "scholarships",
    "Research funding": "research grants",
    "A fellowship": "fellowships",
    "Student innovation funding": "student innovation funding",
    "Starting or growing a venture": "student innovation funding",
    "A government scheme": "government schemes"
  };
  const pursuit = qualifiers.interests ? map[qualifiers.interests] : undefined;
  const stage = qualifiers.startupStage && qualifiers.startupStage !== "No venture yet" ? "student innovation funding" : undefined;
  return Array.from(new Set([pursuit, stage].filter(Boolean) as string[]));
}

function coreEvidence(core: CoreProfile): DemoProfile["evidence"] {
  return [
    core.academicPerformance ? { id: "academic", label: "Academic record", summary: core.academicPerformance, source: "self-reported" as const } : null,
    core.educationLevel ? { id: "stage", label: "Study stage", summary: [core.educationLevel, core.yearStatus].filter(Boolean).join(", "), source: "self-reported" as const } : null,
    core.fieldOfStudy ? { id: "field", label: "Field", summary: core.fieldOfStudy, source: "self-reported" as const } : null
  ].filter(Boolean) as DemoProfile["evidence"];
}

/**
 * The two entry points. Both go through the same engine, so the basic and deep results are the
 * same object shape and can never disagree about eligibility.
 */
export function buildBasicAssessment(opportunity: Opportunity, core: CoreProfile, name?: string): AssessmentResult {
  return buildOpportunityAssessmentResult(opportunity, {}, applicantFromCoreProfile(core, name), { core, depth: "basic" });
}

export function buildDeepAssessment(
  opportunity: Opportunity,
  core: CoreProfile,
  answers: Record<string, string>,
  name?: string
): AssessmentResult {
  return buildOpportunityAssessmentResult(opportunity, answers, applicantFromCoreProfile(core, name), { core, depth: "deep" });
}
