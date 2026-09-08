import { LucideIcon, FlaskConical, GraduationCap, HandCoins, Landmark, Rocket } from "lucide-react";
import { profile, type DemoProfile } from "@/lib/data";

export type OpportunityCategory = "Scholarships" | "Research Grants" | "Fellowships" | "Startup Funding" | "Government Schemes";
export type AssessmentStatus = "Strong" | "Moderate" | "Weak" | "Missing";
export type GateStatus = "Pass" | "Fail" | "Unknown";
export type Provenance = "Official criterion" | "Process-derived" | "Historical" | "Unknown / criteria not publicly disclosed";
export type AssessmentAvailabilityLevel = "full" | "partial" | "discovery";
export type ImportanceLevel = "High" | "Medium" | "Low";
export type FixabilityLevel = "Easy" | "Moderate" | "Hard" | "Not fixable before deadline";
export type RecommendationLevel = "Strongly pursue" | "Worth pursuing" | "Pursue after improving" | "Low priority" | "Verify eligibility" | "Do not apply" | "Insufficient information";
export type RecommendationKey = "strongly_pursue" | "worth_pursuing" | "pursue_after_improving" | "low_priority" | "verify_eligibility" | "do_not_apply" | "insufficient_information";
export type EligibilityStatus = "eligible" | "ineligible" | "uncertain";
export type EligibilityConditionResult = "pass" | "fail" | "unknown";
export type EligibilityOperator = "equals" | "not_equals" | "includes" | "excludes" | "one_of" | "gte" | "lte" | "between" | "boolean" | "exists";
export type CompetitivenessBand = "strong" | "competitive" | "developing" | "weak" | "unknown";
export type CriterionBasis = "explicit" | "strongly_inferred" | "weakly_inferred" | "unknown";
export type EvidenceStrength = "strong" | "credible" | "weak" | "claim_only" | "none" | "unknown";
export type EvidenceScore = 0 | 1 | 2 | 3 | 4 | null;
export type RecommendationVerdict =
  | "strong_opportunity"
  | "worth_applying"
  | "improve_before_applying"
  | "low_priority"
  | "verify_eligibility"
  | "do_not_apply"
  | "insufficient_information";
export type ConfidenceLevel = "high" | "medium" | "low";

export type EligibilityRule = {
  id: string;
  label: string;
  profileField: keyof DemoProfile | "age" | "citizenship" | "startupStage" | "organisationType";
  operator: EligibilityOperator;
  value?: string | number | boolean | string[] | [number, number];
  hard?: boolean;
  source?: string;
  confidence?: ConfidenceLevel;
};

export type EvidenceFact = {
  type: "academic" | "research" | "leadership" | "impact" | "work" | "startup" | "award" | "output" | "document";
  role?: string;
  ownership?: "assisted" | "individual" | "workstream" | "lead";
  teamSize?: number;
  durationMonths?: number;
  outputs?: string[];
  outcomes?: string[];
  verification?: "self_reported" | "described" | "documented" | "externally_verifiable";
  summary: string;
};

/**
 * The minimum information Disha asks before it will say anything: enough to run an opportunity's
 * hard eligibility rules and to place a few named alignment signals. Everything deeper is opt-in.
 */
export type CoreProfile = {
  ageBand: string;
  domicile: string;
  educationLevel: string;
  fieldOfStudy: string;
  yearStatus: string;
  academicPerformance: string;
  householdIncome: string;
  /** Opportunity-specific answers asked only where a hard rule genuinely needs them. */
  qualifiers: Record<string, string>;
};

export type FitBand = "strong" | "moderate" | "low" | "unknown";
export type AssessmentDepth = "basic" | "deep";

/**
 * One named alignment signal. Every field exists so the UI can show the trace: what the applicant
 * said, what it was compared against, and where that comparison came from.
 */
export type InitialFitSignal = {
  id: string;
  label: string;
  band: FitBand;
  userValue: string;
  comparedWith: string;
  explanation: string;
  source?: string;
  /**
   * False for signals that are informational only. A fuzzy match against published prose can
   * confirm a fit but must never be the reason one is downgraded, so it is shown and explained
   * without entering the aggregate.
   */
  affectsBand: boolean;
};

export type InitialFit = {
  band: FitBand;
  /** The aggregation rule in words, so the band is never an unexplained verdict. */
  rule: string;
  signals: InitialFitSignal[];
  reasons: string[];
  missingInformation: string[];
};

export type AssessmentResult = {
  opportunityId: string;
  profileId?: string;
  opportunityName: string;
  applicantId: string;
  eligibility: {
    status: EligibilityStatus;
    conditions: {
      id: string;
      label: string;
      result: EligibilityConditionResult;
      userValue?: string;
      requiredValue?: string;
      explanation: string;
      source?: string;
    }[];
    blockers: string[];
  };
  /** "basic" was produced from the core profile alone; "deep" also used opportunity questions. */
  depth: AssessmentDepth;
  initialFit: InitialFit;
  coverage: {
    checkedCriteria: number;
    totalCriteria: number;
    answeredQuestions: number;
    remainingQuestions: number;
  };
  competitiveness: {
    score: number | null;
    band: CompetitivenessBand;
    assessedWeightPercent: number;
    criteria: {
      id: string;
      label: string;
      importance: "high" | "medium" | "low";
      weight: number;
      basis: CriterionBasis;
      evidenceStrength: EvidenceStrength;
      evidenceScore: EvidenceScore;
      explanation: string;
      evidenceFromProfile?: string[];
      source?: string;
    }[];
  };
  strengths: string[];
  gaps: {
    label: string;
    severity: "critical" | "important" | "minor";
    improvable: boolean;
    suggestion?: string;
  }[];
  recommendation: {
    verdict: RecommendationVerdict;
    explanation: string;
  };
  confidence: {
    level: ConfidenceLevel;
    publicCriteriaCoverage: number;
    userEvidenceCoverage: number;
    explanation: string;
  };
  evidenceFacts?: EvidenceFact[];
  previousAssessment?: Pick<AssessmentResult, "competitiveness" | "recommendation">;
  overallAssessment: string;
  strongestEvidence: string;
  biggestGap: {
    criterionId: string;
    criterion: string;
    summary: string;
    whyItMatters: string;
    action: string;
  } | null;
  nextAction: string;
  effortVsUpside: {
    effort: "Low" | "Moderate" | "High";
    upside: string;
    rationale: string;
  };
  recommendationLabel: RecommendationLevel;
  recommendationKey: RecommendationKey;
  improvementActions: string[];
  generatedAt: string;
};

export type SelectionCriterion = {
  label: string;
  source: Provenance;
  note?: string;
};

export type ApplicationStep = {
  label: string;
  owner: string;
  status?: "completed" | "current" | "waiting" | "blocked";
};

export type AssessmentDimension = {
  id: string;
  label: string;
  weight?: string;
  candidateEvidence: string;
  state: "strong" | "moderate" | "weak" | "unknown";
  explanation: string;
  source?: Provenance;
};

export type StructuredAssessment = {
  availability: AssessmentAvailabilityLevel;
  note: string;
  dimensions?: AssessmentDimension[];
  strengths?: string[];
  gaps?: string[];
  improvementActions?: string[];
};

export type Opportunity = {
  id: string;
  name: string;
  provider: string;
  category: OpportunityCategory;
  targetApplicant: string;
  funding: string;
  deadline: string;
  status: "Open" | "Upcoming" | "Rolling" | "Closed";
  applicationStatus?: "Not started" | "Considering" | "Assessing" | "In progress" | "Submitted" | "Tracking" | "Renewal";
  officialSource?: string;
  location?: string;
  description: string;
  stage: string;
  eligibility: string[];
  eligibilityRules?: EligibilityRule[];
  access: string[];
  readiness: string[];
  selectionCriteria?: SelectionCriterion[];
  assessment?: StructuredAssessment;
  applicationSteps?: ApplicationStep[];
  tags: string[];
  featured?: boolean;
  evaluatorCriteria?: EvaluatorCriterion[];
};

export type EvaluatorCriterion = {
  id: string;
  criterion: string;
  signal: string;
  answerKey: string;
  strongAnswers: string[];
  moderateAnswers: string[];
  evidence: Partial<Record<string, string>>;
  weakGap: string;
  moderateGap: string;
  strongGap: string;
  action: string;
  source: Provenance;
  confidence: "High" | "Medium" | "Low";
  importance?: ImportanceLevel;
  weight?: number;
  basis?: CriterionBasis;
  expectedEvidence?: string;
  fixability?: FixabilityLevel;
  profileEvidenceIds?: string[];
  likelyEffect?: string;
};

export type AssessmentQuestion = {
  id: string;
  label: string;
  options: string[];
};

export type EvaluatedCriterion = EvaluatorCriterion & {
  status: AssessmentStatus;
  evidenceFound: string;
  gap: string;
};

export type OpportunityAssessment = {
  access: { label: string; status: GateStatus; note: string }[];
  eligibility: { label: string; status: GateStatus; note: string }[];
  readiness: { label: string; status: GateStatus; note: string }[];
  criteria: EvaluatedCriterion[];
  demonstratedSignals: number;
  totalSignals: number;
  biggestGap: EvaluatedCriterion | null;
  nextActions: string[];
};

export const categoryDefinitions: {
  name: OpportunityCategory;
  icon: LucideIcon;
  tone: string;
  description: string;
}[] = [
  { name: "Scholarships", icon: GraduationCap, tone: "bg-[#F6E9D3] text-[#8A572A]", description: "For school, UG, PG and more" },
  { name: "Research Grants", icon: FlaskConical, tone: "bg-[#E4EEF9] text-[#255680]", description: "For researchers, faculty and labs" },
  { name: "Fellowships", icon: HandCoins, tone: "bg-[#E3F1EA] text-[#25634B]", description: "For study, research, leadership and more" },
  { name: "Startup Funding", icon: Rocket, tone: "bg-[#F8E8DE] text-[#994F35]", description: "For early-stage founders and innovators" },
  { name: "Government Schemes", icon: Landmark, tone: "bg-[#E8E7F6] text-[#423C8A]", description: "For citizens, innovators and organisations" }
];

const startupSeedCriteria: EvaluatorCriterion[] = [
  {
    id: "problem-validation",
    criterion: "Problem and market validation",
    signal: "Evidence that the startup is solving a real, specific problem for a reachable user group.",
    answerKey: "problemEvidence",
    strongAnswers: ["Paid pilots or repeated users", "Documented field research"],
    moderateAnswers: ["Founder interviews", "Desk research"],
    evidence: {
      "Paid pilots or repeated users": "Pilot interest from 3 colleges and repeated usage by 42 student applicants.",
      "Documented field research": "Structured interviews with 30 applicants and 8 institution officers.",
      "Founder interviews": "Founder interviews identify the scholarship verification problem.",
      "Desk research": "Desk research shows funding discovery is fragmented."
    },
    weakGap: "Problem evidence is still mostly asserted, so evaluators may not see enough proof of demand.",
    moderateGap: "The user pain is visible, but the application will be stronger with repeat usage or pilot data.",
    strongGap: "Validation is credible; connect it directly to the funded milestones.",
    action: "Add one pilot note with user count, setting, observed behavior and what changed after feedback.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "feasibility",
    criterion: "Feasibility",
    signal: "Whether the proposed solution can be built and deployed with the requested seed support.",
    answerKey: "prototype",
    strongAnswers: ["Working prototype tested with users"],
    moderateAnswers: ["Clickable prototype", "Technical proof of concept"],
    evidence: {
      "Working prototype tested with users": "Working prototype tested with 30 users across discovery and readiness tasks.",
      "Clickable prototype": "Clickable prototype explains the intended product journey.",
      "Technical proof of concept": "Technical proof of concept exists, but end-to-end usage is not yet shown."
    },
    weakGap: "Feasibility is hard to judge without a working prototype or technical proof.",
    moderateGap: "The prototype proves direction, but user-tested workflows would make this stronger.",
    strongGap: "Prototype feasibility is strong; show deployment constraints and support plan.",
    action: "Run a small production-context pilot and document completion rates, blockers and support needs.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "team",
    criterion: "Team capability",
    signal: "Evidence that the team can execute product, field operations and institutional partnerships.",
    answerKey: "team",
    strongAnswers: ["Product, field and partnerships covered"],
    moderateAnswers: ["Technical founder plus advisor"],
    evidence: {
      "Product, field and partnerships covered": "Team covers product development, scholarship operations and college partnerships.",
      "Technical founder plus advisor": "Technical capacity exists with external guidance for public-program operations."
    },
    weakGap: "Evaluator may not see who owns field rollout or institutional coordination.",
    moderateGap: "Core build capacity is visible, but execution ownership beyond the founder is thin.",
    strongGap: "Team coverage is clear; define named owners for the next two milestones.",
    action: "Attach a milestone table that names the owner for product, outreach, compliance and reporting.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "fund-use",
    criterion: "Use of funds",
    signal: "A clear connection between grant amount, milestones and eligible seed-fund use.",
    answerKey: "fundUse",
    strongAnswers: ["Milestone budget with quotes"],
    moderateAnswers: ["High-level budget"],
    evidence: {
      "Milestone budget with quotes": "Budget maps each cost to pilots, onboarding, verification tooling and reporting.",
      "High-level budget": "Budget categories exist but are not yet tied to measurable milestones."
    },
    weakGap: "The funding ask does not yet show how money converts into progress.",
    moderateGap: "Budget is plausible, but lacks evidence behind major line items.",
    strongGap: "Budget is strong; add a short contingency note for delayed pilots.",
    action: "Break the ask into 3 milestones with cost, evidence produced and decision gate.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "incubator-fit",
    criterion: "Incubator and process fit",
    signal: "Whether access requirements such as incubator affiliation and process readiness are satisfied.",
    answerKey: "incubation",
    strongAnswers: ["Incubated with recommended incubator"],
    moderateAnswers: ["Incubator conversations started"],
    evidence: {
      "Incubated with recommended incubator": "Recognized incubator relationship is in place for application routing.",
      "Incubator conversations started": "Incubator conversations have begun, but endorsement is not secured."
    },
    weakGap: "Application access may be blocked if the incubator route is unresolved.",
    moderateGap: "The path is plausible, but the endorsement remains the main access risk.",
    strongGap: "Access route is strong; keep endorsement letter and routing contact ready.",
    action: "Secure a dated incubator note confirming application support and milestone oversight.",
    source: "Process-derived",
    confidence: "Medium"
  },
  {
    id: "impact",
    criterion: "Impact",
    signal: "Evidence that the product can produce measurable benefit for users or public-program delivery.",
    answerKey: "impactEvidence",
    strongAnswers: ["Measured outcome from pilot"],
    moderateAnswers: ["Clear outcome metric"],
    evidence: {
      "Measured outcome from pilot": "Pilot reduced missed-document corrections from 6 to 2 in a sample journey.",
      "Clear outcome metric": "Application defines measurable outcomes for discovery, readiness and verification delays."
    },
    weakGap: "Impact is described, but not tied to a measurable before-and-after outcome.",
    moderateGap: "The metric is clear; evaluators will want early measured evidence.",
    strongGap: "Impact evidence is strong; explain sample size and limits honestly.",
    action: "Choose one metric for the next pilot: completed applications, fewer return requests or days saved.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "scalability",
    criterion: "Scalability",
    signal: "Whether the model can expand beyond one campus or applicant segment.",
    answerKey: "scalePlan",
    strongAnswers: ["Repeatable rollout plan"],
    moderateAnswers: ["One partner ready"],
    evidence: {
      "Repeatable rollout plan": "Rollout plan separates student onboarding, institution support and opportunity updates.",
      "One partner ready": "One partner can validate rollout, but repeatability is not yet proven."
    },
    weakGap: "The application may read as a single-campus pilot without a route to repeatability.",
    moderateGap: "A first partner helps; document what will be standardized for the second site.",
    strongGap: "Scale story is clear; keep the plan realistic for seed-stage funding.",
    action: "Add a two-site rollout sequence with what stays standard and what changes by context.",
    source: "Historical",
    confidence: "Medium"
  }
];

