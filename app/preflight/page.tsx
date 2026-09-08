"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, Sparkles } from "lucide-react";
import { InstitutionStatus } from "@/components/InstitutionStatus";
import { PageHeader } from "@/components/PageHeader";
import { BlockerCard } from "@/components/BlockerCard";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { translations } from "@/lib/i18n";
import { canonicalGuidedDemoOpportunityId, getGuidedDemoApplication, institution } from "@/lib/data";
import { initialBlockerStatus, isBlocking, needsApplicantAction, type BlockerDefinition, type BlockerStatus } from "@/lib/blockers";
import { buildOpportunityAssessmentResult, getOpportunity, sampleAssessmentResponses } from "@/lib/opportunities";

export default function PreflightPage() {
  const { guidedDemoActive, guidedDemoOpportunityId, setDemoState, setAssistantOpen, language } = useAppState();
  const t = translations[language].prepare;
  const guidedApplication = getGuidedDemoApplication(guidedDemoOpportunityId);
  const opportunity =
    getOpportunity(guidedApplication?.opportunityId ?? canonicalGuidedDemoOpportunityId) ?? getOpportunity(canonicalGuidedDemoOpportunityId);
  const assessment = useMemo(
    () => (opportunity ? buildOpportunityAssessmentResult(opportunity, sampleAssessmentResponses[opportunity.id] ?? {}) : null),
    [opportunity]
  );

  const definitions = useMemo<BlockerDefinition[]>(() => buildBlockerDefinitions(assessment, language), [assessment, language]);
  const [statuses, setStatuses] = useState<Record<string, BlockerStatus>>(() =>
    Object.fromEntries(definitions.map((definition) => [definition.id, initialBlockerStatus]))
  );

  useEffect(() => {
    if (guidedDemoActive) setDemoState("prepare");
  }, [guidedDemoActive, setDemoState]);

  const statusFor = (id: string) => statuses[id] ?? initialBlockerStatus;
  const outstanding = definitions.filter((definition) => isBlocking(statusFor(definition.id)));
  const yours = outstanding.filter((definition) => needsApplicantAction(statusFor(definition.id)));
  const waiting = outstanding.filter((definition) => !needsApplicantAction(statusFor(definition.id)));
  const readyToApply = yours.length === 0 && waiting.length === 0;

  const ready =
    language === "hi"
      ? ["आधार सत्यापित", "बैंक विवरण पूर्ण", "शैक्षणिक रिकॉर्ड उपलब्ध", "संस्थान द्वारा नामांकन की पुष्टि", "पात्रता उत्तीर्ण"]
      : [
          "Aadhaar verified",
          "Bank details complete",
          "Academic record on file",
          "Enrolment confirmed by your institution",
          `${opportunity?.category ?? "Scheme"} eligibility passed`
        ];

  return (
    <div>
      <PageHeader title={guidedDemoActive ? `${opportunity?.name ?? ""}: ${t.title}` : t.genericTitle}>
        {t.intro}
      </PageHeader>

      <section className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile label={t.ready} value={`${ready.length} ${t.items}`} tone="success" body="" />
        <SummaryTile
          label={t.missing}
          value={`${outstanding.length} ${t.items}`}
          tone={outstanding.length ? "warning" : "success"}
          body={outstanding.length ? "Still blocking submission." : "Nothing outstanding."}
        />
        <SummaryTile
          label={t.yourActions}
          value={`${yours.length} ${t.actions}`}
          tone={yours.length ? "warning" : "success"}
          body={yours.length ? "These are yours to resolve." : "No action needed from you right now."}
        />
        <SummaryTile
          label={t.waiting}
          value={`${waiting.length} ${t.items}`}
          tone={waiting.length ? "active" : "neutral"}
          body={waiting.length ? "With a reviewer. Nothing for you to do." : "Nothing with a reviewer."}
        />
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-stone-200">
          <p className="text-xs font-black uppercase tracking-wide text-muted">{t.canSubmit}</p>
          <h2 className="mt-2 font-serif text-2xl font-black leading-tight text-ink">
            {readyToApply
              ? "Yes. Everything on your side is done."
              : yours.length
                ? `Not yet. ${yours.length} item${yours.length === 1 ? "" : "s"} need${yours.length === 1 ? "s" : ""} you.`
                : "Not yet. Everything is with a reviewer."}
          </h2>
          <p className="mt-3 text-sm leading-6 text-muted">
            {readyToApply
              ? "Blockers were provided and accepted, so the application can be started."
              : yours.length
                ? "Provide the evidence each blocker names. It then goes to whoever owns the check."
                : "You do not need to do anything while these sit with a reviewer."}
          </p>
          <div className="mt-5 flex flex-wrap gap-3">
            {readyToApply ? (
              <Link
                href="/apply"
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
              >
                {t.startApplication}
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center rounded-md bg-stone-200 px-4 py-2 text-sm font-bold text-stone-500">
                {t.startApplication}
              </span>
            )}
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-primary ring-1 ring-stone-200 transition hover:bg-[#EEF2FF]"
            >
              <Sparkles size={16} aria-hidden="true" />
              {t.askDisha}
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-lg font-black text-ink">{t.ready}</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {ready.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm leading-6 text-slate-700">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
          <p className="mt-4 border-t border-stone-100 pt-3 text-sm leading-6 text-muted">
            {institution.cell} still owns verification after submission, whatever you finish here.
          </p>
        </div>
      </section>

      <h2 className="mb-3 text-lg font-black text-ink">
        {t.missing} ({outstanding.length})
      </h2>
      <div className="grid gap-5 lg:grid-cols-2">
        {definitions.map((definition) => (
          <BlockerCard
            key={definition.id}
            definition={definition}
            status={statusFor(definition.id)}
            onChange={(status) => setStatuses((current) => ({ ...current, [definition.id]: status }))}
          />
        ))}
      </div>

      <div className="mt-8">
        <InstitutionStatus mode="compact" />
      </div>
    </div>
  );
}

function SummaryTile({
  label,
  value,
  tone,
  body
}: {
  label: string;
  value: string;
  tone: "success" | "warning" | "active" | "neutral";
  body: string;
}) {
  const { language } = useAppState();
  const labels = translations[language].prepare;
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <p className="text-xs font-black uppercase tracking-wide text-muted">{label}</p>
      <p className={clsx("mt-2 text-xl font-black", tone === "success" ? "text-emerald-700" : tone === "warning" ? "text-amber-800" : tone === "active" ? "text-primary" : "text-muted")}>
        {value}
      </p>
      {body ? <p className="mt-1 text-xs leading-5 text-muted">{body}</p> : null}
      <div className="mt-2">
        <StatusBadge tone={tone}>{tone === "success" ? labels.clear : tone === "warning" ? labels.needsYou : tone === "active" ? labels.withReviewer : labels.none}</StatusBadge>
      </div>
    </article>
  );
}

