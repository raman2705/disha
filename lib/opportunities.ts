import { LucideIcon, FlaskConical, GraduationCap, HandCoins, Landmark, Rocket } from "lucide-react";
import { ananyaEvidencePassport, profile, type DemoProfile, type EvidenceRecord } from "@/lib/data";

export type OpportunityCategory = "Scholarships" | "Research Grants" | "Fellowships" | "Startup Funding" | "Government Schemes";
export type AssessmentStatus = "Strong" | "Moderate" | "Weak" | "Missing";
export type GateStatus = "Pass" | "Fail" | "Unknown";
export type Provenance = "Official criterion" | "Process-derived" | "Historical" | "Unknown / criteria not publicly disclosed";
export type AssessmentAvailabilityLevel = "full" | "partial" | "discovery";
export type ImportanceLevel = "High" | "Medium" | "Low";
export type FixabilityLevel = "Easy" | "Moderate" | "Hard" | "Not fixable before deadline";
export type RecommendationLevel = "Strongly pursue" | "Worth pursuing" | "Pursue after improving" | "Low priority" | "Not currently worth effort";

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

export type AssessmentResult = {
  opportunityId: string;
  applicantId: string;
  eligibility: {
    status: GateStatus;
    summary: string;
    basis: string[];
  };
  fit: {
    status: AssessmentStatus;
    summary: string;
    basis: string[];
  };
  readiness: {
    status: AssessmentStatus;
    summary: string;
    basis: string[];
  };
  overallAssessment: string;
  evaluatorLens: {
    criterionId: string;
    criterion: string;
    apparentImportance: ImportanceLevel;
    evidenceSource: Provenance;
    evidenceBasis: string;
    userEvidence: string;
    evidenceStrength: AssessmentStatus;
    gap: string;
    confidence: "High" | "Medium" | "Low";
  }[];
  evidenceStrength: {
    criterionId: string;
    criterion: string;
    strength: AssessmentStatus;
    why: string;
  }[];
  gaps: {
    criterionId: string;
    criterion: string;
    priority: ImportanceLevel;
    missing: string;
    whyItMatters: string;
    likelyEffect: string;
    fixability: FixabilityLevel;
    action: string;
  }[];
  strengths: string[];
  risks: string[];
  effortVsUpside: {
    effort: "Low" | "Moderate" | "High";
    upside: string;
    rationale: string;
  };
  recommendation: RecommendationLevel;
  improvementActions: string[];
  confidence: "High" | "Medium" | "Low";
  evidenceBasis: string[];
  generatedAt: string;
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

export function buildOpportunityAssessmentResult(opportunity: Opportunity, responses: Record<string, string>, applicant: DemoProfile = profile): AssessmentResult {
  if (opportunity.id === "aicte-pragati-scholarship" && applicant.id === ananyaEvidencePassport.applicantId) {
    return buildPragatiAssessmentFromEvidence(opportunity, applicant);
  }

  const assessment = evaluateOpportunityAssessment(opportunity, responses);
  const criteria = assessment.criteria;
  const hasCriteria = criteria.length > 0;
  const strongCount = criteria.filter((criterion) => criterion.status === "Strong").length;
  const moderateCount = criteria.filter((criterion) => criterion.status === "Moderate").length;
  const weakCount = criteria.filter((criterion) => criterion.status === "Weak" || criterion.status === "Missing").length;
  const demonstratedSignals = strongCount + moderateCount;
  const score = hasCriteria ? demonstratedSignals / criteria.length : 0;
  const eligibilityCriterion = criteria.find((criterion) => criterion.id.includes("eligibility"));
  const readinessCriteria = criteria.filter((criterion) => criterion.id.includes("readiness") || criterion.id.includes("evidence"));

  const eligibilityStatus: GateStatus =
    eligibilityCriterion?.status === "Weak" || eligibilityCriterion?.status === "Missing"
      ? eligibilityCriterion.status === "Missing" ? "Unknown" : "Fail"
      : assessment.eligibility.some((gate) => gate.status === "Fail")
        ? "Fail"
        : assessment.eligibility.some((gate) => gate.status === "Unknown")
          ? "Unknown"
          : "Pass";

  const fitStatus: AssessmentStatus =
    !hasCriteria ? "Missing" : score >= 0.75 ? "Strong" : score >= 0.45 ? "Moderate" : weakCount ? "Weak" : "Missing";
  const readinessStatus: AssessmentStatus = deriveReadinessStatus(readinessCriteria.length ? readinessCriteria : criteria);
  const recommendation = chooseRecommendation(eligibilityStatus, fitStatus, readinessStatus, score, weakCount);
  const gaps = criteria
    .filter((criterion) => criterion.status !== "Strong")
    .map((criterion) => ({
      criterionId: criterion.id,
      criterion: criterion.criterion,
      priority: criterion.importance ?? inferImportance(criterion),
      missing: criterion.gap,
      whyItMatters: criterion.signal,
      likelyEffect: criterion.likelyEffect ?? defaultLikelyEffect(criterion),
      fixability: criterion.fixability ?? inferFixability(criterion),
      action: criterion.action
    }))
    .sort((a, b) => gapPriorityScore(b) - gapPriorityScore(a));

  const strengths = [
    ...(opportunity.assessment?.strengths ?? []),
    ...criteria.filter((criterion) => criterion.status === "Strong").map((criterion) => `${criterion.criterion}: ${criterion.evidenceFound}`)
  ];

  const risks = gaps.map((gap) => gap.likelyEffect).slice(0, 3);
  const improvementActions = Array.from(new Set([...gaps.map((gap) => gap.action), ...(opportunity.assessment?.improvementActions ?? [])])).slice(0, 4);
  const evidenceBasis = Array.from(new Set([
    `${applicant.name}: ${applicant.programme}`,
    `${applicant.cgpa}; Class 12 ${applicant.class12}`,
    `${applicant.college} (${applicant.institutionType})`,
    ...applicant.evidence.map((item) => `${item.label}: ${item.summary}`)
  ]));

  return {
    opportunityId: opportunity.id,
    applicantId: applicant.id,
    eligibility: {
      status: eligibilityStatus,
      summary: eligibilityStatus === "Pass"
        ? `${applicant.name} appears formally eligible for ${opportunity.name}.`
        : eligibilityStatus === "Fail"
          ? `A hard eligibility issue is visible for ${opportunity.name}.`
          : `Disha needs more proof before confirming hard eligibility for ${opportunity.name}.`,
      basis: assessment.eligibility.map((gate) => `${gate.label}: ${gate.note}`)
    },
    fit: {
      status: fitStatus,
      summary: fitStatus === "Strong"
        ? `${opportunity.name} fits ${applicant.name}'s profile and available evidence.`
        : fitStatus === "Moderate"
          ? `${opportunity.name} could fit, but the evidence packet needs work.`
          : `Current evidence does not make ${opportunity.name} a good use of time yet.`,
      basis: criteria.map((criterion) => `${criterion.criterion}: ${criterion.status}`).slice(0, 4)
    },
    readiness: {
      status: readinessStatus,
      summary: readinessStatus === "Strong"
        ? "The application packet is ready to move toward submission."
        : readinessStatus === "Moderate"
          ? "The application is worth preparing, with fixable issues before submission."
          : "Readiness is not high enough to submit confidently yet.",
      basis: assessment.readiness.map((gate) => `${gate.label}: ${gate.status}`)
    },
    overallAssessment: overallAssessmentSummary(recommendation, opportunity, applicant, gaps),
    evaluatorLens: criteria.map((criterion) => ({
      criterionId: criterion.id,
      criterion: criterion.criterion,
      apparentImportance: criterion.importance ?? inferImportance(criterion),
      evidenceSource: criterion.source,
      evidenceBasis: criterion.evidenceFound,
      userEvidence: describeProfileEvidence(applicant, criterion),
      evidenceStrength: criterion.status,
      gap: criterion.gap,
      confidence: criterion.confidence
    })),
    evidenceStrength: criteria.map((criterion) => ({
      criterionId: criterion.id,
      criterion: criterion.criterion,
      strength: criterion.status,
      why: criterion.status === "Strong" ? criterion.strongGap : criterion.gap
    })),
    gaps,
    strengths: Array.from(new Set(strengths)).slice(0, 5),
    risks,
    effortVsUpside: {
      effort: gaps.length > 2 ? "High" : gaps.length ? "Moderate" : "Low",
      upside: opportunity.funding,
      rationale: gaps.length
        ? `Upside is ${opportunity.funding}; the remaining effort is focused on ${gaps.slice(0, 2).map((gap) => gap.criterion.toLowerCase()).join(" and ")}.`
        : `Upside is ${opportunity.funding}; no major student-owned gaps are visible.`
    },
    recommendation,
    improvementActions,
    confidence: deriveConfidence(criteria),
    evidenceBasis,
    generatedAt: "2026-09-07T00:00:00+05:30"
  };
}

function buildPragatiAssessmentFromEvidence(opportunity: Opportunity, applicant: DemoProfile): AssessmentResult {
  const evidence = ananyaEvidencePassport.records;
  const legalName = findEvidence(evidence, "legal-name");
  const enrolment = findEvidence(evidence, "institution-enrolment");
  const academics = findEvidence(evidence, "academic-record");
  const familyIncome = findEvidence(evidence, "family-income");
  const incomeCertificate = findEvidence(evidence, "income-certificate");
  const bank = findEvidence(evidence, "bank-account");
  const submissionPacket = findEvidence(evidence, "submission-packet");

  const evaluatorLens: AssessmentResult["evaluatorLens"] = [
    {
      criterionId: "identity-and-applicant-route",
      criterion: "Female student in eligible technical programme",
      apparentImportance: "High",
      evidenceSource: "Official criterion",
      evidenceBasis: "Programme explicitly requires an eligible woman student in technical education.",
      userEvidence: `${applicant.name}; ${applicant.gender}; ${enrolment?.value ?? applicant.programme}.`,
      evidenceStrength: "Strong",
      gap: "Supported by profile identity and institution enrolment evidence.",
      confidence: "High"
    },
    {
      criterionId: "income-threshold",
      criterion: "Income within applicable limit",
      apparentImportance: "High",
      evidenceSource: "Official criterion",
      evidenceBasis: "Programme income eligibility is a hard requirement; current proof is needed during submission and verification.",
      userEvidence: `${familyIncome?.value ?? applicant.income}; ${incomeCertificate?.value ?? "income certificate needs review"}.`,
      evidenceStrength: "Moderate",
      gap: "Underlying income appears within threshold, but the current certificate is stale and can block submission or verification.",
      confidence: "High"
    },
    {
      criterionId: "academic-institution-evidence",
      criterion: "Academic and institution evidence",
      apparentImportance: "High",
      evidenceSource: "Process-derived",
      evidenceBasis: "Institution verification needs current enrolment and academic records to confirm the application packet.",
      userEvidence: `${academics?.value ?? applicant.cgpa}; ${enrolment?.value ?? applicant.college}.`,
      evidenceStrength: "Strong",
      gap: "Strong evidence is available; keep it attached in the final packet.",
      confidence: "High"
    },
    {
      criterionId: "bank-payment-readiness",
      criterion: "Bank and payment readiness",
      apparentImportance: "Medium",
      evidenceSource: "Process-derived",
      evidenceBasis: "Payment is downstream of approval, but beneficiary/account consistency can become a blocker later.",
      userEvidence: `${bank?.value ?? applicant.bank}; ${legalName?.value ?? applicant.name} should be used consistently.`,
      evidenceStrength: "Moderate",
      gap: "Bank details are available; make sure the application uses the full legal name before submission.",
      confidence: "Medium"
    }
  ];

  const gaps: AssessmentResult["gaps"] = [
    {
      criterionId: "income-threshold",
      criterion: "Current income proof",
      priority: "High",
      missing: "The available income certificate is stale for submission.",
      whyItMatters: "Income is a hard eligibility requirement and weak proof can cause a return request even if the underlying income is within limit.",
      likelyEffect: "Application can be blocked or returned during submission or institution verification.",
      fixability: "Easy",
      action: "Refresh the income certificate before final submission."
    },
    {
      criterionId: "bank-payment-readiness",
      criterion: "Name consistency for payment",
      priority: "Medium",
      missing: "The final application should use Ananya Rao exactly as the beneficiary name.",
      whyItMatters: "PFMS and bank validation require beneficiary details to match the application record.",
      likelyEffect: "If shortened or mismatched, this can become a payment blocker after approval.",
      fixability: "Moderate",
      action: "Use the full legal name Ananya Rao consistently across the application and bank details."
    }
  ];

  return {
    opportunityId: opportunity.id,
    applicantId: applicant.id,
    eligibility: {
      status: "Pass",
      summary: `${applicant.name} appears formally eligible for ${opportunity.name}.`,
      basis: [
        `Identity: ${applicant.gender}; ${legalName?.note ?? "legal-name evidence is available."}`,
        `Education: ${enrolment?.note ?? applicant.programme}`,
        `Income: ${familyIncome?.note ?? "recorded income appears within threshold."}`
      ]
    },
    fit: {
      status: "Strong",
      summary: `${opportunity.name} fits ${applicant.name}'s profile: she is a woman student in an AICTE-approved technical programme with strong academic/institution evidence.`,
      basis: [`${enrolment?.label}: ${enrolment?.value}`, `${academics?.label}: ${academics?.value}`].filter(Boolean)
    },
    readiness: {
      status: "Moderate",
      summary: "The application is worth preparing, but the income proof should be refreshed before submission.",
      basis: [
        `${submissionPacket?.label ?? "Document packet"}: ${submissionPacket?.note ?? "Most documents are ready, one proof needs action."}`,
        `${incomeCertificate?.label ?? "Income certificate"}: ${incomeCertificate?.note ?? "Refresh before final submission."}`,
        `${bank?.label ?? "Bank account"}: ${bank?.note ?? "Bank details are available."}`
      ]
    },
    overallAssessment: `${opportunity.name} is worth pursuing for ${applicant.name}: core eligibility and fit are strong, and the biggest readiness issue is a fixable document problem.`,
    evaluatorLens,
    evidenceStrength: evaluatorLens.map((item) => ({
      criterionId: item.criterionId,
      criterion: item.criterion,
      strength: item.evidenceStrength,
      why: item.gap
    })),
    gaps,
    strengths: [
      `${enrolment?.label}: ${enrolment?.value}`,
      `${academics?.label}: ${academics?.value}`,
      `${familyIncome?.label}: ${familyIncome?.value} appears within the programme threshold.`,
      `${bank?.label}: ${bank?.value}`
    ].filter(Boolean),
    risks: gaps.map((gap) => gap.likelyEffect),
    effortVsUpside: {
      effort: "Moderate",
      upside: opportunity.funding,
      rationale: `The upside is ${opportunity.funding}; the main student-owned effort is refreshing income proof before submission.`
    },
    recommendation: "Worth pursuing",
    improvementActions: gaps.map((gap) => gap.action),
    confidence: "High",
    evidenceBasis: evidence.map((record) => `${record.label}: ${record.value} (${record.status}; ${record.source})`),
    generatedAt: "2026-09-07T00:00:00+05:30"
  };
}

function findEvidence(records: EvidenceRecord[], id: string) {
  return records.find((record) => record.id === id);
}

export function assistantReply(opportunity: Opportunity, assessment: OpportunityAssessment | AssessmentResult, prompt: string) {
  const result = "recommendation" in assessment ? assessment : buildOpportunityAssessmentResult(opportunity, Object.fromEntries(assessment.criteria.map((criterion) => [criterion.answerKey, findResponseFromCriterion(criterion)])));

  if (!result.evaluatorLens.length) {
    return `Detailed assessment is not available for ${opportunity.name} yet. Disha can still show access, eligibility and readiness information without inventing a score.`;
  }

  const normalised = prompt.toLowerCase();
  const biggestGap = result.gaps[0];

  if (normalised.includes("weak") || normalised.includes("marked")) {
    if (!biggestGap) return `${opportunity.name} has no weak signals in the current assessment. Keep the evidence packet concise and submit through the required access route.`;
    const lens = result.evaluatorLens.find((criterion) => criterion.criterionId === biggestGap.criterionId);
    return `${biggestGap.criterion} needs attention because ${lens?.evidenceBasis ?? biggestGap.missing}. It matters because ${biggestGap.whyItMatters} Next: ${biggestGap.action}`;
  }

  if (normalised.includes("eligible")) {
    return `${result.eligibility.summary} Basis: ${result.eligibility.basis.slice(0, 2).join(" ")}`;
  }

  if (normalised.includes("apply") || normalised.includes("right now") || normalised.includes("worth")) {
    return `${result.recommendation}. ${result.overallAssessment} First action: ${result.improvementActions[0] ?? "keep the application evidence concise and current"}.`;
  }

  if (normalised.includes("document") || normalised.includes("missing")) {
    return `For ${opportunity.name}, keep these ready: ${opportunity.readiness.slice(0, 4).join(", ")}. Disha will treat missing documents as readiness gaps, not selection odds.`;
  }

  return `${opportunity.name}: ${result.recommendation}. ${result.readiness.summary} The next useful action is ${result.improvementActions[0] ?? "keep the application evidence concise and current"}.`;
}

function deriveReadinessStatus(criteria: EvaluatedCriterion[]): AssessmentStatus {
  if (!criteria.length) return "Missing";
  if (criteria.some((criterion) => criterion.status === "Weak" || criterion.status === "Missing")) return "Weak";
  if (criteria.some((criterion) => criterion.status === "Moderate")) return "Moderate";
  return "Strong";
}

function chooseRecommendation(
  eligibilityStatus: GateStatus,
  fitStatus: AssessmentStatus,
  readinessStatus: AssessmentStatus,
  score: number,
  weakCount: number
): RecommendationLevel {
  if (eligibilityStatus === "Fail") return "Not currently worth effort";
  if (fitStatus === "Strong" && readinessStatus === "Strong" && score >= 0.85) return "Strongly pursue";
  if (fitStatus === "Strong" && (readinessStatus === "Strong" || readinessStatus === "Moderate")) return "Worth pursuing";
  if (score >= 0.45 && weakCount <= 2) return "Pursue after improving";
  if (eligibilityStatus === "Unknown" || fitStatus === "Missing") return "Low priority";
  return "Not currently worth effort";
}

function inferImportance(criterion: EvaluatorCriterion): ImportanceLevel {
  if (criterion.id.includes("eligibility") || criterion.id.includes("readiness") || criterion.id.includes("fund-use")) return "High";
  if (criterion.source === "Official criterion") return "High";
  if (criterion.source === "Process-derived") return "Medium";
  return "Low";
}

function inferFixability(criterion: EvaluatorCriterion): FixabilityLevel {
  if (criterion.id.includes("eligibility") || criterion.id.includes("readiness") || criterion.answerKey.includes("documents")) return "Easy";
  if (criterion.source === "Process-derived") return "Moderate";
  return "Hard";
}

function gapPriorityScore(gap: { priority: ImportanceLevel; fixability: FixabilityLevel }) {
  const importance = gap.priority === "High" ? 3 : gap.priority === "Medium" ? 2 : 1;
  const fixability = gap.fixability === "Easy" ? 3 : gap.fixability === "Moderate" ? 2 : gap.fixability === "Hard" ? 1 : 0;
  return importance * 10 + fixability;
}

function defaultLikelyEffect(criterion: EvaluatorCriterion) {
  if (criterion.id.includes("eligibility")) return "A hard requirement may block application submission or verification.";
  if (criterion.id.includes("readiness")) return "A readiness issue may create a return request after submission.";
  return "Reviewers may discount this part of the application if the evidence remains thin.";
}

function deriveConfidence(criteria: EvaluatedCriterion[]) {
  if (!criteria.length) return "Low";
  if (criteria.every((criterion) => criterion.confidence === "High")) return "High";
  if (criteria.some((criterion) => criterion.confidence === "Low")) return "Medium";
  return "Medium";
}

function describeProfileEvidence(applicant: DemoProfile, criterion: EvaluatorCriterion) {
  const selectedEvidence = applicant.evidence.filter((item) => criterion.profileEvidenceIds?.includes(item.id));
  if (selectedEvidence.length) {
    return selectedEvidence.map((item) => `${item.label}: ${item.summary}`).join("; ");
  }
  if (criterion.id.includes("eligibility")) {
    return `${applicant.gender}; ${applicant.programme}; ${applicant.institutionType} institution; family income ${applicant.income}.`;
  }
  if (criterion.id.includes("academic")) {
    return `${applicant.cgpa}; Class 12 ${applicant.class12}; ${applicant.college}.`;
  }
  if (criterion.id.includes("readiness")) {
    return `Aadhaar ${applicant.aadhaar}; bank account ${applicant.bank}; institution ${applicant.college}.`;
  }
  return applicant.evidence.map((item) => `${item.label}: ${item.summary}`).join("; ");
}

function overallAssessmentSummary(recommendation: RecommendationLevel, opportunity: Opportunity, applicant: DemoProfile, gaps: AssessmentResult["gaps"]) {
  if (recommendation === "Worth pursuing") {
    return `${opportunity.name} is worth pursuing for ${applicant.name}: fit and eligibility are strong enough, and the remaining issues are fixable before submission.`;
  }
  if (recommendation === "Strongly pursue") {
    return `${opportunity.name} is a strong next application for ${applicant.name}. The evidence packet is ready to move forward.`;
  }
  if (recommendation === "Pursue after improving") {
    return `${opportunity.name} could be worth pursuing after improving ${gaps[0]?.criterion.toLowerCase() ?? "the evidence packet"}.`;
  }
  if (recommendation === "Low priority") {
    return `${opportunity.name} should not be the first priority until Disha has stronger proof of eligibility and fit.`;
  }
  return `${opportunity.name} is not currently worth the effort because a hard requirement or high-impact gap is unresolved.`;
}

function findResponseFromCriterion(criterion: EvaluatedCriterion) {
  return criterion.evidenceFound === "No evidence captured yet." ? "" : criterion.evidenceFound;
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