const anrfCriteria: EvaluatorCriterion[] = [
  {
    id: "novelty",
    criterion: "Research novelty",
    signal: "Clear original contribution beyond existing literature.",
    answerKey: "novelty",
    strongAnswers: ["Defined gap with preliminary result"],
    moderateAnswers: ["Defined literature gap"],
    evidence: {
      "Defined gap with preliminary result": "Proposal identifies a specific gap and includes a preliminary experiment.",
      "Defined literature gap": "Literature gap is stated, but early proof is limited."
    },
    weakGap: "The idea may appear incremental without a sharper research gap.",
    moderateGap: "Novelty is plausible, but preliminary evidence would make it more credible.",
    strongGap: "Novelty is strong; connect it to the methods and expected outputs.",
    action: "Add a one-page novelty note comparing the proposal against 4 recent papers.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "methodology",
    criterion: "Methodology and feasibility",
    signal: "Sound research design, timeline and available infrastructure.",
    answerKey: "method",
    strongAnswers: ["Validated method and host infrastructure"],
    moderateAnswers: ["Method drafted"],
    evidence: {
      "Validated method and host infrastructure": "Method, timeline and equipment access are documented by the host lab.",
      "Method drafted": "Research design exists, but dependencies and validation are not fully shown."
    },
    weakGap: "Methods are too broad for reviewers to judge feasibility.",
    moderateGap: "Method is present, but needs risk controls and infrastructure confirmation.",
    strongGap: "Method is strong; add a short risk-mitigation paragraph.",
    action: "Add milestones, required equipment and fallback methods for the highest-risk step.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "track-record",
    criterion: "Investigator track record",
    signal: "Relevant publications, prior grants, collaborations or technical outputs.",
    answerKey: "trackRecord",
    strongAnswers: ["Relevant publications and prior grant"],
    moderateAnswers: ["Relevant publications"],
    evidence: {
      "Relevant publications and prior grant": "Applicant has publications in the area and prior grant execution evidence.",
      "Relevant publications": "Applicant has publications, but prior grant-management evidence is not visible."
    },
    weakGap: "Reviewers may not see enough evidence of delivery capability.",
    moderateGap: "Research credibility is visible; execution evidence would strengthen it.",
    strongGap: "Track record is strong; foreground the most relevant outputs.",
    action: "Move the two most relevant outputs into the proposal summary instead of leaving them in the CV only.",
    source: "Official criterion",
    confidence: "High"
  },
  {
    id: "outcomes",
    criterion: "Expected outcomes",
    signal: "Specific outputs such as publications, datasets, prototypes, policy insight or trained researchers.",
    answerKey: "outcomes",
    strongAnswers: ["Outputs with users or dissemination plan"],
    moderateAnswers: ["Outputs listed"],
    evidence: {
      "Outputs with users or dissemination plan": "Outputs are tied to publications, shared dataset and stakeholder dissemination.",
      "Outputs listed": "Outputs are named, but route to users or dissemination is limited."
    },
    weakGap: "Expected outputs are not concrete enough for reviewers.",
    moderateGap: "Outputs are concrete; add audience, repository or dissemination route.",
    strongGap: "Outcomes are strong; define success indicators for each.",
    action: "Add success indicators for the main output and who will use it.",
    source: "Official criterion",
    confidence: "High"
  }
];

const pragatiCriteria: EvaluatorCriterion[] = [
  {
    id: "hard-eligibility",
    criterion: "Hard eligibility",
    signal: "Woman student in AICTE-approved technical education with income within the notified limit.",
    answerKey: "eligibilityProof",
    strongAnswers: ["All documents ready"],
    moderateAnswers: ["Eligible but one document pending"],
    evidence: {
      "All documents ready": "Gender, income, admission and AICTE institution evidence are available.",
      "Eligible but one document pending": "Ananya appears eligible: female student, AICTE-approved B.Tech programme, and family income within the stated limit. The income certificate should be refreshed before final submission."
    },
    weakGap: "Hard eligibility cannot be confirmed from current documents.",
    moderateGap: "Formal eligibility looks aligned, but an outdated income proof can block submission or institution verification.",
    strongGap: "Eligibility evidence is complete; keep documents current through verification.",
    action: "Refresh the income certificate and keep admission proof attached before final submission.",
    source: "Official criterion",
    confidence: "High",
    importance: "High",
    fixability: "Easy",
    likelyEffect: "Without current proof, the application may be returned even if Ananya is formally eligible."
  },
  {
    id: "academic-institution-evidence",
    criterion: "Academic and institution evidence",
    signal: "Current academic record and institution enrolment are clear enough for college verification.",
    answerKey: "academicEvidence",
    strongAnswers: ["Current marksheet and enrolment proof ready"],
    moderateAnswers: ["Academic record visible but enrolment proof pending"],
    evidence: {
      "Current marksheet and enrolment proof ready": "8.3 CGPA, Class 12 marks and AICTE institution enrolment proof are ready.",
      "Academic record visible but enrolment proof pending": "Academic performance is strong, but the latest enrolment proof still needs to be attached."
    },
    weakGap: "Academic or institution evidence is not clear enough for verification.",
    moderateGap: "Academic strength is visible, but institution verification may ask for the latest enrolment proof.",
    strongGap: "Academic and institution evidence is strong; keep the latest proof attached.",
    action: "Attach the current enrolment proof with the marksheet packet.",
    source: "Process-derived",
    confidence: "High",
    importance: "High",
    fixability: "Easy",
    profileEvidenceIds: ["cgpa"],
    likelyEffect: "Strong academic evidence supports the application, while missing enrolment proof can slow institution verification."
  },
  {
    id: "readiness",
    criterion: "Application readiness",
    signal: "Current academic, bank and institution details are aligned for NSP and payment checks.",
    answerKey: "readinessProof",
    strongAnswers: ["Records aligned"],
    moderateAnswers: ["One correction needed"],
    evidence: {
      "Records aligned": "Academic, Aadhaar and bank details match the application profile.",
      "One correction needed": "Application is mostly ready, but beneficiary-name consistency should be checked before payment validation."
    },
    weakGap: "The application may be returned during verification or payment validation if details do not align.",
    moderateGap: "A small identity/name consistency correction remains before submission.",
    strongGap: "Readiness is strong; submit before the deadline buffer closes.",
    action: "Use the full legal name Ananya Rao consistently across the application and bank details.",
    source: "Process-derived",
    confidence: "Medium",
    importance: "High",
    fixability: "Moderate",
    likelyEffect: "If left unresolved, the issue can reappear as a payment blocker after approval."
  }
];

export const assessmentQuestions: Record<OpportunityCategory, AssessmentQuestion[]> = {
  "Startup Funding": [
    { id: "problemEvidence", label: "What evidence shows the problem exists?", options: ["", "Desk research", "Founder interviews", "Documented field research", "Paid pilots or repeated users"] },
    { id: "prototype", label: "What stage is your product currently at?", options: ["", "Idea only", "Clickable prototype", "Technical proof of concept", "Working prototype tested with users"] },
    { id: "team", label: "Who can execute the plan?", options: ["", "Solo founder", "Technical founder plus advisor", "Product, field and partnerships covered"] },
    { id: "fundUse", label: "How specific is your use of funds?", options: ["", "Not drafted", "High-level budget", "Milestone budget with quotes"] },
    { id: "incubation", label: "What is your incubator status?", options: ["", "No incubator yet", "Incubator conversations started", "Incubated with recommended incubator"] },
    { id: "impactEvidence", label: "How will impact be shown?", options: ["", "Impact not defined", "Clear outcome metric", "Measured outcome from pilot"] },
    { id: "scalePlan", label: "How repeatable is the rollout?", options: ["", "No scale plan", "One partner ready", "Repeatable rollout plan"] }
  ],
  "Research Grants": [
    { id: "novelty", label: "How clear is the research novelty?", options: ["", "Broad idea", "Defined literature gap", "Defined gap with preliminary result"] },
    { id: "method", label: "How mature is the methodology?", options: ["", "Method not drafted", "Method drafted", "Validated method and host infrastructure"] },
    { id: "trackRecord", label: "What relevant track record is visible?", options: ["", "Early researcher", "Relevant publications", "Relevant publications and prior grant"] },
    { id: "outcomes", label: "How concrete are expected outcomes?", options: ["", "Outputs not clear", "Outputs listed", "Outputs with users or dissemination plan"] }
  ],
  Fellowships: [
    { id: "researchFit", label: "How strong is the fellowship fit?", options: ["", "General interest", "Clear research area", "Published work in the area"] },
    { id: "host", label: "Is the host/supervisor route ready?", options: ["", "Not identified", "Conversation started", "Host confirmation ready"] },
    { id: "documents", label: "Are core documents ready?", options: ["", "Not started", "Draft documents", "Final documents ready"] }
  ],
  Scholarships: [
    { id: "eligibilityProof", label: "Hard eligibility evidence to use", options: ["", "Eligibility unclear", "Eligible but one document pending", "All documents ready"] },
    { id: "academicEvidence", label: "Academic and institution evidence to use", options: ["", "Academic record unclear", "Academic record visible but enrolment proof pending", "Current marksheet and enrolment proof ready"] },
    { id: "readinessProof", label: "Verification readiness evidence to use", options: ["", "Records mismatch", "One correction needed", "Records aligned"] }
  ],
  "Government Schemes": [
    { id: "applicantFit", label: "Does the applicant fit the scheme route?", options: ["", "Fit unclear", "Likely fit", "Fit confirmed"] },
    { id: "documents", label: "Are scheme documents ready?", options: ["", "Not started", "Draft documents", "Final documents ready"] },
    { id: "authority", label: "Is a required authority/partner involved?", options: ["", "Not identified", "Conversation started", "Confirmation ready"] }
  ]
};

export const sampleAssessmentResponses: Record<string, Record<string, string>> = {
  "startup-india-seed-fund": {
    problemEvidence: "Documented field research",
    prototype: "Working prototype tested with users",
    team: "Technical founder plus advisor",
    fundUse: "Not drafted",
    incubation: "Incubator conversations started",
    impactEvidence: "Clear outcome metric",
    scalePlan: "No scale plan"
  },
  "anrf-advanced-research-grant": {
    novelty: "Defined gap with preliminary result",
    method: "Method drafted",
    trackRecord: "Relevant publications",
    outcomes: "Outputs listed"
  },
  "aicte-pragati-scholarship": {
    eligibilityProof: "Eligible but one document pending",
    academicEvidence: "Current marksheet and enrolment proof ready",
    readinessProof: "One correction needed"
  }
};

