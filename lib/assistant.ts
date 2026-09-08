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
  const opportunityName = context.activeOpportunity?.name ?? (context.mode === "demo" ? context.canonicalApplication.title : "this opportunity");
  const biggestGap = assessment?.gaps[0];
  const incomeEvidence = context.evidencePassport.records.find((record) => record.id === "income-certificate");
  const academicEvidence = context.evidencePassport.records.find((record) => record.id === "academic-record");
  const enrolmentEvidence = context.evidencePassport.records.find((record) => record.id === "institution-enrolment");

  if (context.mode === "normal" && context.journeyStage === "Discover") {
    return response(
      "Hi. I can help you assess an opportunity, understand what evidence matters, or figure out what to improve. Start by generating an assessment so I have one source of truth to read from.",
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

  if (context.journeyStage === "Assess" && assessment && isAssessmentQuestion(normalized)) {
    return responseFromAssessment(normalized, assessment, opportunityName);
  }

  if (normalized.includes("improve") || normalized.includes("first") || normalized.includes("missing") || normalized.includes("document") || normalized.includes("stopping")) {
    return response(
      `Start with the income proof. It is the one fixable document issue that could block submission, even if the rest of the profile looks good.`,
      [incomeEvidence ? formatEvidence(incomeEvidence) : biggestGap?.suggestion ?? "Income proof needs attention.", academicEvidence ? formatEvidence(academicEvidence) : ""].filter(Boolean),
      biggestGap?.suggestion ?? "Refresh the income certificate before final submission.",
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
      [assessment ? eligibilityEvidenceLine(assessment) : "Core eligibility appears aligned.", assessment ? competitivenessEvidenceLine(assessment) : "Profile fit appears strong.", incomeEvidence ? formatEvidence(incomeEvidence) : ""].filter(Boolean),
      "Refresh the income certificate before final submission.",
      "start-preparation",
      "Yes, this is worth pursuing. Refresh the income certificate before submitting."
    );
  }

  return response(
    `${opportunityName} looks like ${assessment?.recommendationLabel.toLowerCase() ?? "a useful next review"}. The next useful step is simple: ${biggestGap?.suggestion ?? context.nextStep}`,
    [context.ownership.evidence, ...(assessment?.strengths.slice(0, 2) ?? [])],
    biggestGap?.suggestion ?? context.nextStep,
    "next-step"
  );
}

function isAssessmentQuestion(normalized: string) {
  return [
    "apply",
    "worth",
    "should",
    "fit",
    "eligible",
    "eligibility",
    "improve",
    "first",
    "readiness",
    "moderate",
    "evidence",
    "using",
    "why"
  ].some((term) => normalized.includes(term));
}

function responseFromAssessment(normalized: string, assessment: NonNullable<DishaContext["assessmentResult"]>, opportunityName: string): AssistantResponse {
  const gap = assessment.biggestGap;
  const evidence = [
    `Recommendation: ${assessment.recommendationLabel}.`,
    eligibilityEvidenceLine(assessment),
    competitivenessEvidenceLine(assessment),
    `Confidence: ${assessment.confidence.level}. ${assessment.confidence.explanation}`,
    `Strongest evidence: ${assessment.strongestEvidence}.`,
    gap ? `Biggest gap: ${gap.criterion}. ${gap.summary}` : ""
  ].filter(Boolean);

  if (normalized.includes("improve") || normalized.includes("first") || normalized.includes("readiness") || normalized.includes("moderate") || normalized.includes("missing")) {
    return response(
      gap
        ? `The saved assessment says to work on ${gap.criterion.toLowerCase()} first. ${assessment.nextAction}`
        : `The saved assessment does not show a major gap. ${assessment.nextAction}`,
      evidence,
      assessment.nextAction,
      "assessment-next-action",
      assessment.nextAction
    );
  }

  if (normalized.includes("evidence") || normalized.includes("using") || normalized.includes("why")) {
    return response(
      gap
        ? `I am reading the saved assessment. The strongest evidence is ${assessment.strongestEvidence}. The biggest gap is ${gap.criterion.toLowerCase()}, which matters because ${gap.whyItMatters}`
        : `I am reading the saved assessment. The strongest evidence is ${assessment.strongestEvidence}, and no major gap is currently flagged.`,
      evidence,
      assessment.nextAction,
      "assessment-evidence",
      `The saved assessment points to ${assessment.strongestEvidence}. ${assessment.nextAction}`
    );
  }

  return response(
    recommendationAnswer(assessment, opportunityName),
    evidence,
    assessment.nextAction,
    "assessment-recommendation",
    `${assessment.recommendationLabel}. ${assessment.nextAction}`
  );
}

function recommendationAnswer(assessment: NonNullable<DishaContext["assessmentResult"]>, opportunityName: string) {
  if (assessment.recommendation.verdict === "do_not_apply") {
    return `No. The saved assessment says not to apply for ${opportunityName} because formal eligibility failed. ${assessment.nextAction}`;
  }
  if (assessment.recommendation.verdict === "verify_eligibility") {
    return `Verify eligibility first. The saved assessment has at least one unknown hard requirement for ${opportunityName}. ${assessment.nextAction}`;
  }
  if (assessment.recommendation.verdict === "insufficient_information") {
    return `Disha cannot estimate competitive fit reliably yet. ${assessment.nextAction}`;
  }
  if (assessment.recommendationKey === "strongly_pursue") {
    return `Yes. The saved assessment says ${opportunityName} is a strong next application. ${assessment.nextAction}`;
  }
  if (assessment.recommendationKey === "worth_pursuing") {
    return `Yes. The saved assessment says ${opportunityName} is worth pursuing. ${assessment.nextAction}`;
  }
  if (assessment.recommendationKey === "pursue_after_improving") {
    return `The saved assessment says to pursue ${opportunityName} after improving the key gap. ${assessment.nextAction}`;
  }
  if (assessment.recommendationKey === "low_priority") {
    return `The saved assessment says ${opportunityName} is low priority for now because the evidence is not strong enough yet. ${assessment.nextAction}`;
  }
  return `The saved assessment says ${opportunityName} is not currently worth the effort. ${assessment.nextAction}`;
}

function eligibilityEvidenceLine(assessment: NonNullable<DishaContext["assessmentResult"]>) {
  const passes = assessment.eligibility.conditions.filter((condition) => condition.result === "pass").length;
  if (assessment.eligibility.status === "ineligible") return `Eligibility: ineligible. Blocker: ${assessment.eligibility.blockers.join(", ")}.`;
  if (assessment.eligibility.status === "uncertain") return `Eligibility: uncertain. ${passes} requirements pass; more information is needed.`;
  return `Eligibility: eligible. ${passes} of ${assessment.eligibility.conditions.length} hard requirements pass.`;
}

function competitivenessEvidenceLine(assessment: NonNullable<DishaContext["assessmentResult"]>) {
  if (assessment.competitiveness.score === null) {
    return `Competitive fit: not scored. Usable evidence covers ${assessment.competitiveness.assessedWeightPercent}% of known selection weight.`;
  }
  return `Competitive fit: ${assessment.competitiveness.score}/100, ${assessment.competitiveness.band}.`;
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
