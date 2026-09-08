/**
 * Blocker lifecycle.
 *
 * A blocker never resolves because someone clicked it. The applicant has to supply the evidence
 * the blocker names, and that evidence then goes through a review the applicant does not control.
 * The review is simulated for the demo, but the shape is the real one: the applicant owns
 * providing, somebody else owns accepting.
 */
export type BlockerState = "missing" | "action_needed" | "provided" | "under_review" | "resolved";

export type BlockerEvent =
  | { type: "start" }
  | { type: "provide"; evidence: string }
  | { type: "submit_for_review" }
  | { type: "review_passed" }
  | { type: "review_returned"; reason: string };

export type BlockerDefinition = {
  id: string;
  title: string;
  severity: "Required" | "Recommended";
  whyItMatters: string;
  /** What the applicant must actually supply. A blocker with nothing to supply is not a blocker. */
  evidencePrompt: string;
  evidenceOptions: string[];
  owner: string;
  reviewer: string;
  /** What the reviewer is checking, so "under review" is never an unexplained spinner. */
  reviewCheck: string;
};

export type BlockerStatus = {
  state: BlockerState;
  evidence?: string;
  returnedReason?: string;
};

export const initialBlockerStatus: BlockerStatus = { state: "missing" };

/**
 * The only legal transitions. Anything else leaves the blocker where it is, so a stray click or a
 * replayed event can never skip the review.
 */
export function nextBlockerStatus(status: BlockerStatus, event: BlockerEvent): BlockerStatus {
  switch (event.type) {
    case "start":
      return status.state === "missing" ? { ...status, state: "action_needed" } : status;
    case "provide":
      if (status.state !== "action_needed" && status.state !== "missing") return status;
      if (!event.evidence) return status;
      return { state: "provided", evidence: event.evidence };
    case "submit_for_review":
      return status.state === "provided" ? { ...status, state: "under_review" } : status;
    case "review_passed":
      return status.state === "under_review" ? { ...status, state: "resolved", returnedReason: undefined } : status;
    case "review_returned":
      return status.state === "under_review" ? { state: "action_needed", evidence: status.evidence, returnedReason: event.reason } : status;
    default:
      return status;
  }
}

export const blockerStateCopy: Record<BlockerState, { label: string; tone: "danger" | "warning" | "active" | "success"; meaning: string }> = {
  missing: {
    label: "Missing",
    tone: "danger",
    meaning: "Disha has nothing on file for this yet."
  },
  action_needed: {
    label: "Action needed",
    tone: "warning",
    meaning: "This one is yours to resolve. Provide the evidence below."
  },
  provided: {
    label: "Provided",
    tone: "active",
    meaning: "Recorded on your side. It has not been checked yet."
  },
  under_review: {
    label: "Under review",
    tone: "active",
    meaning: "With the reviewer now. You do not need to do anything while it is here."
  },
  resolved: {
    label: "Resolved",
    tone: "success",
    meaning: "Checked and accepted. This is no longer blocking the application."
  }
};

/** Who owns the next move, which is the question the ownership rail exists to answer. */
export function blockerOwner(definition: BlockerDefinition, status: BlockerStatus) {
  if (status.state === "resolved") return "Nobody. This step is done.";
  if (status.state === "under_review") return definition.reviewer;
  return definition.owner;
}

export function isBlocking(status: BlockerStatus) {
  return status.state !== "resolved";
}

/** Blocks the applicant specifically, as opposed to sitting with a reviewer. */
export function needsApplicantAction(status: BlockerStatus) {
  return status.state === "missing" || status.state === "action_needed";
}