export const opportunities: Opportunity[] = [
  {
    id: "startup-india-seed-fund",
    name: "Startup India Seed Fund Scheme (SISFS)",
    provider: "DPIIT, Government of India",
    category: "Startup Funding",
    targetApplicant: "Early-stage startups through eligible incubators",
    funding: "Up to Rs 20 lakh for proof of concept; up to Rs 50 lakh for market entry",
    deadline: "Open through incubator calls",
    status: "Open",
    applicationStatus: "Assessing",
    officialSource: "Startup India / DPIIT scheme information",
    location: "India",
    description: "Seed support for startups working on proof of concept, prototype development, product trials, market entry or commercialization.",
    stage: "Seed / prototype",
    eligibility: ["DPIIT-recognized startup", "Incorporated not more than 2 years at application", "Indian promoter shareholding expectations"],
    eligibilityRules: [
      { id: "startup-route", label: "Startup or innovation route is relevant", profileField: "interests", operator: "includes", value: "student innovation funding", source: "Startup India / DPIIT scheme information", confidence: "medium" },
      { id: "startup-india-location", label: "India-based applicant context", profileField: "location", operator: "exists", source: "Startup India / DPIIT scheme information", confidence: "medium" },
      { id: "incubator-process", label: "Incubator route can be pursued", profileField: "interests", operator: "includes", value: "student innovation funding", source: "Startup India / DPIIT scheme information", confidence: "medium" }
    ],
    access: ["Apply through a selected incubator", "Incubator evaluation and due diligence", "Milestone-based disbursement"],
    readiness: ["Pitch deck", "Prototype evidence", "Budget and fund-utilisation plan", "Incorporation and DPIIT recognition"],
    selectionCriteria: [
      { label: "Problem and market validation", source: "Official criterion" },
      { label: "Feasibility and prototype readiness", source: "Official criterion" },
      { label: "Team capability and use of funds", source: "Official criterion" }
    ],
    assessment: {
      availability: "full",
      note: "Full demo assessment is available because Disha has selection signals, sample applicant evidence and improvement actions for this opportunity.",
      strengths: ["Prototype and field-research evidence are available", "Problem statement is tied to student applicant workflows"],
      gaps: ["Fund-utilisation milestones need sharper evidence", "Scale plan needs a repeatable rollout sequence"],
      improvementActions: ["Turn the budget into 3 measurable milestones", "Add one two-site rollout note"]
    },
    applicationSteps: [
      { label: "Assess fit", owner: "Student", status: "current" },
      { label: "Apply through incubator", owner: "Incubator", status: "waiting" },
      { label: "Pitch review", owner: "Pitch panel", status: "waiting" },
      { label: "Milestone release", owner: "DPIIT / incubator", status: "waiting" }
    ],
    tags: ["Prototype", "Seed", "DPIIT", "Incubator"],
    featured: true,
    evaluatorCriteria: startupSeedCriteria
  },
  {
    id: "anrf-advanced-research-grant",
    name: "ANRF Advanced Research Grant (ARG)",
    provider: "Anusandhan National Research Foundation",
    category: "Research Grants",
    targetApplicant: "Researchers and faculty at eligible institutions",
    funding: "Project grant support, typically multi-year",
    deadline: "Open calls vary by scheme",
    status: "Open",
    applicationStatus: "Submitted",
    officialSource: "ANRF scheme and call information",
    location: "India",
    description: "Research support for ambitious projects with a strong scientific question, credible methodology and investigator capability.",
    stage: "Research proposal",
    eligibility: ["Eligible host institution", "Principal investigator affiliation", "Research proposal within call scope"],
    eligibilityRules: [
      { id: "host-institution", label: "Host institution is identified", profileField: "college", operator: "exists", source: "ANRF scheme and call information", confidence: "high" },
      { id: "research-role", label: "Researcher or faculty profile", profileField: "role", operator: "includes", value: "research", source: "ANRF scheme and call information", confidence: "medium" },
      { id: "proposal-scope", label: "Proposal or research field is known", profileField: "programme", operator: "exists", source: "ANRF scheme and call information", confidence: "high" }
    ],
    access: ["Host institution endorsement", "Online proposal submission", "Ethics or institutional approvals where applicable"],
    readiness: ["Detailed proposal", "Budget", "CV and publications", "Institution endorsement", "Preliminary evidence where available"],
    selectionCriteria: [
      { label: "Research novelty", source: "Official criterion" },
      { label: "Methodology and feasibility", source: "Official criterion" },
      { label: "Investigator track record", source: "Official criterion" },
      { label: "Expected outcomes", source: "Official criterion" }
    ],
    assessment: {
      availability: "full",
      note: "Full demo assessment is available for the research proposal lens.",
      strengths: ["Novelty is stated with preliminary evidence", "Publications support the applicant's research direction"],
      gaps: ["Method risks and dissemination details need more explicit treatment"],
      improvementActions: ["Add a one-page novelty comparison", "Attach milestones and fallback methods"]
    },
    applicationSteps: [
      { label: "Institution endorsement", owner: "Host institution", status: "completed" },
      { label: "Administrative screening", owner: "ANRF desk", status: "completed" },
      { label: "Scientific review", owner: "Review panel", status: "current" },
      { label: "Funding decision", owner: "ANRF", status: "waiting" }
    ],
    tags: ["Faculty", "Research", "ANRF", "Proposal"],
    featured: true,
    evaluatorCriteria: anrfCriteria
  },
  {
    id: "pmrf",
    name: "Prime Minister's Research Fellowship",
    provider: "Ministry of Education",
    category: "Fellowships",
    targetApplicant: "High-performing doctoral candidates at selected institutions",
    funding: "Fellowship plus research contingency support",
    deadline: "Institutional cycles vary",
    status: "Open",
    applicationStatus: "Considering",
    officialSource: "Ministry of Education / institution PMRF information",
    location: "Eligible Indian institutions",
    description: "A fellowship route for strong PhD candidates pursuing research in priority areas at eligible institutions.",
    stage: "Doctoral research",
    eligibility: ["PhD admission or migration route", "Eligible institution", "Strong academic record"],
    access: ["Institutional nomination or approved application route", "Research proposal", "Supervisor support"],
    readiness: ["Research statement", "Supervisor endorsement", "Academic records", "Publications or research evidence"],
    selectionCriteria: [
      { label: "Academic record", source: "Official criterion" },
      { label: "Research proposal fit", source: "Process-derived" },
      { label: "Supervisor or institutional route", source: "Process-derived" }
    ],
    assessment: {
      availability: "partial",
      note: "Partial assessment only: Disha has eligibility and programme information, but not enough opportunity-specific evidence to score a full evaluator lens.",
      strengths: ["Academic and research-interest fit can be reviewed"],
      gaps: ["Detailed fellowship-specific evaluation is unavailable in the demo dataset"],
      improvementActions: ["Confirm the institution route and supervisor support before investing in a full packet"]
    },
    applicationSteps: [
      { label: "Confirm route", owner: "Student / institution", status: "current" },
      { label: "Prepare research statement", owner: "Student", status: "waiting" },
      { label: "Institutional review", owner: "Institution", status: "waiting" }
    ],
    tags: ["PhD", "Research", "Fellowship"],
    featured: true
  },
  {
    id: "aicte-pragati-scholarship",
    name: "AICTE Pragati Scholarship",
    provider: "AICTE",
    category: "Scholarships",
    targetApplicant: "Women students in technical education",
    funding: "Rs 50,000 per year",
    deadline: "Apply by 31 Oct 2025",
    status: "Open",
    applicationStatus: "In progress",
    officialSource: "AICTE / NSP scholarship information",
    location: "India",
    description: "Scholarship support for women students admitted to eligible AICTE-approved technical degree or diploma programs.",
    stage: "Undergraduate / diploma study",
    eligibility: ["Woman student", "AICTE-approved institution", "Family income within notified limit"],
    eligibilityRules: [
      { id: "woman-student", label: "Woman student", profileField: "gender", operator: "equals", value: "Female", source: "AICTE / NSP scholarship information", confidence: "high" },
      { id: "technical-programme", label: "Technical degree or diploma programme", profileField: "course", operator: "one_of", value: ["engineering", "technology", "technical", "computer", "electronics", "mechanical", "civil", "pharmacy", "architecture", "diploma", "b.tech", "b.e"], source: "AICTE / NSP scholarship information", confidence: "high" },
      { id: "approved-institution", label: "AICTE-approved institution", profileField: "institutionType", operator: "equals", value: "AICTE-approved", source: "AICTE / NSP scholarship information", confidence: "high" },
      { id: "income-limit", label: "Family income within Rs 8 lakh", profileField: "income", operator: "lte", value: 8, source: "AICTE / NSP scholarship information", confidence: "high" }
    ],
    access: ["Institution record verification", "Scholarship portal application", "Bank and Aadhaar alignment"],
    readiness: ["Admission proof", "Income certificate", "Bank details", "Institution verification"],
    selectionCriteria: [
      { label: "Hard eligibility", source: "Official criterion" },
      { label: "Application readiness", source: "Process-derived" }
    ],
    assessment: {
      availability: "full",
      note: "Full demo assessment is available for eligibility and readiness, without inventing selection probability.",
      strengths: ["Ananya is a woman student in an AICTE-approved technical programme", "Academic and bank profile data are mostly complete"],
      gaps: ["One current document may be needed before submission"],
      improvementActions: ["Refresh the income certificate and attach enrolment proof"]
    },
    applicationSteps: [
      { label: "Strengthen evidence", owner: "Student", status: "current" },
      { label: "Submit application", owner: "Student", status: "waiting" },
      { label: "Institution verification", owner: "Institution", status: "waiting" },
      { label: "Payment validation", owner: "PFMS / Bank", status: "waiting" }
    ],
    tags: ["Women", "Technical education", "AICTE"],
    featured: true,
    evaluatorCriteria: pragatiCriteria
  },
  {
    id: "biotechnology-ignition-grant",
    name: "Biotechnology Ignition Grant (BIG)",
    provider: "BIRAC",
    category: "Startup Funding",
    targetApplicant: "Biotech innovators and early-stage entrepreneurs",
    funding: "Up to Rs 50 lakh",
    deadline: "Biannual calls",
    status: "Upcoming",
    applicationStatus: "Considering",
    officialSource: "BIRAC BIG programme information",
    description: "Funding for proof-of-concept validation in biotechnology and life-sciences innovation.",
    stage: "Proof of concept",
    eligibility: ["Indian applicant or startup", "Biotech innovation", "Incubator or BIG partner route"],
    access: ["BIG partner application", "Technical review", "Milestone monitoring"],
    readiness: ["Technical note", "Prototype or experiment plan", "Budget", "IP status"],
    assessment: {
      availability: "discovery",
      note: "Discovery only: Disha has basic opportunity details, but no detailed assessment model for this opportunity yet."
    },
    tags: ["Biotech", "PoC", "BIRAC"]
  },
  {
    id: "nidhi-prayas",
    name: "NIDHI-PRAYAS",
    provider: "DST",
    category: "Startup Funding",
    targetApplicant: "Innovators building prototypes",
    funding: "Prototype grant support",
    deadline: "TBI-specific calls",
    status: "Rolling",
    description: "Prototype-level support through PRAYAS centres for innovators working toward a market-ready proof of concept.",
    stage: "Prototype",
    eligibility: ["Indian innovator", "Prototype-stage idea", "PRAYAS centre selection"],
    access: ["Apply through PRAYAS centre", "Screening and review", "Mentoring plan"],
    readiness: ["Problem note", "Prototype plan", "Mentor fit", "Budget"],
    tags: ["Prototype", "DST", "TBI"]
  },
  {
    id: "nidhi-eir",
    name: "NIDHI Entrepreneur-in-Residence",
    provider: "DST",
    category: "Startup Funding",
    targetApplicant: "Aspiring entrepreneurs pursuing a technology venture",
    funding: "Monthly fellowship support",
    deadline: "TBI-specific calls",
    status: "Rolling",
    description: "Fellowship support for founders to spend time on a technology venture before full-time company formation.",
    stage: "Founder readiness",
    eligibility: ["Technology business idea", "Founder commitment", "Incubator selection"],
    access: ["Incubator application", "Panel interview", "Mentoring plan"],
    readiness: ["Founder profile", "Venture note", "Prototype or validation plan"],
    tags: ["Founder", "DST", "Incubator"]
  },
  {
    id: "tide-2",
    name: "TIDE 2.0",
    provider: "MeitY",
    category: "Startup Funding",
    targetApplicant: "ICT startups in emerging technology areas",
    funding: "Grant and incubation support",
    deadline: "Incubator-specific calls",
    status: "Rolling",
    description: "Support for technology startups working in areas such as IoT, AI, blockchain and digital public-good applications.",
    stage: "ICT innovation",
    eligibility: ["Technology startup", "Incubator route", "Problem aligned with MeitY areas"],
    access: ["TIDE centre selection", "Milestone review", "Mentor support"],
    readiness: ["Product note", "Technical architecture", "Market validation", "Budget"],
    tags: ["MeitY", "ICT", "Incubation"]
  },
  {
    id: "idex",
    name: "Innovations for Defence Excellence (iDEX)",
    provider: "Defence Innovation Organisation",
    category: "Startup Funding",
    targetApplicant: "Startups and innovators solving defence challenges",
    funding: "Grant support by challenge",
    deadline: "Challenge-based calls",
    status: "Open",
    description: "Challenge-led grants and procurement pathways for defence and aerospace innovation.",
    stage: "Challenge application",
    eligibility: ["Startup or innovator", "Challenge alignment", "Indian entity requirements"],
    access: ["Challenge submission", "Technical review", "Prototype milestones"],
    readiness: ["Challenge mapping", "Prototype plan", "Team capability", "Compliance notes"],
    tags: ["Defence", "Challenge", "Prototype"]
  },
  {
    id: "elevate-karnataka",
    name: "ELEVATE",
    provider: "Government of Karnataka",
    category: "Startup Funding",
    targetApplicant: "Karnataka startups",
    funding: "Grant-in-aid support",
    deadline: "State call windows",
    status: "Upcoming",
    description: "State startup support program for innovative ventures based in Karnataka.",
    stage: "Seed / early traction",
    eligibility: ["Karnataka startup", "Innovation-led business", "State application requirements"],
    access: ["State portal application", "Pitch evaluation", "Mentor review"],
    readiness: ["Pitch deck", "Karnataka registration evidence", "Product validation", "Budget"],
    tags: ["Karnataka", "Startup", "State"]
  },
  {
    id: "anrf-early-career",
    name: "ANRF Early Career Research Grant",
    provider: "ANRF",
    category: "Research Grants",
    targetApplicant: "Early-career faculty and researchers",
    funding: "Research project grant",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Research grant support for early-career investigators building an independent research program.",
    stage: "Early-career research",
    eligibility: ["Eligible host", "Early-career investigator", "Proposal within scope"],
    access: ["Host endorsement", "Proposal submission", "Peer review"],
    readiness: ["Research plan", "CV", "Budget", "Host support"],
    tags: ["Early career", "Faculty", "ANRF"]
  },
  {
    id: "anrf-power",
    name: "ANRF POWER",
    provider: "ANRF",
    category: "Research Grants",
    targetApplicant: "Women scientists and faculty",
    funding: "Research grant support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Research support intended to strengthen participation of women scientists in science and engineering research.",
    stage: "Research proposal",
    eligibility: ["Woman scientist", "Eligible institution", "Proposal scope"],
    access: ["Institution endorsement", "Online proposal", "Review process"],
    readiness: ["Proposal", "CV", "Budget", "Host infrastructure note"],
    tags: ["Women in STEM", "Research", "ANRF"]
  },
  {
    id: "supra",
    name: "SUPRA",
    provider: "ANRF",
    category: "Research Grants",
    targetApplicant: "Researchers proposing high-risk, high-reward science",
    funding: "Research grant support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Support for proposals that pursue new hypotheses and potentially transformative research directions.",
    stage: "Advanced research",
    eligibility: ["Eligible PI", "Host institution", "High-risk research proposal"],
    access: ["Institution submission", "Peer review", "Milestone reporting"],
    readiness: ["Novelty note", "Method risk plan", "Budget", "Expected outputs"],
    tags: ["High-risk", "Science", "ANRF"]
  },
  {
    id: "icssr-major",
    name: "ICSSR Major Research Project",
    provider: "ICSSR",
    category: "Research Grants",
    targetApplicant: "Social science researchers",
    funding: "Major project grant",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Research project support for social science themes with clear methodology and societal relevance.",
    stage: "Social science research",
    eligibility: ["Eligible researcher", "Social science theme", "Host institution support"],
    access: ["ICSSR portal application", "Proposal review", "Institution documents"],
    readiness: ["Research proposal", "Survey or fieldwork plan", "Ethics note", "Budget"],
    tags: ["Social science", "ICSSR", "Research"]
  },
  {
    id: "icssr-minor",
    name: "ICSSR Minor Research Project",
    provider: "ICSSR",
    category: "Research Grants",
    targetApplicant: "Social science faculty and researchers",
    funding: "Minor project grant",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Smaller research support for focused social science questions and early research outputs.",
    stage: "Focused research",
    eligibility: ["Eligible researcher", "Host support", "Social science theme"],
    access: ["Proposal submission", "Screening", "Institution documents"],
    readiness: ["Concept note", "Methodology", "Timeline", "Budget"],
    tags: ["ICSSR", "Social science", "Faculty"]
  },
  {
    id: "icmr-ad-hoc",
    name: "ICMR Ad-hoc Research Project",
    provider: "ICMR",
    category: "Research Grants",
    targetApplicant: "Biomedical and public-health researchers",
    funding: "Project grant support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Research support for biomedical, clinical and public-health studies aligned with ICMR priorities.",
    stage: "Health research",
    eligibility: ["Eligible institution", "PI profile", "Ethics requirements where applicable"],
    access: ["Proposal submission", "Scientific review", "Ethics approvals"],
    readiness: ["Study protocol", "Ethics plan", "Budget", "Team CVs"],
    tags: ["Health", "ICMR", "Protocol"]
  },
  {
    id: "inspire-fellowship",
    name: "INSPIRE Fellowship",
    provider: "DST",
    category: "Fellowships",
    targetApplicant: "Doctoral students in basic and applied sciences",
    funding: "Fellowship support",
    deadline: "Annual call",
    status: "Upcoming",
    description: "Fellowship support for candidates pursuing doctoral research in science and technology.",
    stage: "PhD research",
    eligibility: ["High academic performance", "PhD admission or eligibility", "Science discipline"],
    access: ["Online application", "Academic screening", "Institution documents"],
    readiness: ["Academic records", "Research synopsis", "Supervisor details"],
    tags: ["PhD", "DST", "Science"]
  },
  {
    id: "ramanujan-fellowship",
    name: "Ramanujan Fellowship",
    provider: "SERB / ANRF",
    category: "Fellowships",
    targetApplicant: "Brilliant scientists and engineers returning to India",
    funding: "Fellowship and research grant support",
    deadline: "Nomination-based / rolling windows",
    status: "Rolling",
    description: "Fellowship support for outstanding scientists to take up scientific research positions in India.",
    stage: "Research career transition",
    eligibility: ["Strong research record", "Host institution", "Age and career-stage requirements"],
    access: ["Nomination or host route", "Expert review", "Host commitment"],
    readiness: ["CV", "Research plan", "Host letter", "Publication evidence"],
    tags: ["Scientist", "Return to India", "Fellowship"]
  },
  {
    id: "ramalingaswami",
    name: "Ramalingaswami Re-entry Fellowship",
    provider: "DBT",
    category: "Fellowships",
    targetApplicant: "Indian researchers returning in biotechnology and life sciences",
    funding: "Fellowship and contingency support",
    deadline: "Annual call",
    status: "Upcoming",
    description: "Re-entry fellowship for researchers in life sciences and biotechnology who wish to establish work in India.",
    stage: "Research re-entry",
    eligibility: ["Relevant postdoctoral experience", "Indian nationality requirements", "Host institution"],
    access: ["DBT application", "Research proposal", "Host support"],
    readiness: ["CV", "Research plan", "Host letter", "Publication list"],
    tags: ["Biotech", "Re-entry", "DBT"]
  },
  {
    id: "wise-phd",
    name: "WISE-PhD",
    provider: "DST",
    category: "Fellowships",
    targetApplicant: "Women pursuing PhD in STEM",
    funding: "Fellowship support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Fellowship support to encourage women candidates in science and technology doctoral research.",
    stage: "Doctoral study",
    eligibility: ["Woman candidate", "STEM PhD route", "Academic criteria"],
    access: ["Online application", "Document review", "Institution details"],
    readiness: ["Academic records", "Research plan", "Supervisor details"],
    tags: ["Women", "PhD", "STEM"]
  },
  {
    id: "csir-jrf",
    name: "CSIR Junior Research Fellowship",
    provider: "CSIR",
    category: "Fellowships",
    targetApplicant: "Candidates qualifying CSIR-UGC NET JRF",
    funding: "JRF/SRF fellowship support",
    deadline: "Exam cycle based",
    status: "Open",
    description: "Fellowship route for candidates pursuing research in science disciplines after qualifying the relevant examination.",
    stage: "Research fellowship",
    eligibility: ["CSIR-UGC NET JRF qualification", "Eligible discipline", "Research enrolment"],
    access: ["Exam qualification", "Institution joining", "Fellowship activation"],
    readiness: ["Scorecard", "Admission documents", "Supervisor details"],
    tags: ["JRF", "Research", "Exam"]
  },
  {
    id: "inspire-she",
    name: "INSPIRE-SHE",
    provider: "DST",
    category: "Scholarships",
    targetApplicant: "Students pursuing natural and basic sciences",
    funding: "Scholarship plus mentorship support",
    deadline: "Annual cycle",
    status: "Upcoming",
    description: "Scholarship for higher education in science for students meeting merit and program criteria.",
    stage: "Undergraduate science",
    eligibility: ["Science program", "Merit criteria", "Eligible institution"],
    access: ["Online application", "Academic verification", "Bank details"],
    readiness: ["Marksheets", "Admission proof", "Bank details"],
    tags: ["Science", "UG", "DST"]
  },
  {
    id: "aicte-saksham",
    name: "AICTE Saksham Scholarship",
    provider: "AICTE",
    category: "Scholarships",
    targetApplicant: "Students with disabilities in technical education",
    funding: "Rs 50,000 per year",
    deadline: "Annual NSP cycle",
    status: "Open",
    description: "Scholarship support for students with disabilities admitted to eligible technical institutions.",
    stage: "Technical education",
    eligibility: ["Disability criterion", "AICTE-approved institution", "Income criteria"],
    access: ["NSP application", "Institution verification", "Document checks"],
    readiness: ["Disability certificate", "Admission proof", "Income certificate", "Bank details"],
    tags: ["Disability", "AICTE", "Technical"]
  },
  {
    id: "ishan-uday-opportunity",
    name: "Ishan Uday Special Scholarship",
    provider: "UGC",
    category: "Scholarships",
    targetApplicant: "Students from North Eastern Region",
    funding: "Rs 5,400-Rs 7,800 per month",
    deadline: "Annual NSP cycle",
    status: "Open",
    description: "Scholarship support for eligible undergraduate students from North Eastern states.",
    stage: "Undergraduate study",
    eligibility: ["NER domicile", "UG admission", "Income criteria"],
    access: ["NSP application", "Institution verification", "Domicile evidence"],
    readiness: ["Domicile certificate", "Income certificate", "Admission proof"],
    tags: ["NER", "UG", "UGC"]
  },
  {
    id: "pm-usp-csss",
    name: "PM-USP Central Sector Scholarship",
    provider: "Department of Higher Education",
    category: "Scholarships",
    targetApplicant: "Meritorious college and university students",
    funding: "Rs 12,000-Rs 20,000 per year",
    deadline: "31 October",
    status: "Open",
    description: "Merit and need-linked scholarship for college and university students.",
    stage: "Higher education",
    eligibility: ["Class 12 merit", "Income limit", "Regular course enrolment"],
    access: ["NSP application", "Institution verification", "Renewal conditions"],
    readiness: ["Marksheets", "Income certificate", "Bank details", "Institution proof"],
    tags: ["Merit", "NSP", "UG"]
  },
  {
    id: "top-class-sc-opportunity",
    name: "Top Class Education Scheme for SC Students",
    provider: "Ministry of Social Justice and Empowerment",
    category: "Scholarships",
    targetApplicant: "SC students in notified institutions",
    funding: "Tuition and living support",
    deadline: "Annual NSP cycle",
    status: "Open",
    description: "Support for SC students studying in notified top class institutions.",
    stage: "Higher education",
    eligibility: ["SC category", "Notified institution", "Income criteria"],
    eligibilityRules: [
      { id: "sc-category", label: "SC category", profileField: "category", operator: "equals", value: "SC", source: "Ministry of Social Justice and Empowerment scheme information", confidence: "high" },
      { id: "notified-institution", label: "Notified institution", profileField: "college", operator: "exists", source: "Ministry of Social Justice and Empowerment scheme information", confidence: "medium" },
      { id: "income-criteria", label: "Income information available", profileField: "income", operator: "exists", source: "Ministry of Social Justice and Empowerment scheme information", confidence: "medium" }
    ],
    access: ["NSP application", "Institution verification", "Category and income checks"],
    readiness: ["Category certificate", "Income certificate", "Admission proof"],
    tags: ["SC", "Top class", "NSP"]
  },
  {
    id: "atal-innovation-mission",
    name: "Atal Innovation Mission Challenges",
    provider: "NITI Aayog",
    category: "Government Schemes",
    targetApplicant: "Schools, innovators, startups and ecosystem partners",
    funding: "Challenge and ecosystem support",
    deadline: "Challenge-based",
    status: "Open",
    description: "Innovation challenges and ecosystem programs supporting problem-solving and entrepreneurship.",
    stage: "Innovation challenge",
    eligibility: ["Challenge-specific applicant type", "Problem alignment", "Documentation"],
    access: ["Challenge application", "Screening", "Mentoring or implementation route"],
    readiness: ["Problem statement", "Solution note", "Team details"],
    tags: ["Innovation", "NITI", "Challenge"]
  },
  {
    id: "meity-samdhan",
    name: "MeitY SAMRIDH",
    provider: "MeitY",
    category: "Government Schemes",
    targetApplicant: "Software product startups",
    funding: "Accelerator-linked support",
    deadline: "Accelerator cycles",
    status: "Rolling",
    description: "Support for software product startups through accelerators and market access partners.",
    stage: "Scale-up",
    eligibility: ["Software product startup", "Accelerator selection", "Market-readiness evidence"],
    access: ["Accelerator application", "Screening", "Milestone support"],
    readiness: ["Product traction", "Revenue or pilot evidence", "Pitch deck"],
    tags: ["Software", "Accelerator", "MeitY"]
  },
  {
    id: "stand-up-india",
    name: "Stand-Up India",
    provider: "Department of Financial Services",
    category: "Government Schemes",
    targetApplicant: "SC/ST and women entrepreneurs",
    funding: "Bank loan facilitation",
    deadline: "Rolling",
    status: "Rolling",
    description: "Facilitates bank loans for greenfield enterprises promoted by eligible entrepreneurs.",
    stage: "Enterprise setup",
    eligibility: ["SC/ST or woman entrepreneur", "Greenfield enterprise", "Bank requirements"],
    access: ["Bank branch route", "Project report", "Credit appraisal"],
    readiness: ["Project report", "KYC", "Promoter profile", "Financial estimates"],
    tags: ["Enterprise", "Credit", "Women"]
  },
  {
    id: "mudra",
    name: "PM MUDRA Yojana",
    provider: "Government of India",
    category: "Government Schemes",
    targetApplicant: "Micro and small enterprise borrowers",
    funding: "Micro-enterprise loan categories",
    deadline: "Rolling",
    status: "Rolling",
    description: "Credit support for non-corporate, non-farm micro and small enterprises through lending institutions.",
    stage: "Microenterprise credit",
    eligibility: ["Business activity", "Borrower documents", "Lender appraisal"],
    access: ["Bank/NBFC/MFI route", "Credit appraisal", "Repayment plan"],
    readiness: ["Business plan", "KYC", "Cash-flow estimate"],
    tags: ["Credit", "MSME", "Enterprise"]
  },
  {
    id: "pmegp",
    name: "Prime Minister's Employment Generation Programme",
    provider: "KVIC / Ministry of MSME",
    category: "Government Schemes",
    targetApplicant: "Entrepreneurs setting up micro-enterprises",
    funding: "Margin money subsidy and bank finance",
    deadline: "Rolling",
    status: "Rolling",
    description: "Credit-linked subsidy support for new micro-enterprises in manufacturing and service sectors.",
    stage: "Enterprise setup",
    eligibility: ["New project", "Applicant category rules", "Bank appraisal"],
    access: ["Online application", "Agency scrutiny", "Bank sanction"],
    readiness: ["Project report", "Identity documents", "Training requirement"],
    tags: ["MSME", "Subsidy", "Enterprise"]
  },
  {
    id: "digital-india-bhashini",
    name: "Bhashini Ecosystem Opportunities",
    provider: "Digital India Bhashini Division",
    category: "Government Schemes",
    targetApplicant: "Language technology builders and partners",
    funding: "Challenge, dataset or ecosystem support",
    deadline: "Program-specific",
    status: "Upcoming",
    description: "Opportunities for builders working on Indian-language technology and public digital infrastructure use cases.",
    stage: "Digital public infrastructure",
    eligibility: ["Language-tech use case", "Program-specific applicant rules", "Technical readiness"],
    access: ["Challenge or partner route", "Technical review", "Deployment readiness"],
    readiness: ["Use-case note", "Dataset or model plan", "Responsible AI note"],
    tags: ["Language", "DPI", "Technology"]
  },
  {
    id: "msme-champions",
    name: "MSME Champions Scheme",
    provider: "Ministry of MSME",
    category: "Government Schemes",
    targetApplicant: "MSMEs seeking competitiveness support",
    funding: "Scheme-specific support",
    deadline: "Rolling",
    status: "Rolling",
    description: "Umbrella support for MSMEs through quality, design, innovation and competitiveness interventions.",
    stage: "MSME growth",
    eligibility: ["MSME registration", "Component-specific rules", "Document verification"],
    access: ["Scheme portal route", "Assessment", "Implementation partner"],
    readiness: ["Udyam registration", "Business documents", "Intervention proposal"],
    tags: ["MSME", "Growth", "Quality"]
  },
  {
    id: "maharashtra-startup-week",
    name: "Maharashtra Startup Week",
    provider: "Maharashtra State Innovation Society",
    category: "Startup Funding",
    targetApplicant: "Startups solving government or public problems",
    funding: "Work order / pilot opportunity",
    deadline: "State call window",
    status: "Upcoming",
    description: "Challenge route that can connect startups to government departments for pilots and work orders.",
    stage: "Pilot procurement",
    eligibility: ["Startup eligibility", "Problem-statement fit", "State process compliance"],
    access: ["Application", "Pitch selection", "Department pilot"],
    readiness: ["Pitch deck", "Pilot proposal", "Impact metric"],
    tags: ["Maharashtra", "Pilot", "GovTech"]
  },
  {
    id: "kerala-startup-mission-grant",
    name: "Kerala Startup Mission Innovation Grant",
    provider: "Kerala Startup Mission",
    category: "Startup Funding",
    targetApplicant: "Kerala-linked startups and innovators",
    funding: "Innovation grant support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "State innovation grants supporting validation, productization and early market experiments.",
    stage: "Innovation grant",
    eligibility: ["Kerala startup ecosystem route", "Innovation criteria", "Call-specific rules"],
    access: ["KSUM application", "Screening", "Grant milestone review"],
    readiness: ["Pitch deck", "Validation evidence", "Budget"],
    tags: ["Kerala", "Startup", "Innovation"]
  },
  {
    id: "gujarat-startup-assistance",
    name: "Gujarat Startup Assistance",
    provider: "Government of Gujarat",
    category: "Startup Funding",
    targetApplicant: "Recognized startups in Gujarat",
    funding: "State assistance by component",
    deadline: "Rolling / notification-based",
    status: "Rolling",
    description: "State startup assistance for eligible startups under notified policy components.",
    stage: "State startup support",
    eligibility: ["State recognition", "Eligible sector/component", "Documentation"],
    access: ["State portal", "Document scrutiny", "Component approval"],
    readiness: ["Recognition proof", "Cost estimate", "Business plan"],
    tags: ["Gujarat", "Startup", "Policy"]
  },
  {
    id: "ugc-national-pg",
    name: "National Scholarship for Post Graduate Studies",
    provider: "UGC",
    category: "Scholarships",
    targetApplicant: "Postgraduate students",
    funding: "Rs 15,000 per month",
    deadline: "Annual NSP cycle",
    status: "Open",
    description: "Scholarship support for students admitted to eligible postgraduate programs.",
    stage: "Postgraduate study",
    eligibility: ["PG admission", "Age and merit rules", "Institution verification"],
    access: ["NSP application", "Institution verification", "Bank validation"],
    readiness: ["Admission proof", "Academic records", "Bank details"],
    tags: ["PG", "UGC", "NSP"]
  },
  {
    id: "nec-merit",
    name: "NEC Merit Scholarship",
    provider: "North Eastern Council",
    category: "Scholarships",
    targetApplicant: "Students from North Eastern states",
    funding: "Course-level scholarship support",
    deadline: "Annual cycle",
    status: "Open",
    description: "Merit scholarship support for students from the North Eastern Region across diploma to research levels.",
    stage: "Higher education",
    eligibility: ["NER domicile", "Merit criteria", "Eligible course"],
    access: ["Portal application", "Domicile check", "Institution verification"],
    readiness: ["Domicile proof", "Marksheets", "Admission proof"],
    tags: ["NER", "Merit", "Scholarship"]
  },
  {
    id: "dbt-ra",
    name: "DBT Research Associateship",
    provider: "DBT",
    category: "Fellowships",
    targetApplicant: "Postdoctoral researchers in biotechnology and life sciences",
    funding: "Associateship support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Postdoctoral support for researchers working in biotechnology and allied life-science areas.",
    stage: "Postdoctoral research",
    eligibility: ["PhD in relevant area", "Host lab", "Research proposal"],
    access: ["Application", "Expert review", "Host confirmation"],
    readiness: ["CV", "Proposal", "Host acceptance", "Publications"],
    tags: ["Postdoc", "DBT", "Biotech"]
  },
  {
    id: "icmr-jrf",
    name: "ICMR Junior Research Fellowship",
    provider: "ICMR",
    category: "Fellowships",
    targetApplicant: "Biomedical research fellowship candidates",
    funding: "JRF fellowship support",
    deadline: "Exam cycle based",
    status: "Upcoming",
    description: "Fellowship support for candidates entering biomedical and health research after qualifying examination routes.",
    stage: "Research entry",
    eligibility: ["Exam qualification", "Eligible discipline", "Institution joining"],
    access: ["Exam route", "Fellowship activation", "Host institution"],
    readiness: ["Scorecard", "Admission proof", "Supervisor details"],
    tags: ["JRF", "Health", "ICMR"]
  },
  {
    id: "dst-women-scientist-a",
    name: "Women Scientist Scheme-A",
    provider: "DST",
    category: "Fellowships",
    targetApplicant: "Women scientists seeking research re-entry",
    funding: "Research project fellowship support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Support for women scientists to return to research careers through project-based work.",
    stage: "Career re-entry",
    eligibility: ["Woman scientist", "Career break/re-entry context", "Research proposal"],
    access: ["Application", "Expert review", "Host support"],
    readiness: ["Proposal", "CV", "Host details", "Budget"],
    tags: ["Women", "Re-entry", "DST"]
  },
  {
    id: "ncert-doctoral-fellowship",
    name: "NCERT Doctoral Fellowship",
    provider: "NCERT",
    category: "Fellowships",
    targetApplicant: "Doctoral researchers in education",
    funding: "Doctoral fellowship support",
    deadline: "Annual call",
    status: "Upcoming",
    description: "Fellowship support for PhD research related to education and school systems.",
    stage: "Education research",
    eligibility: ["PhD registration", "Education research topic", "Academic criteria"],
    access: ["Application", "Proposal review", "Institution documents"],
    readiness: ["Research proposal", "PhD registration proof", "Supervisor details"],
    tags: ["Education", "PhD", "NCERT"]
  },
  {
    id: "dst-core-research-grant",
    name: "Core Research Grant",
    provider: "ANRF",
    category: "Research Grants",
    targetApplicant: "Individual researchers in science and engineering",
    funding: "Research project grant",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Research support for investigator-led science and engineering proposals.",
    stage: "Research proposal",
    eligibility: ["Eligible PI", "Host institution", "Proposal scope"],
    access: ["Institution endorsement", "Peer review", "Grant administration"],
    readiness: ["Proposal", "Budget", "CV", "Host support"],
    tags: ["Science", "Engineering", "ANRF"]
  },
  {
    id: "dst-tare",
    name: "Teachers Associateship for Research Excellence",
    provider: "ANRF",
    category: "Research Grants",
    targetApplicant: "Faculty at regular institutions seeking research exposure",
    funding: "Research associateship support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Research exposure support for faculty to collaborate with established research institutions.",
    stage: "Faculty research development",
    eligibility: ["Regular faculty", "Host scientist", "Research plan"],
    access: ["Application", "Host acceptance", "Expert review"],
    readiness: ["Host letter", "Research plan", "CV", "Institution NOC"],
    tags: ["Faculty", "Research exposure", "ANRF"]
  },
  {
    id: "dbt-twinning",
    name: "DBT Twinning Programme",
    provider: "DBT",
    category: "Research Grants",
    targetApplicant: "Institutions collaborating on biotechnology research",
    funding: "Collaborative project support",
    deadline: "Call-based",
    status: "Upcoming",
    description: "Collaborative research support intended to build biotechnology capacity through institutional partnerships.",
    stage: "Collaborative research",
    eligibility: ["Eligible institutions", "Collaborative proposal", "Biotech focus"],
    access: ["Joint proposal", "Institution endorsements", "Technical review"],
    readiness: ["Partner roles", "Work plan", "Budget split", "Infrastructure note"],
    tags: ["DBT", "Collaboration", "Biotech"]
  },
  {
    id: "ai-for-india-challenges",
    name: "IndiaAI Innovation Challenges",
    provider: "IndiaAI Mission",
    category: "Government Schemes",
    targetApplicant: "AI startups, researchers and builders",
    funding: "Challenge-linked support",
    deadline: "Challenge-based",
    status: "Upcoming",
    description: "Challenge routes for AI solutions aligned with national priorities and responsible deployment.",
    stage: "AI innovation",
    eligibility: ["AI solution", "Challenge fit", "Applicant-specific criteria"],
    access: ["Challenge submission", "Technical review", "Pilot route"],
    readiness: ["Model or prototype note", "Dataset plan", "Safety and impact note"],
    tags: ["AI", "Challenge", "DPI"]
  },
  {
    id: "seed-support-samridh",
    name: "Startup Accelerator of MeitY for Product Innovation",
    provider: "MeitY SAMRIDH",
    category: "Startup Funding",
    targetApplicant: "Growth-stage software startups",
    funding: "Matching support through accelerators",
    deadline: "Accelerator-specific",
    status: "Rolling",
    description: "Accelerator-linked support for software product startups with market traction.",
    stage: "Growth / acceleration",
    eligibility: ["Software startup", "Market traction", "Accelerator selection"],
    access: ["Accelerator application", "Due diligence", "Milestone support"],
    readiness: ["Traction metrics", "Product roadmap", "Financials", "Pitch deck"],
    tags: ["Software", "MeitY", "Scale"]
  }
];

