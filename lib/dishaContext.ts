import {
  ananyaEvidencePassport,
  canonicalGuidedDemoOpportunityId,
  getApplicationOwnership,
  getCanonicalApplicationForDemoState,
  profile,
  stageForDemoState,
  type DemoApplication,
  type DemoProfile,
  type DemoState,
  type EvidencePassport,
  type OwnershipSnapshot,
  type Stage
} from "@/lib/data";
import { buildOpportunityAssessmentResult, getOpportunity, sampleAssessmentResponses, type AssessmentResult, type Opportunity } from "@/lib/opportunities";
import type { NormalAssessmentDraft } from "@/components/AppContext";

export type DishaContext = {
  mode: "normal" | "demo";
  profile: DemoProfile;
  evidencePassport: EvidencePassport;
  activeOpportunity: Opportunity | null;
  assessmentResult: AssessmentResult | null;
  journeyStage: Stage;
  demoState: DemoState;
  canonicalApplication: DemoApplication;
  currentOwner: string;
  ownership: OwnershipSnapshot;
  blocker: string | null;
  requiredAction: string;
  nextStep: string;
  documents: string[];
  paymentState: "not-started" | "blocked" | "revalidating" | "complete";
  renewalState: "not-active" | "active";
  relevantDeadlines: string[];
};

export function buildDishaContext({
  pathname = "/",
  opportunityId,
  demoState = "assess",
  guidedDemoActive = false,
  normalAssessment
}: {
  pathname?: string;
  opportunityId?: string;
  demoState?: DemoState;
  guidedDemoActive?: boolean;
  normalAssessment?: NormalAssessmentDraft;
} = {}): DishaContext {
  const resolvedOpportunityId = guidedDemoActive
    ? opportunityId ?? opportunityIdFromPathname(pathname) ?? canonicalGuidedDemoOpportunityId
    : normalAssessment?.opportunityId ?? opportunityIdFromPathname(pathname) ?? canonicalGuidedDemoOpportunityId;
  const activeOpportunity = getOpportunity(resolvedOpportunityId) ?? getOpportunity(canonicalGuidedDemoOpportunityId) ?? null;
  const stage = guidedDemoActive ? stageFromPathname(pathname, demoState) : normalAssessment?.generated ? "Assess" : "Discover";
  const state = guidedDemoActive ? stateForStage(stage, demoState) : "assess";
  const canonicalApplication = getCanonicalApplicationForDemoState(state, activeOpportunity?.id ?? canonicalGuidedDemoOpportunityId);
  const snapshotId = snapshotForState(state);
  const ownership = getApplicationOwnership(canonicalApplication, snapshotId);
  const preSubmission = state === "discover" || state === "assess" || state === "prepare" || state === "apply";
  const currentProfile = guidedDemoActive ? profile : buildNormalProfile(normalAssessment);
  const evidencePassport = guidedDemoActive ? ananyaEvidencePassport : buildNormalEvidencePassport(normalAssessment, currentProfile);
  const responses = activeOpportunity ? guidedDemoActive ? sampleAssessmentResponses[activeOpportunity.id] ?? {} : normalResponses(normalAssessment) : {};
  const assessmentResult = activeOpportunity ? buildOpportunityAssessmentResult(activeOpportunity, responses, currentProfile) : null;

  return {
    mode: guidedDemoActive ? "demo" : "normal",
    profile: currentProfile,
    evidencePassport,
    activeOpportunity,
    assessmentResult,
    journeyStage: stage,
    demoState: state,
    canonicalApplication,
    currentOwner: guidedDemoActive ? preSubmission ? canonicalApplication.owner : ownership.currentOwner : normalAssessment?.generated ? "You" : "Disha",
    ownership,
    blocker: ownership.blockerReason ?? null,
    requiredAction: guidedDemoActive ? preSubmission ? canonicalApplication.nextStep : ownership.applicantAction : normalAssessment?.generated ? "Review the assessment and decide what to improve first." : "Enter a few details to generate your first assessment.",
    nextStep: guidedDemoActive ? canonicalApplication.nextStep : normalAssessment?.generated ? "Ask Disha what to improve first." : "Start a lightweight assessment.",
    documents: guidedDemoActive ? canonicalApplication.documents : evidencePassport.records.map((record) => record.label),
    paymentState: guidedDemoActive && state === "payment-corrected" ? "revalidating" : guidedDemoActive && (state === "payment" || state === "payment-blocker") ? "blocked" : "not-started",
    renewalState: guidedDemoActive && state === "renewal" ? "active" : "not-active",
    relevantDeadlines: activeOpportunity?.deadline ? [activeOpportunity.deadline] : []
  };
}

export function assistantStarters(context: DishaContext) {
  if (context.journeyStage === "Assess") {
    return ["Should I actually apply?", "What should I improve first?", "Why is my readiness only moderate?", "What evidence are you using?"];
  }
  if (context.journeyStage === "Prepare") {
    return ["What is stopping me from submitting?", "Which document should I fix first?", "What can I reuse?"];
  }
  if (context.journeyStage === "Verification") {
    return ["Where is my application?", "Who has it?", "Do I need to do anything?", "What happens next?"];
  }
  if (context.journeyStage === "Payment") {
    return ["Why haven't I received the money?", "What is blocking payment?", "What do I need to fix?", "Who owns it now?"];
  }
  if (context.journeyStage === "Renewal") {
    return ["Do I need to start again?", "What can I reuse?", "What needs to be updated?"];
  }
  return ["What should I do next?", "Which opportunity fits best?", "What evidence does Disha already have?"];
}

