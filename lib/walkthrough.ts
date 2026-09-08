import { canonicalGuidedDemoOpportunityId } from "@/lib/data";

/**
 * The guided sample journey, as a sequence of contextual hints.
 *
 * One hint at a time, anchored to the page the visitor is already on. Each step says what to do,
 * why the step matters, and where it leads. A step completes when the visitor actually reaches the
 * next page, so the walkthrough follows them rather than blocking them.
 */
export type WalkthroughStep = {
  id: string;
  stage: string;
  /** Routes this hint belongs on. First entry is where the step starts. */
  match: (pathname: string) => boolean;
  title: string;
  body: string;
  /** The action the visitor should take here. */
  action: string;
  href?: string;
};

const assessHref = `/opportunities/${canonicalGuidedDemoOpportunityId}/assess`;

export const walkthroughSteps: WalkthroughStep[] = [
  {
    id: "discover",
    stage: "Discover",
    match: (pathname) => pathname === "/demo" || pathname === "/opportunities" || pathname.startsWith("/opportunities/") === false && pathname === "/",
    title: "Start with what is worth her time",
    body: "Ananya could apply to dozens of schemes. Disha ranks them by whether they are actually worth preparing, not by how many exist.",
    action: "Open an opportunity to see whether it fits Ananya.",
    href: assessHref
  },
  {
    id: "assess",
    stage: "Assess",
    match: (pathname) => pathname.startsWith("/opportunities/") && pathname.endsWith("/assess"),
    title: "Eligibility and fit are different questions",
    body: "Eligibility comes from the scheme's published hard rules. Fit is about how competitive the application would be. Disha keeps them apart so a strong profile is never mistaken for an eligible one.",
    action: "Read the eligibility and fit panels, then continue to Prepare.",
    href: "/preflight"
  },
  {
    id: "prepare",
    stage: "Prepare",
    match: (pathname) => pathname.startsWith("/preflight"),
    title: "See what is ready and what is missing",
    body: "Blockers do not clear because you clicked them. Provide the evidence, and it goes to whoever owns the check.",
    action: "Resolve a blocker, then start the application.",
    href: "/apply"
  },
  {
    id: "apply",
    stage: "Apply",
    match: (pathname) => pathname.startsWith("/apply"),
    title: "Most of the form is already answered",
    body: "Everything Disha already holds is prefilled, so the application is a review rather than a retyping exercise.",
    action: "Review the prefilled application and submit.",
    href: "/applications/pragati-readiness-2026"
  },
  {
    id: "verification",
    stage: "Verification",
    match: (pathname) => pathname.startsWith("/applications"),
    title: "Now it is somebody else's move",
    body: "After submission the application sits with the institution. The most common reason applicants give up here is not knowing that waiting is the correct state.",
    action: "Check who owns the next action, then follow the payment stage.",
    href: "/payments/pragati-payment-2026"
  },
  {
    id: "payment",
    stage: "Payment",
    match: (pathname) => pathname.startsWith("/payments"),
    title: "Money stalls for boring reasons",
    body: "Most payment failures are name or account mismatches, not rejections. Disha names the mismatch instead of showing a generic pending state.",
    action: "See what is blocking payment and who can fix it.",
    href: "/renewal"
  },
  {
    id: "renewal",
    stage: "Renewal",
    match: (pathname) => pathname.startsWith("/renewal"),
    title: "Next year should not start from zero",
    body: "Evidence already verified carries forward. Only the genuinely new documents are asked for again.",
    action: "That is the full journey. You can exit the sample any time.",
    href: undefined
  }
];

export function walkthroughStepForPath(pathname: string) {
  const index = walkthroughSteps.findIndex((step) => step.match(pathname));
  return index === -1 ? null : { step: walkthroughSteps[index], index };
}

export const walkthroughLength = walkthroughSteps.length;