const fallbackCriteria: Record<OpportunityCategory, EvaluatorCriterion[]> = {
  "Startup Funding": startupSeedCriteria.slice(0, 4),
  "Research Grants": anrfCriteria,
  Fellowships: [
    {
      ...anrfCriteria[0],
      id: "fellowship-fit",
      criterion: "Fellowship fit",
      signal: "Alignment between applicant record, research direction and fellowship purpose.",
      answerKey: "researchFit",
      strongAnswers: ["Published work in the area"],
      moderateAnswers: ["Clear research area"],
      weakGap: "The application needs a sharper fit between the fellowship and the applicant's next step.",
      moderateGap: "Research direction is clear; add stronger evidence from prior work.",
      action: "Connect the fellowship to one concrete research output and mentor fit."
    },
    {
      ...anrfCriteria[1],
      id: "host-readiness",
      criterion: "Host readiness",
      signal: "Supervisor or host support for the proposed fellowship path.",
      answerKey: "host",
      strongAnswers: ["Host confirmation ready"],
      moderateAnswers: ["Conversation started"],
      weakGap: "Host route is unresolved.",
      moderateGap: "Host interest exists but confirmation is not ready.",
      action: "Ask the host for a dated support note."
    }
  ],
  Scholarships: pragatiCriteria,
  "Government Schemes": [
    {
      ...pragatiCriteria[0],
      id: "scheme-fit",
      criterion: "Scheme-route fit",
      signal: "Applicant type and documents fit the specific scheme route.",
      answerKey: "applicantFit",
      strongAnswers: ["Fit confirmed"],
      moderateAnswers: ["Likely fit"],
      weakGap: "Applicant route is not yet confirmed.",
      moderateGap: "Fit is likely but needs document confirmation.",
      action: "Check the applicant type against the scheme route before preparing the full application."
    }
  ]
};

