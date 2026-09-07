import type { DishaContext } from "@/lib/dishaContext";

export type AssistantResponse = {
  answer: string;
  supportingEvidence: string[];
  suggestedNextAction: string;
  actionId?: string;
  speechResponse?: string;
  mode: "deterministic";
};

export function answerFromDishaContext(message: string, context: DishaContext): AssistantResponse {
  const normalized = message.toLowerCase();
  const assessment = context.assessmentResult;
  const opportunityName = context.activeOpportunity?.name ?? context.canonicalApplication.title;
  const biggestGap = assessment?.gaps[0];
  const incomeEvidence = context.evidencePassport.records.find((record) => record.id === "income-certificate");
  const academicEvidence = context.evidencePassport.records.find((record) => record.id === "academic-record");
  const enrolmentEvidence = context.evidencePassport.records.find((record) => record.id === "institution-enrolment");

  if (context.mode === "normal" && context.journeyStage === "Discover") {
    return response(
      "Start with a quick assessment. Add your basics, choose an opportunity, and confirm a few evidence items; then I can tell you what looks strong and what to improve first.",
      [],
      "Open Assess an opportunity and generate your first assessment.",
      "start-normal-assessment"
    );
  }

  if (context.journeyStage === "Payment") {
    if (context.paymentState === "revalidating") {
      return response(
        `Good news: the blocker is fixed. ${context.currentOwner} now ${ownerVerb(context.currentOwner)} the next step. You do not need to do anything else right now.`,
        [context.ownership.evidence, context.requiredAction],
        "Wait for PFMS and bank revalidation.",
        "track-payment",
        "The blocker is corrected. PFMS and the bank now own revalidation."
      );
    }
    return response(
      `Your payment is paused because the beneficiary name does not match the bank record. Fix that name once, then it can go back to PFMS and the bank for validation.`,
      [context.ownership.evidence, context.blocker ?? "Beneficiary name consistency is required before payment validation."],
      "Correct the beneficiary name and resubmit for validation.",
      "fix-payment",
      "Payment is blocked by a beneficiary name mismatch. Correct it, then PFMS can continue."
    );
  }

  if (context.journeyStage === "Verification") {
    return response(
      `${context.currentOwner} has the application right now. You do not need to do anything unless they return it for correction.`,
      [context.ownership.evidence, context.ownership.summary],
      context.requiredAction,
      "track-verification",
      `${context.currentOwner} owns the current step. ${context.requiredAction}`
    );
  }

  if (context.journeyStage === "Renewal") {
    return response(
      `No, you do not need to start again. You can reuse most of the previous packet; the main update is the latest marksheet.`,
      context.evidencePassport.records.filter((record) => ["legal-name", "institution-enrolment", "bank-account", "academic-record"].includes(record.id)).map(formatEvidence),
      "Upload the latest marksheet, then submit the renewal for institution verification.",
      "prepare-renewal",
      "You can reuse most evidence. Add the latest marksheet for renewal."
    );
  }

  if (normalized.includes("improve") || normalized.includes("first") || normalized.includes("missing") || normalized.includes("document") || normalized.includes("stopping")) {
    return response(
      `Start with the income proof. It is the one fixable document issue that could block submission, even if the rest of the profile looks good.`,
      [incomeEvidence ? formatEvidence(incomeEvidence) : biggestGap?.missing ?? "Income proof needs attention.", academicEvidence ? formatEvidence(academicEvidence) : ""].filter(Boolean),
      biggestGap?.action ?? "Refresh the income certificate before final submission.",
      "refresh-income-proof",
      "Refresh the income proof first. The issue is readiness, not academic fit."
    );
  }

  if (normalized.includes("evidence") || normalized.includes("using") || normalized.includes("why")) {
    return response(
      `The short version: your academic and institution evidence look solid, and the income amount appears within the limit. Readiness is only moderate because the income certificate itself needs refreshing.`,
      [enrolmentEvidence, academicEvidence, incomeEvidence].filter(Boolean).map((record) => formatEvidence(record!)),
      "Refresh the income certificate, then submit with the current enrolment and marksheet evidence attached.",
      "review-evidence",
      "Disha found strong academic and institution evidence, but the income certificate needs refreshing."
    );
  }

  if (normalized.includes("apply") || normalized.includes("worth") || normalized.includes("should")) {
    return response(
      `Yes, this looks worth pursuing. Your profile appears to match the core conditions, but I would refresh the income certificate before you submit.`,
      [assessment?.eligibility.summary ?? "Core eligibility appears aligned.", assessment?.fit.summary ?? "Profile fit appears strong.", incomeEvidence ? formatEvidence(incomeEvidence) : ""].filter(Boolean),
      "Refresh the income certificate before final submission.",
      "start-preparation",
      "Yes, this is worth pursuing. Refresh the income certificate before submitting."
    );
  }

  return response(
    `${opportunityName} looks like ${assessment?.recommendation?.toLowerCase() ?? "a useful next review"}. The next useful step is simple: ${biggestGap?.action ?? context.nextStep}`,
    [context.ownership.evidence, ...(assessment?.evidenceBasis.slice(0, 2) ?? [])],
    biggestGap?.action ?? context.nextStep,
    "next-step"
  );
}

function response(answer: string, supportingEvidence: string[], suggestedNextAction: string, actionId?: string, speechResponse?: string): AssistantResponse {
  return {
    answer,
    supportingEvidence: supportingEvidence.filter(Boolean),
    suggestedNextAction,
    actionId,
    speechResponse,
    mode: "deterministic"
  };
}

function formatEvidence(record: { label: string; value: string; status: string; freshness: string; note: string }) {
  return `${record.label}: ${record.value} (${record.status}; ${record.freshness}). ${record.note}`;
}

function ownerVerb(owner: string) {
  return owner.toLowerCase().includes(" and ") || owner.toLowerCase().includes("/") ? "own" : "owns";
}
