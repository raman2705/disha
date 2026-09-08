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
import { buildNormalApplicant, type NormalAssessmentDraft } from "@/lib/normalAssessment";

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
  const normalAssessmentResult = normalAssessment?.generated ? normalAssessment.assessmentResult : null;
  const resolvedOpportunityId = guidedDemoActive
    ? opportunityId ?? opportunityIdFromPathname(pathname) ?? canonicalGuidedDemoOpportunityId
    : normalAssessmentResult?.opportunityId ?? opportunityIdFromPathname(pathname);
  const activeOpportunity = resolvedOpportunityId
    ? getOpportunity(resolvedOpportunityId) ?? (guidedDemoActive ? getOpportunity(canonicalGuidedDemoOpportunityId) ?? null : null)
    : null;
  const stage = guidedDemoActive ? stageFromPathname(pathname, demoState) : normalAssessmentResult ? "Assess" : "Discover";
  const state = guidedDemoActive ? stateForStage(stage, demoState) : "assess";
  const canonicalApplication = getCanonicalApplicationForDemoState(state, activeOpportunity?.id ?? canonicalGuidedDemoOpportunityId);
  const snapshotId = snapshotForState(state);
  const ownership = getApplicationOwnership(canonicalApplication, snapshotId);
  const preSubmission = state === "discover" || state === "assess" || state === "prepare" || state === "apply";
  const currentProfile = guidedDemoActive ? profile : buildNormalApplicant(normalAssessment);
  const evidencePassport = guidedDemoActive ? ananyaEvidencePassport : buildNormalEvidencePassport(normalAssessment, currentProfile);
  const responses = activeOpportunity && guidedDemoActive ? sampleAssessmentResponses[activeOpportunity.id] ?? {} : {};
  const assessmentResult = guidedDemoActive && activeOpportunity ? buildOpportunityAssessmentResult(activeOpportunity, responses, currentProfile) : normalAssessmentResult;

  return {
    mode: guidedDemoActive ? "demo" : "normal",
    profile: currentProfile,
    evidencePassport,
    activeOpportunity,
    assessmentResult,
    journeyStage: stage,
    demoState: state,
    canonicalApplication,
    currentOwner: guidedDemoActive ? preSubmission ? canonicalApplication.owner : ownership.currentOwner : normalAssessmentResult ? "You" : "Disha",
    ownership,
    blocker: ownership.blockerReason ?? null,
    requiredAction: guidedDemoActive ? preSubmission ? canonicalApplication.nextStep : ownership.applicantAction : normalAssessmentResult?.nextAction ?? "Enter a few details to generate your first assessment.",
    nextStep: guidedDemoActive ? canonicalApplication.nextStep : normalAssessmentResult?.nextAction ?? "Start a lightweight assessment.",
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

function buildNormalEvidencePassport(draft: NormalAssessmentDraft | undefined, currentProfile: DemoProfile) {
  // The core profile is self-reported, so a record counts as available exactly when the person
  // actually answered the question behind it. Nothing is assumed on their behalf.
  const core = draft?.core;
  const evidence = {
    identity: Boolean(core?.ageBand && core?.domicile),
    academic: Boolean(core?.academicPerformance),
    income: Boolean(core?.householdIncome && core.householdIncome !== "Prefer not to say"),
    bank: false
  };
  return {
    applicantId: currentProfile.id,
    identity: {
      legalName: currentProfile.name,
      applicationName: currentProfile.name,
      identityConsistency: evidence.identity ? "available" as const : "missing" as const
    },
    records: [
      {
        id: "normal-identity",
        domain: "identity" as const,
        label: "Identity details",
        value: currentProfile.name,
        status: evidence.identity ? "available" as const : "missing" as const,
        source: "Profile" as const,
        freshness: "current" as const,
        note: evidence.identity ? "Basic identity details are available." : "Add identity details before submission."
      },
      {
        id: "normal-academic",
        domain: "education" as const,
        label: "Academic evidence",
        value: currentProfile.programme,
        status: evidence.academic ? "available" as const : "missing" as const,
        source: "Profile" as const,
        freshness: "current" as const,
        note: evidence.academic ? "Academic evidence is available for an initial assessment." : "Academic evidence is still missing."
      },
      {
        id: "normal-income",
        domain: "financial" as const,
        label: "Income evidence",
        value: currentProfile.income,
        status: evidence.income ? "available" as const : "action-required" as const,
        source: "Self-declared" as const,
        freshness: evidence.income ? "current" as const : "stale" as const,
        note: evidence.income ? "Income information can be checked against opportunity thresholds." : "Income proof is the main missing evidence."
      },
      {
        id: "normal-bank",
        domain: "bank" as const,
        label: "Bank evidence",
        value: currentProfile.bank,
        status: evidence.bank ? "available" as const : "missing" as const,
        source: "Profile" as const,
        freshness: "current" as const,
        note: evidence.bank ? "Bank details are available for readiness checks." : "Bank details can be added later, before submission."
      }
    ]
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