export function featuredOpportunities() {
  return opportunities.filter((opportunity) => opportunity.featured).slice(0, 4);
}

export function getOpportunity(id: string) {
  return opportunities.find((opportunity) => opportunity.id === id);
}

export function getAssessmentAvailability(opportunity: Opportunity): StructuredAssessment {
  if (opportunity.assessment) {
    return opportunity.assessment;
  }

  if (opportunity.evaluatorCriteria?.length) {
    return {
      availability: "full",
      note: "Full demo assessment is available because evaluator criteria are configured for this opportunity."
    };
  }

  if (opportunity.selectionCriteria?.length) {
    return {
      availability: "partial",
      note: "Partial assessment only: eligibility and programme information are available, but full assessment is unavailable."
    };
  }

  return {
    availability: "discovery",
    note: "Detailed assessment is not available for this opportunity yet."
  };
}

export function getOpportunityCriteria(opportunity: Opportunity) {
  return getAssessmentAvailability(opportunity).availability === "full" ? opportunity.evaluatorCriteria ?? fallbackCriteria[opportunity.category] : [];
}

export function getAssessmentQuestions(opportunity: Opportunity) {
  return getAssessmentAvailability(opportunity).availability === "full" ? assessmentQuestions[opportunity.category] : [];
}

export function evaluateOpportunityAssessment(opportunity: Opportunity, responses: Record<string, string>): OpportunityAssessment {
  const criteria = getOpportunityCriteria(opportunity).map((criterion) => {
    const answer = responses[criterion.answerKey];
    const status: AssessmentStatus = !answer
      ? "Missing"
      : criterion.strongAnswers.includes(answer)
        ? "Strong"
        : criterion.moderateAnswers.includes(answer)
          ? "Moderate"
          : "Weak";
    const gap = status === "Strong" ? criterion.strongGap : status === "Moderate" ? criterion.moderateGap : criterion.weakGap;

    return {
      ...criterion,
      status,
      evidenceFound: answer ? criterion.evidence[answer] ?? answer : "No evidence captured yet.",
      gap
    };
  });

  const demonstratedSignals = criteria.filter((criterion) => criterion.status === "Strong" || criterion.status === "Moderate").length;
  const weakest = criteria.find((criterion) => criterion.status === "Missing") ?? criteria.find((criterion) => criterion.status === "Weak") ?? criteria.find((criterion) => criterion.status === "Moderate") ?? null;

  return {
    access: buildGateResults(opportunity.access, responses),
    eligibility: buildGateResults(opportunity.eligibility, responses),
    readiness: buildGateResults(opportunity.readiness, responses, true),
    criteria,
    demonstratedSignals,
    totalSignals: criteria.length,
    biggestGap: weakest,
    nextActions: Array.from(new Set(criteria.filter((criterion) => criterion.status !== "Strong").slice(0, 3).map((criterion) => criterion.action)))
  };
}