/**
 * The blockers shown on Prepare. Titles and rationale come from the canonical assessment's gaps
 * where it has them, so this page cannot describe a different problem from the assessment page.
 */
function buildBlockerDefinitions(
  assessment: ReturnType<typeof buildOpportunityAssessmentResult> | null,
  language: "en" | "hi"
): BlockerDefinition[] {
  const gap = (index: number) => assessment?.gaps[index];
  const hi = language === "hi";

  return [
    {
      id: "income-certificate",
      title: hi ? "मौजूदा आय प्रमाणपत्र" : "Current income certificate",
      severity: "Required",
      whyItMatters: hi
        ? "सत्यापन अक्सर जमा करने के हफ़्तों बाद होता है। बीच में समाप्त होने वाला प्रमाणपत्र आवेदन वापस करा देता है।"
        : gap(0)?.suggestion ??
          "Verification often happens weeks after submission. A certificate that expires in between gets the application returned.",
      evidencePrompt: hi ? "आप कौन सा आय प्रमाणपत्र दे सकती हैं?" : "Which income certificate can you provide?",
      evidenceOptions: hi
        ? ["इस वर्ष जारी", "पिछले वर्ष जारी", "आवेदन किया है, अभी जारी नहीं"]
        : ["Issued this year", "Issued last year", "Applied for, not yet issued"],
      owner: hi ? "आप" : "You",
      reviewer: institution.cell,
      reviewCheck: hi
        ? "वे जारी होने की तिथि को योजना की वैधता अवधि से मिलाते हैं।"
        : "They check the issue date against the scheme's validity window."
    },
    {
      id: "name-match",
      title: hi ? "कानूनी नाम बैंक रिकॉर्ड से मेल खाता है" : "Legal name matches the bank record",
      severity: "Required",
      whyItMatters: hi
        ? "नाम की असंगति सबसे आम कारण है कि स्वीकृत छात्रवृत्ति खाते तक नहीं पहुँचती।"
        : gap(1)?.suggestion ??
          "A name mismatch is the most common reason an approved scholarship never reaches the account.",
      evidencePrompt: hi ? "बैंक रिकॉर्ड में आपका नाम कैसे दर्ज है?" : "How does your name appear on the bank record?",
      evidenceOptions: hi
        ? ["आधार के अनुसार बिल्कुल वैसा ही", "आद्याक्षर भिन्न हैं", "उपनाम का क्रम भिन्न है"]
        : ["Exactly as on Aadhaar", "Initials differ", "Surname order differs"],
      owner: hi ? "आप" : "You",
      reviewer: hi ? "बैंक रिकॉर्ड जाँच" : "Bank record check",
      reviewCheck: hi
        ? "खाते के नाम की तुलना आपकी पहचान के नाम से की जाती है।"
        : "The account name is compared with the name on your identity record."
    }
  ];
}