function buildNormalProfile(draft?: NormalAssessmentDraft): DemoProfile {
  const name = draft?.name?.trim() || "you";
  const institution = draft?.institution?.trim() || "your institution";
  const programme = draft?.programme?.trim() || "your programme";
  const income = draft?.income?.trim() || "not provided";
  const gender = draft?.gender?.trim() || "not provided";

  return {
    ...profile,
    id: "normal-visitor",
    name,
    initials: name === "you" ? "YO" : name.split(/\s+/).map((part) => part[0]).join("").slice(0, 2).toUpperCase(),
    role: programme,
    college: institution,
    institutionType: institution.toLowerCase().includes("aicte") ? "AICTE-approved" : "Not confirmed",
    location: "",
    programme,
    course: programme,
    year: "",
    cgpa: draft?.evidence.academic ? "Academic record added" : "Academic record not added",
    income,
    gender,
    bank: draft?.evidence.bank ? "Added" : "Not added",
    aadhaar: draft?.evidence.identity ? "Added" : "Not added",
    strengths: draft?.generated ? ["Some profile evidence has been added"] : [],
    gaps: draft?.generated ? ["Disha needs more evidence to be confident"] : [],
    evidence: []
  };
}

function buildNormalEvidencePassport(draft: NormalAssessmentDraft | undefined, currentProfile: DemoProfile) {
  const evidence = draft?.evidence;
  return {
    applicantId: currentProfile.id,
    identity: {
      legalName: currentProfile.name,
      applicationName: currentProfile.name,
      identityConsistency: evidence?.identity ? "available" as const : "missing" as const
    },
    records: [
      {
        id: "normal-identity",
        domain: "identity" as const,
        label: "Identity details",
        value: currentProfile.name,
        status: evidence?.identity ? "available" as const : "missing" as const,
        source: "Profile" as const,
        freshness: "current" as const,
        note: evidence?.identity ? "Basic identity details are available." : "Add identity details before submission."
      },
      {
        id: "normal-academic",
        domain: "education" as const,
        label: "Academic evidence",
        value: currentProfile.programme,
        status: evidence?.academic ? "available" as const : "missing" as const,
        source: "Profile" as const,
        freshness: "current" as const,
        note: evidence?.academic ? "Academic evidence is available for an initial assessment." : "Academic evidence is still missing."
      },
      {
        id: "normal-income",
        domain: "financial" as const,
        label: "Income evidence",
        value: currentProfile.income,
        status: evidence?.income ? "available" as const : "action-required" as const,
        source: "Self-declared" as const,
        freshness: evidence?.income ? "current" as const : "stale" as const,
        note: evidence?.income ? "Income information can be checked against opportunity thresholds." : "Income proof is the main missing evidence."
      },
      {
        id: "normal-bank",
        domain: "bank" as const,
        label: "Bank evidence",
        value: currentProfile.bank,
        status: evidence?.bank ? "available" as const : "missing" as const,
        source: "Profile" as const,
        freshness: "current" as const,
        note: evidence?.bank ? "Bank details are available for readiness checks." : "Bank details can be added later, before submission."
      }
    ]
  };
}

function normalResponses(draft?: NormalAssessmentDraft): Record<string, string> {
  if (!draft?.generated) return {};
  return {
    eligibilityProof: draft.evidence.identity && draft.gender ? "Eligible but one document pending" : "Eligibility unclear",
    academicEvidence: draft.evidence.academic ? "Academic record visible but enrolment proof pending" : "Academic record unclear",
    readinessProof: draft.evidence.income && draft.evidence.bank ? "Records aligned" : "One correction needed"
  };
}

function opportunityIdFromPathname(pathname: string) {
  const match = pathname.match(/\/opportunities\/([^/]+)/);
  return match?.[1];
}

function stageFromPathname(pathname: string, demoState: DemoState): Stage {
  if (pathname.startsWith("/demo") || pathname === "/" || pathname.startsWith("/opportunities")) {
    if (pathname.includes("/assess")) return "Assess";
    return pathname.startsWith("/opportunities") ? "Discover" : stageForDemoState(demoState);
  }
  if (pathname.startsWith("/preflight")) return "Prepare";
  if (pathname.startsWith("/apply")) return "Apply";
  if (pathname.startsWith("/applications")) return "Verification";
  if (pathname.startsWith("/payments")) return "Payment";
  if (pathname.startsWith("/renewal")) return "Renewal";
  if (pathname.startsWith("/path")) return stageForDemoState(demoState);
  return stageForDemoState(demoState);
}

function stateForStage(stage: Stage, demoState: DemoState): DemoState {
  if (stage === "Discover") return demoState === "discover" ? "discover" : demoState;
  if (stage === "Assess") return "assess";
  if (stage === "Prepare") return "prepare";
  if (stage === "Apply") return "apply";
  if (stage === "Verification") return "verification";
  if (stage === "Payment") return demoState === "payment-corrected" ? "payment-corrected" : "payment-blocker";
  if (stage === "Renewal") return "renewal";
  return demoState;
}

function snapshotForState(state: DemoState) {
  if (state === "prepare") return "strengthen";
  if (state === "payment" || state === "payment-blocker") return "bank-blocker";
  if (state === "payment-corrected") return "revalidation";
  if (state === "renewal") return "needs-marksheet";
  return "institution-review";
}