export function buildOpportunityAssessmentResult(
  opportunity: Opportunity,
  responses: Record<string, string>,
  applicant: DemoProfile = profile,
  options: { now?: Date | string; core?: CoreProfile; depth?: AssessmentDepth } = {}
): AssessmentResult {
  // Some catalogue copy is narration written about the guided-demo persona ("Ananya is a woman
  // student...", "8.3 CGPA..."). True for the demo, fabricated for anybody else, so it is used
  // only when the applicant really is that persona.
  const personaNarrative = applicant.id === profile.id;
  const eligibility = evaluateEligibility(opportunity, applicant);
  const criteria = eligibility.status === "ineligible" ? [] : evaluateCompetitivenessCriteria(opportunity, responses, applicant, personaNarrative);
  const competitiveness = calculateCompetitiveness(criteria);
  const confidence = deriveCanonicalConfidence(eligibility, competitiveness);
  const gaps = buildCanonicalGaps(eligibility, criteria);
  const strengths = buildCanonicalStrengths(opportunity, applicant, criteria, personaNarrative);
  const recommendation = chooseCanonicalRecommendation(eligibility.status, competitiveness, opportunity, options.now);
  const recommendationLabel = labelForVerdict(recommendation.verdict);
  const biggestGap = toDisplayGap(gaps[0]);
  const improvementActions = Array.from(new Set(gaps.map((gap) => gap.suggestion).filter(Boolean))) as string[];
  const strongestEvidence = strengths[0] ?? "No strong evidence captured yet.";

  const questions = getAssessmentQuestions(opportunity);
  const answeredQuestions = questions.filter((question) => Boolean(responses[question.id])).length;

  return {
    opportunityId: opportunity.id,
    profileId: applicant.id,
    opportunityName: opportunity.name,
    applicantId: applicant.id,
    depth: options.depth ?? (answeredQuestions > 0 ? "deep" : "basic"),
    initialFit: buildInitialFit(opportunity, options.core, eligibility, criteria),
    coverage: {
      checkedCriteria: eligibility.conditions.filter((condition) => condition.result !== "unknown").length + criteria.filter((criterion) => criterion.evidenceScore !== null).length,
      totalCriteria: eligibility.conditions.length + criteria.length,
      answeredQuestions,
      remainingQuestions: questions.length - answeredQuestions
    },
    eligibility,
    competitiveness,
    strengths,
    gaps,
    recommendation,
    confidence,
    evidenceFacts: profileFacts(applicant),
    overallAssessment: recommendation.explanation,
    strongestEvidence,
    biggestGap,
    nextAction: improvementActions[0] ?? defaultNextAction(recommendation.verdict),
    effortVsUpside: {
      effort: gaps.filter((gap) => gap.improvable).length > 2 ? "High" : gaps.some((gap) => gap.improvable) ? "Moderate" : "Low",
      upside: opportunity.funding,
      rationale: effortRationale(opportunity, gaps, recommendation.verdict)
    },
    recommendationLabel,
    recommendationKey: recommendationKeyFor(recommendationLabel),
    improvementActions,
    generatedAt: "2026-09-08T00:00:00+05:30"
  };
}

export function assistantReply(opportunity: Opportunity, assessment: OpportunityAssessment | AssessmentResult, prompt: string) {
  const result = "competitiveness" in assessment ? assessment : buildOpportunityAssessmentResult(opportunity, Object.fromEntries(assessment.criteria.map((criterion) => [criterion.answerKey, findResponseFromCriterion(criterion)])));
  const normalised = prompt.toLowerCase();
  const firstBlocker = result.eligibility.blockers[0];
  const biggestGap = result.gaps[0];

  if (normalised.includes("eligible")) {
    return `Eligibility: ${sentenceCase(result.eligibility.status)}. ${firstBlocker ? `Blocker: ${firstBlocker}.` : eligibilitySummary(result)} Disha is using the saved canonical assessment, so chat cannot override the eligibility result.`;
  }

  if (normalised.includes("score") || normalised.includes("fit") || normalised.includes("competitive")) {
    if (result.competitiveness.score === null) {
      return `Competitive fit cannot be reliably estimated yet. Disha has usable evidence for ${result.competitiveness.assessedWeightPercent}% of known selection weight.`;
    }
    return `Competitive fit: ${result.competitiveness.score}/100, ${result.competitiveness.band}. This is separate from formal eligibility, which is ${result.eligibility.status}.`;
  }

  if (normalised.includes("weak") || normalised.includes("marked") || normalised.includes("missing") || normalised.includes("improve")) {
    if (!biggestGap) return `${opportunity.name} has no major gap in the current canonical assessment. Keep the evidence packet concise and current.`;
    return `${biggestGap.label} needs attention. ${biggestGap.suggestion ?? "Add clearer supporting facts before applying."}`;
  }

  if (normalised.includes("apply") || normalised.includes("right now") || normalised.includes("worth")) {
    return `${labelForVerdict(result.recommendation.verdict)}. ${result.recommendation.explanation}`;
  }

  return `${opportunity.name}: ${labelForVerdict(result.recommendation.verdict)}. ${result.nextAction}`;
}

/**
 * Initial fit: a small set of named alignment signals a core profile can genuinely support.
 *
 * Deliberately not a number. A handful of core answers cannot justify "82% fit", so this reports
 * bands with the comparison that produced each one. The deep tier is where the weighted score
 * lives, because only there is there enough evidence to trace it back to criterion weights.
 */
export function buildInitialFit(
  opportunity: Opportunity,
  core: CoreProfile | undefined,
  eligibility: AssessmentResult["eligibility"],
  criteria: AssessmentResult["competitiveness"]["criteria"]
): InitialFit {
  const signals = core ? initialFitSignals(opportunity, core) : [];
  const known = signals.filter((signal) => signal.band !== "unknown" && signal.affectsBand);
  const band = aggregateFitBand(known);

  const missingInformation = [
    ...eligibility.conditions.filter((condition) => condition.result === "unknown").map((condition) => condition.label),
    ...signals.filter((signal) => signal.band === "unknown").map((signal) => signal.label),
    ...criteria.filter((criterion) => criterion.evidenceScore === null).map((criterion) => criterion.label)
  ];

  const reasons = [
    eligibilityReason(eligibility),
    ...known
      .slice()
      .sort((a, b) => fitRank(a.band) - fitRank(b.band))
      .slice(0, 2)
      .map((signal) => signal.explanation)
  ].filter(Boolean) as string[];

  return {
    band,
    rule: FIT_AGGREGATION_RULE,
    signals,
    reasons: reasons.slice(0, 3),
    missingInformation: Array.from(new Set(missingInformation))
  };
}

const FIT_AGGREGATION_RULE =
  "Initial fit is low if any decisive alignment signal is low, strong if at least two are known and all are strong, and moderate otherwise. Field alignment is shown but never lowers the band, because an opportunity not naming your discipline is not the same as excluding it. It is a band, not a score, because core answers alone cannot support a number.";

function aggregateFitBand(known: InitialFitSignal[]): FitBand {
  if (!known.length) return "unknown";
  if (known.some((signal) => signal.band === "low")) return "low";
  if (known.length >= 2 && known.every((signal) => signal.band === "strong")) return "strong";
  return "moderate";
}

function fitRank(band: FitBand) {
  return band === "low" ? 0 : band === "moderate" ? 1 : band === "strong" ? 2 : 3;
}

function eligibilityReason(eligibility: AssessmentResult["eligibility"]) {
  if (eligibility.status === "ineligible") {
    return `A hard requirement does not pass: ${eligibility.blockers.join("; ")}.`;
  }
  if (eligibility.status === "uncertain") {
    const unknown = eligibility.conditions.filter((condition) => condition.result === "unknown");
    return `${unknown.length} hard requirement${unknown.length === 1 ? "" : "s"} cannot be checked yet: ${unknown.map((condition) => condition.label.toLowerCase()).join("; ")}.`;
  }
  const passed = eligibility.conditions.filter((condition) => condition.result === "pass");
  return `All ${passed.length} published hard requirement${passed.length === 1 ? "" : "s"} pass on the details provided.`;
}

function initialFitSignals(opportunity: Opportunity, core: CoreProfile): InitialFitSignal[] {
  return [
    academicSignal(opportunity, core),
    stageSignal(opportunity, core),
    fieldSignal(opportunity, core),
    incomeSignal(opportunity, core)
  ].filter(Boolean) as InitialFitSignal[];
}

function academicSignal(opportunity: Opportunity, core: CoreProfile): InitialFitSignal {
  const merit = academicMeritsSelection(opportunity);
  const comparedWith = merit
    ? "academic record, which this opportunity lists among its selection criteria"
    : "academic record, which is a general readiness signal rather than a published criterion here";
  if (!core.academicPerformance) {
    return {
      id: "academic",
      label: "Academic alignment",
      band: "unknown",
      userValue: "Not provided",
      comparedWith,
      explanation: "Academic performance has not been provided, so academic alignment cannot be placed.",
      source: merit ? "Official criterion" : "Process-derived",
      affectsBand: true
    };
  }
  const band: FitBand = core.academicPerformance.startsWith("Above 85") ? "strong" : core.academicPerformance.startsWith("Below 60") ? "low" : "moderate";
  return {
    id: "academic",
    label: "Academic alignment",
    band,
    userValue: core.academicPerformance,
    comparedWith,
    explanation: `Academic record of ${core.academicPerformance.toLowerCase()} places academic alignment as ${band} against the ${comparedWith}.`,
    source: merit ? "Official criterion" : "Process-derived",
    affectsBand: true
  };
}

function stageSignal(opportunity: Opportunity, core: CoreProfile): InitialFitSignal {
  const target = `${opportunity.stage} ${opportunity.targetApplicant}`;
  if (!core.educationLevel) {
    return {
      id: "stage",
      label: "Stage alignment",
      band: "unknown",
      userValue: "Not provided",
      comparedWith: opportunity.stage,
      explanation: "Education level has not been provided, so stage alignment cannot be placed.",
      source: "Official criterion",
      affectsBand: true
    };
  }
  const wanted = stageKeywords(target);
  const mine = stageKeywords(`${core.educationLevel} ${core.yearStatus}`);
  const overlap = mine.some((keyword) => wanted.includes(keyword));
  const targetIsSpecific = wanted.length > 0;
  const band: FitBand = !targetIsSpecific ? "moderate" : overlap ? "strong" : "low";
  const explanation = !targetIsSpecific
    ? `This opportunity does not publish a specific study stage, so ${core.educationLevel.toLowerCase()} is neither confirmed nor excluded.`
    : overlap
      ? `${core.educationLevel} matches the stage this opportunity targets (${opportunity.stage}).`
      : `${core.educationLevel} does not match the stage this opportunity targets (${opportunity.stage}).`;
  return {
    id: "stage",
    label: "Stage alignment",
    band,
    userValue: [core.educationLevel, core.yearStatus].filter(Boolean).join(", "),
    comparedWith: opportunity.stage,
    explanation,
    source: "Official criterion",
    affectsBand: true
  };
}

function fieldSignal(opportunity: Opportunity, core: CoreProfile): InitialFitSignal | null {
  if (!core.fieldOfStudy) return null;
  const text = normalize(`${opportunity.name} ${opportunity.description} ${opportunity.targetApplicant} ${opportunity.tags.join(" ")}`);
  const named = normalize(core.fieldOfStudy)
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length > 3)
    .some((token) => text.includes(token));
  const restricted = FIELD_KEYWORDS.some((keyword) => text.includes(keyword));

  // Absence of a mention is not exclusion, so this signal never reports "low".
  const band: FitBand = named || !restricted ? "strong" : "moderate";
  const explanation = named
    ? `${core.fieldOfStudy} appears in this opportunity's published description.`
    : restricted
      ? `This opportunity names particular disciplines and does not mention ${core.fieldOfStudy}, though it does not exclude it either.`
      : `This opportunity publishes no discipline restriction, so ${core.fieldOfStudy} is not a barrier.`;
  return {
    id: "field",
    label: "Field alignment",
    band,
    userValue: core.fieldOfStudy,
    comparedWith: "published description and tags",
    explanation,
    source: "Process-derived",
    affectsBand: false
  };
}

const FIELD_KEYWORDS = ["engineering", "technical", "science", "research", "design", "medical", "management", "biotech", "agriculture", "law"];

function incomeSignal(opportunity: Opportunity, core: CoreProfile): InitialFitSignal | null {
  const rule = (opportunity.eligibilityRules ?? []).find((item) => item.profileField === "income" && (item.operator === "lte" || item.operator === "between"));
  if (!rule) return null;
  const threshold = typeof rule.value === "number" ? rule.value : null;
  if (!core.householdIncome) {
    return {
      id: "income",
      label: "Income alignment",
      band: "unknown",
      userValue: "Not provided",
      comparedWith: rule.label,
      explanation: `Household income has not been provided, so ${rule.label.toLowerCase()} cannot be checked.`,
      source: rule.source,
      affectsBand: true
    };
  }
  const declared = incomeBandCeiling(core.householdIncome);
  const band: FitBand = threshold === null || declared === null ? "unknown" : declared <= threshold ? "strong" : "low";
  const explanation =
    threshold === null || declared === null
      ? `Household income of ${core.householdIncome} could not be compared with ${rule.label.toLowerCase()}.`
      : declared <= threshold
        ? `Declared household income of ${core.householdIncome} is within ${rule.label.toLowerCase()}.`
        : `Declared household income of ${core.householdIncome} is above ${rule.label.toLowerCase()}.`;
  return {
    id: "income",
    label: "Income alignment",
    band,
    userValue: core.householdIncome,
    comparedWith: rule.label,
    explanation,
    source: rule.source,
    affectsBand: true
  };
}

/** The top of a declared band, so an "up to X lakh" rule is tested against the worst case. */
export function incomeBandCeiling(band: string): number | null {
  if (/above/i.test(band)) return Number.POSITIVE_INFINITY;
  const numbers = band.match(/[0-9]+(?:\.[0-9]+)?/g);
  if (!numbers?.length) return null;
  return Math.max(...numbers.map(Number));
}

function academicMeritsSelection(opportunity: Opportunity) {
  const text = normalize(`${(opportunity.selectionCriteria ?? []).map((item) => item.label).join(" ")} ${opportunity.eligibility.join(" ")}`);
  return text.includes("academic") || text.includes("merit") || text.includes("record");
}

function stageKeywords(value: string) {
  const text = normalize(value);
  return ["school", "diploma", "undergraduate", "postgraduate", "doctoral", "phd", "faculty", "founder", "researcher", "professional"].filter((keyword) =>
    keyword === "phd" ? text.includes("phd") || text.includes("doctoral") : text.includes(keyword)
  );
}

function evaluateEligibility(opportunity: Opportunity, applicant: DemoProfile): AssessmentResult["eligibility"] {
  const rules = opportunity.eligibilityRules?.length ? opportunity.eligibilityRules : fallbackEligibilityRules(opportunity);
  const conditions = rules.map((rule) => {
    const rawValue = applicant[rule.profileField as keyof DemoProfile];
    const result = evaluateRule(rawValue, rule);
    return {
      id: rule.id,
      label: rule.label,
      result,
      userValue: stringifyValue(rawValue),
      requiredValue: stringifyValue(rule.value),
      explanation: explainEligibility(rule, result, rawValue),
      source: rule.source
    };
  });
  const blockers = conditions.filter((condition) => condition.result === "fail").map((condition) => condition.label);
  const status: EligibilityStatus = blockers.length ? "ineligible" : conditions.some((condition) => condition.result === "unknown") ? "uncertain" : "eligible";
  return { status, conditions, blockers };
}

function evaluateCompetitivenessCriteria(opportunity: Opportunity, responses: Record<string, string>, applicant: DemoProfile, personaNarrative = true): AssessmentResult["competitiveness"]["criteria"] {
  const sourceCriteria = getOpportunityCriteria(opportunity);
  const weights = normalizedWeights(sourceCriteria);
  return sourceCriteria.map((criterion, index) => {
    const answer = responses[criterion.answerKey];
    const evidenceScore = evidenceScoreForAnswer(criterion, answer);
    return {
      id: criterion.id,
      label: criterion.criterion,
      importance: toLowerImportance(criterion.importance ?? inferImportance(criterion)),
      weight: weights[index] ?? 0,
      basis: criterion.basis ?? basisFromSource(criterion.source),
      evidenceStrength: evidenceStrengthForScore(evidenceScore),
      evidenceScore,
      explanation: criterionExplanation(criterion, answer, evidenceScore, personaNarrative),
      evidenceFromProfile: profileEvidenceForCriterion(applicant, criterion),
      source: criterion.source === "Unknown / criteria not publicly disclosed" ? undefined : criterion.source
    };
  });
}

function calculateCompetitiveness(criteria: AssessmentResult["competitiveness"]["criteria"]): AssessmentResult["competitiveness"] {
  if (!criteria.length || criteria.every((criterion) => criterion.basis === "unknown")) {
    return { score: null, band: "unknown", assessedWeightPercent: 0, criteria };
  }

  const totalWeight = sum(criteria.map((criterion) => criterion.weight));
  const knownCriteria = criteria.filter((criterion) => criterion.evidenceScore !== null);
  const knownWeight = sum(knownCriteria.map((criterion) => criterion.weight));
  const assessedWeightPercent = totalWeight ? Math.round((knownWeight / totalWeight) * 100) : 0;

  if (!totalWeight || knownWeight / totalWeight < 0.6) {
    return { score: null, band: "unknown", assessedWeightPercent, criteria };
  }

  const rawScore = knownCriteria.reduce((total, criterion) => total + criterion.weight * ((criterion.evidenceScore ?? 0) / 4), 0);
  const score = Math.round((rawScore / knownWeight) * 100);
  return { score, band: bandForScore(score), assessedWeightPercent, criteria };
}

function deriveCanonicalConfidence(
  eligibility: AssessmentResult["eligibility"],
  competitiveness: AssessmentResult["competitiveness"]
): AssessmentResult["confidence"] {
  const totalCriteriaWeight = sum(competitiveness.criteria.map((criterion) => criterion.weight));
  const publicWeight = sum(competitiveness.criteria.filter((criterion) => criterion.basis === "explicit" || criterion.basis === "strongly_inferred").map((criterion) => criterion.weight));
  const publicCriteriaCoverage = totalCriteriaWeight ? Math.round((publicWeight / totalCriteriaWeight) * 100) : 0;
  const unknownEligibility = eligibility.conditions.some((condition) => condition.result === "unknown");
  const inferredOrMissing = competitiveness.criteria.some((criterion) => criterion.basis === "weakly_inferred" || criterion.basis === "unknown" || criterion.evidenceScore === null);
  const level: ConfidenceLevel =
    !unknownEligibility && publicCriteriaCoverage >= 80 && competitiveness.assessedWeightPercent >= 80 && !inferredOrMissing
      ? "high"
      : publicCriteriaCoverage >= 60 && competitiveness.assessedWeightPercent >= 60
        ? "medium"
        : "low";

  return {
    level,
    publicCriteriaCoverage,
    userEvidenceCoverage: competitiveness.assessedWeightPercent,
    explanation: confidenceExplanation(level, publicCriteriaCoverage, competitiveness.assessedWeightPercent, unknownEligibility)
  };
}

function chooseCanonicalRecommendation(
  eligibilityStatus: EligibilityStatus,
  competitiveness: AssessmentResult["competitiveness"],
  opportunity: Opportunity,
  now: Date | string | undefined
): AssessmentResult["recommendation"] {
  if (eligibilityStatus === "ineligible") {
    return { verdict: "do_not_apply", explanation: "Do not apply: a hard eligibility requirement is not met. Competitiveness does not override formal eligibility." };
  }
  if (eligibilityStatus === "uncertain") {
    return { verdict: "verify_eligibility", explanation: "Verify eligibility before investing application effort. At least one hard requirement is still unknown." };
  }
  if (competitiveness.score === null) {
    return { verdict: "insufficient_information", explanation: "Competitiveness cannot be reliably estimated from available public criteria and user evidence." };
  }

  const urgent = isDeadlineUrgent(opportunity.deadline, now);
  if (competitiveness.score >= 75) {
    return { verdict: "strong_opportunity", explanation: `Strong opportunity: you are formally eligible and the known evidence supports a ${competitiveness.score}/100 competitive fit.` };
  }
  if (competitiveness.score >= 55) {
    return { verdict: "worth_applying", explanation: `Worth applying: you are eligible and have credible evidence across several important criteria. Competitive fit is ${competitiveness.score}/100.` };
  }
  if (competitiveness.score >= 35) {
    return urgent
      ? { verdict: "low_priority", explanation: `Low-priority application: competitive fit is ${competitiveness.score}/100, and the deadline is too close for the main gaps to be fixed confidently.` }
      : { verdict: "improve_before_applying", explanation: `Improve before applying: you are eligible, but competitive fit is ${competitiveness.score}/100 and important evidence gaps remain.` };
  }
  return { verdict: "low_priority", explanation: `Low priority: you are eligible, but the known evidence currently supports only a ${competitiveness.score}/100 competitive fit.` };
}

function buildCanonicalGaps(
  eligibility: AssessmentResult["eligibility"],
  criteria: AssessmentResult["competitiveness"]["criteria"]
): AssessmentResult["gaps"] {
  const eligibilityGaps = eligibility.conditions
    .filter((condition) => condition.result !== "pass")
    .map((condition) => ({
      label: condition.label,
      severity: condition.result === "fail" ? "critical" as const : "important" as const,
      improvable: condition.result === "unknown",
      suggestion: condition.result === "fail" ? "Choose opportunities where this hard rule is satisfied." : `Confirm ${condition.label.toLowerCase()} with a factual profile field or document.`
    }));

  const evidenceGaps = criteria
    .filter((criterion) => criterion.evidenceScore === null || criterion.evidenceScore <= 2)
    .map((criterion) => ({
      label: criterion.label,
      severity: criterion.importance === "high" ? "important" as const : "minor" as const,
      improvable: true,
      suggestion: criterion.evidenceScore === null
        ? `Add factual evidence for ${criterion.label.toLowerCase()} before Disha estimates fit.`
        : `Strengthen ${criterion.label.toLowerCase()} with ownership, output, scale or validation.`
    }));

  return [...eligibilityGaps, ...evidenceGaps].sort((a, b) => gapSeverityScore(b) - gapSeverityScore(a));
}

function buildCanonicalStrengths(opportunity: Opportunity, applicant: DemoProfile, criteria: AssessmentResult["competitiveness"]["criteria"], personaNarrative = true) {
  const criterionStrengths = criteria
    .filter((criterion) => criterion.evidenceScore !== null && criterion.evidenceScore >= 3)
    .map((criterion) => `${criterion.label}: ${criterion.explanation}`);
  const catalogueNarrative = personaNarrative ? opportunity.assessment?.strengths ?? [] : [];
  return Array.from(new Set([...catalogueNarrative, ...criterionStrengths, ...applicant.strengths])).slice(0, 6);
}

function fallbackEligibilityRules(opportunity: Opportunity): EligibilityRule[] {
  if (!opportunity.eligibility.length) {
    return [{ id: "eligibility-information", label: "Published eligibility information", profileField: "citizenship", operator: "exists", source: opportunity.officialSource, confidence: "low" }];
  }
  return opportunity.eligibility.slice(0, 4).map((label, index) => ({
    id: `eligibility-${index + 1}`,
    label,
    profileField: "citizenship" as const,
    operator: "exists" as const,
    source: opportunity.officialSource,
    confidence: "low" as const
  }));
}

function evaluateRule(rawValue: unknown, rule: EligibilityRule): EligibilityConditionResult {
  if (isMissing(rawValue)) return "unknown";
  const required = rule.value;
  if (rule.operator !== "exists" && required === undefined) return "unknown";

  const values = Array.isArray(rawValue) ? rawValue.map(normalize) : [normalize(rawValue)];
  const requiredValues = Array.isArray(required) && rule.operator !== "between" ? required.map(normalize) : [normalize(required)];
  const numericValue = parseComparableNumber(rawValue);
  const numericRequired = parseComparableNumber(required);

  switch (rule.operator) {
    case "exists":
      return "pass";
    case "equals":
      return values.some((value) => requiredValues.includes(value)) ? "pass" : "fail";
    case "not_equals":
      return values.every((value) => !requiredValues.includes(value)) ? "pass" : "fail";
    case "includes":
      return values.some((value) => requiredValues.some((requiredValue) => value.includes(requiredValue))) ? "pass" : "fail";
    case "excludes":
      return values.every((value) => requiredValues.every((requiredValue) => !value.includes(requiredValue))) ? "pass" : "fail";
    case "one_of":
      return values.some((value) => requiredValues.some((requiredValue) => value.includes(requiredValue) || requiredValue.includes(value))) ? "pass" : "fail";
    case "gte":
      return numericValue === null || numericRequired === null ? "unknown" : numericValue >= numericRequired ? "pass" : "fail";
    case "lte":
      return numericValue === null || numericRequired === null ? "unknown" : numericValue <= numericRequired ? "pass" : "fail";
    case "between": {
      const range = Array.isArray(required) ? required : null;
      if (numericValue === null || !range || typeof range[0] !== "number" || typeof range[1] !== "number") return "unknown";
      return numericValue >= range[0] && numericValue <= range[1] ? "pass" : "fail";
    }
    case "boolean": {
      const bool = booleanValue(rawValue);
      return bool === null || typeof required !== "boolean" ? "unknown" : bool === required ? "pass" : "fail";
    }
  }
}

function normalizedWeights(criteria: EvaluatorCriterion[]) {
  if (!criteria.length) return [];
  const officialWeights = criteria.map((criterion) => criterion.weight);
  if (officialWeights.every((weight) => typeof weight === "number")) {
    return officialWeights as number[];
  }
  const raw = criteria.map((criterion) => {
    const importance = criterion.importance ?? inferImportance(criterion);
    return importance === "High" ? 3 : importance === "Medium" ? 2 : 1;
  });
  const total = sum(raw);
  return raw.map((weight) => Math.round((weight / total) * 1000) / 10);
}

function evidenceScoreForAnswer(criterion: EvaluatorCriterion, answer: string | undefined): EvidenceScore {
  if (!answer) return null;
  if (criterion.strongAnswers.includes(answer)) return 4;
  if (criterion.moderateAnswers.includes(answer)) return 3;
  const normalizedAnswer = normalize(answer);
  if (/\b(no|none|not|unclear|unknown|missing)\b/.test(normalizedAnswer)) return 0;
  if (normalizedAnswer.includes("broad") || normalizedAnswer.includes("idea only") || normalizedAnswer.includes("solo founder") || normalizedAnswer.includes("early researcher")) return 1;
  return 2;
}

function evidenceStrengthForScore(score: EvidenceScore): EvidenceStrength {
  if (score === null) return "unknown";
  if (score === 0) return "none";
  if (score === 1) return "claim_only";
  if (score === 2) return "weak";
  if (score === 3) return "credible";
  return "strong";
}

function criterionExplanation(criterion: EvaluatorCriterion, answer: string | undefined, score: EvidenceScore, personaNarrative = true) {
  if (score === null) return `Disha does not yet know enough about ${criterion.criterion.toLowerCase()}.`;
  if (score >= 3) {
    // The stored evidence line is written about the demo persona and quotes its numbers, so for
    // anyone else the explanation is built from the answer they actually gave.
    if (personaNarrative) return criterion.evidence[answer ?? ""] ?? criterion.strongGap;
    return `You answered "${answer}", which counts as ${score === 4 ? "strong" : "credible"} evidence for ${criterion.criterion.toLowerCase()}.`;
  }
  if (score === 0) return criterion.weakGap;
  return criterion.moderateGap;
}

function profileEvidenceForCriterion(applicant: DemoProfile, criterion: EvaluatorCriterion) {
  const selected = applicant.evidence.filter((item) => criterion.profileEvidenceIds?.includes(item.id));
  const evidence = selected.length ? selected : applicant.evidence.filter((item) => normalize(`${item.id} ${item.label}`).includes(firstToken(criterion.id)));
  if (evidence.length) return evidence.map((item) => `${item.label}: ${item.summary}`);
  return [describeProfileEvidence(applicant, criterion)].filter(Boolean);
}

function profileFacts(applicant: DemoProfile): EvidenceFact[] {
  return applicant.evidence.map((item) => ({
    type: item.id.includes("research") ? "research" : item.id.includes("leadership") ? "leadership" : item.id.includes("project") ? "work" : item.id.includes("cgpa") || item.id.includes("academic") ? "academic" : "document",
    verification: item.source === "document" ? "documented" : item.source === "activity" ? "described" : "self_reported",
    summary: item.summary
  }));
}

function explainEligibility(rule: EligibilityRule, result: EligibilityConditionResult, rawValue: unknown) {
  if (result === "unknown") return `Disha needs ${rule.label.toLowerCase()} to evaluate this hard rule.`;
  if (result === "pass") return `${stringifyValue(rawValue) || "The profile value"} satisfies ${rule.label.toLowerCase()}.`;
  return `${stringifyValue(rawValue) || "The profile value"} does not satisfy ${rule.label.toLowerCase()}.`;
}

function basisFromSource(source: Provenance): CriterionBasis {
  if (source === "Official criterion") return "explicit";
  if (source === "Process-derived") return "strongly_inferred";
  if (source === "Historical") return "weakly_inferred";
  return "unknown";
}

function toLowerImportance(importance: ImportanceLevel): "high" | "medium" | "low" {
  if (importance === "High") return "high";
  if (importance === "Medium") return "medium";
  return "low";
}

function inferImportance(criterion: EvaluatorCriterion): ImportanceLevel {
  if (criterion.id.includes("eligibility") || criterion.id.includes("readiness") || criterion.id.includes("fund-use")) return "High";
  if (criterion.source === "Official criterion") return "High";
  if (criterion.source === "Process-derived") return "Medium";
  return "Low";
}

function bandForScore(score: number): CompetitivenessBand {
  if (score >= 75) return "strong";
  if (score >= 55) return "competitive";
  if (score >= 35) return "developing";
  return "weak";
}

function labelForVerdict(verdict: RecommendationVerdict): RecommendationLevel {
  if (verdict === "strong_opportunity") return "Strongly pursue";
  if (verdict === "worth_applying") return "Worth pursuing";
  if (verdict === "improve_before_applying") return "Pursue after improving";
  if (verdict === "low_priority") return "Low priority";
  if (verdict === "verify_eligibility") return "Verify eligibility";
  if (verdict === "do_not_apply") return "Do not apply";
  return "Insufficient information";
}

function recommendationKeyFor(recommendation: RecommendationLevel): RecommendationKey {
  if (recommendation === "Strongly pursue") return "strongly_pursue";
  if (recommendation === "Worth pursuing") return "worth_pursuing";
  if (recommendation === "Pursue after improving") return "pursue_after_improving";
  if (recommendation === "Low priority") return "low_priority";
  if (recommendation === "Verify eligibility") return "verify_eligibility";
  if (recommendation === "Do not apply") return "do_not_apply";
  return "insufficient_information";
}

function toDisplayGap(gap: AssessmentResult["gaps"][number] | undefined): AssessmentResult["biggestGap"] {
  if (!gap) return null;
  return {
    criterionId: gap.label.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    criterion: gap.label,
    summary: gap.suggestion ?? gap.label,
    whyItMatters: gap.severity === "critical" ? "This is a formal eligibility blocker." : "This criterion can materially affect the assessment.",
    action: gap.suggestion ?? "Add clearer evidence."
  };
}

function effortRationale(opportunity: Opportunity, gaps: AssessmentResult["gaps"], verdict: RecommendationVerdict) {
  if (verdict === "do_not_apply") return `Upside is ${opportunity.funding}, but a formal eligibility blocker comes first.`;
  if (!gaps.length) return `Upside is ${opportunity.funding}; no major gaps are visible in the current assessment.`;
  return `Upside is ${opportunity.funding}; remaining effort is focused on ${gaps.slice(0, 2).map((gap) => gap.label.toLowerCase()).join(" and ")}.`;
}

function defaultNextAction(verdict: RecommendationVerdict) {
  if (verdict === "verify_eligibility") return "Confirm the unknown hard requirement before preparing the application.";
  if (verdict === "do_not_apply") return "Move this lower and choose an opportunity where the hard rules pass.";
  if (verdict === "insufficient_information") return "Add evidence for the highest-weight unknown criterion.";
  return "Use the biggest evidence gap to strengthen the application packet.";
}

function eligibilitySummary(result: AssessmentResult) {
  const passCount = result.eligibility.conditions.filter((condition) => condition.result === "pass").length;
  return `You meet ${passCount} of ${result.eligibility.conditions.length} checked formal requirements.`;
}

function confidenceExplanation(level: ConfidenceLevel, publicCoverage: number, userCoverage: number, unknownEligibility: boolean) {
  if (level === "high") return "Most eligibility and selection criteria are documented, and user evidence coverage is strong.";
  if (unknownEligibility) return "At least one hard eligibility field is unknown, so Disha is cautious.";
  if (level === "medium") return `Some selection factors are inferred or some user evidence is missing. Public criteria coverage is ${publicCoverage}% and user evidence coverage is ${userCoverage}%.`;
  return "The opportunity publishes limited criteria or the profile is too incomplete for a confident assessment.";
}

function isDeadlineUrgent(deadline: string, now: Date | string | undefined) {
  const parsed = parseIsoDate(deadline);
  if (!parsed) return false;
  const current = now ? new Date(now) : new Date("2026-09-08T00:00:00+05:30");
  const diffDays = (parsed.getTime() - current.getTime()) / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 2;
}

function parseIsoDate(value: string) {
  const match = value.match(/\b(\d{4}-\d{2}-\d{2})\b/);
  return match ? new Date(`${match[1]}T23:59:59+05:30`) : null;
}

function findResponseFromCriterion(criterion: EvaluatedCriterion) {
  return criterion.evidenceFound === "No evidence captured yet." ? "" : criterion.evidenceFound;
}

function gapSeverityScore(gap: AssessmentResult["gaps"][number]) {
  return gap.severity === "critical" ? 3 : gap.severity === "important" ? 2 : 1;
}

function sum(values: number[]) {
  return values.reduce((total, value) => total + value, 0);
}

function firstToken(value: string) {
  return normalize(value).split(/[-\s]/)[0] ?? "";
}

function normalize(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function stringifyValue(value: unknown) {
  if (value === undefined || value === null) return undefined;
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

function isMissing(value: unknown) {
  if (value === undefined || value === null) return true;
  if (Array.isArray(value)) return value.length === 0;
  const normalised = normalize(value);
  return !normalised || normalised === "not provided" || normalised === "not confirmed" || normalised.startsWith("your ");
}

function booleanValue(value: unknown) {
  const normalised = normalize(value);
  if (["yes", "true", "verified", "available", "added"].includes(normalised)) return true;
  if (["no", "false", "missing", "not added"].includes(normalised)) return false;
  return null;
}

function parseComparableNumber(value: unknown) {
  if (typeof value === "number") return value;
  if (Array.isArray(value)) return null;
  const text = normalize(value);
  if (!text) return null;
  const match = text.match(/([0-9]+(?:\.[0-9]+)?)/);
  if (!match) return null;
  return Number(match[1]);
}

function describeProfileEvidence(applicant: DemoProfile, criterion: EvaluatorCriterion) {
  const join = (parts: (string | false)[]) => parts.filter(Boolean).join("; ");
  if (criterion.id.includes("eligibility")) {
    return join([applicant.gender, applicant.programme, applicant.institutionType && `${applicant.institutionType} institution`, applicant.income && `family income ${applicant.income}`]);
  }
  if (criterion.id.includes("academic")) {
    return join([applicant.cgpa, applicant.class12 && `Class 12 ${applicant.class12}`, applicant.college]);
  }
  if (criterion.id.includes("readiness")) {
    return join([applicant.aadhaar && `Aadhaar ${applicant.aadhaar}`, applicant.bank && `bank account ${applicant.bank}`, applicant.college && `institution ${applicant.college}`]);
  }
  return applicant.evidence.map((item) => `${item.label}: ${item.summary}`).join("; ");
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function buildGateResults(items: string[], responses: Record<string, string>, readiness = false) {
  const captured = Object.values(responses).filter(Boolean).length;
  return items.slice(0, 4).map((item, index) => {
    const status: GateStatus = captured === 0 ? "Unknown" : readiness && index > captured - 1 ? "Unknown" : "Pass";
    return {
      label: item,
      status,
      note: status === "Unknown" ? "Disha needs one more evidence point to confirm this." : "No blocker visible in the captured evidence."
    };
  });
}
