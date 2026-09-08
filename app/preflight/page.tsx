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
import { canonicalGuidedDemoOpportunityId, getGuidedDemoApplication, institution } from "@/lib/data";
import { initialBlockerStatus, isBlocking, needsApplicantAction, type BlockerDefinition, type BlockerStatus } from "@/lib/blockers";
import { buildOpportunityAssessmentResult, getOpportunity, sampleAssessmentResponses } from "@/lib/opportunities";

export default function PreflightPage() {
  const { guidedDemoActive, guidedDemoOpportunityId, setDemoState, setAssistantOpen } = useAppState();
  const guidedApplication = getGuidedDemoApplication(guidedDemoOpportunityId);
  const opportunity =
    getOpportunity(guidedApplication?.opportunityId ?? canonicalGuidedDemoOpportunityId) ?? getOpportunity(canonicalGuidedDemoOpportunityId);
  const assessment = useMemo(
    () => (opportunity ? buildOpportunityAssessmentResult(opportunity, sampleAssessmentResponses[opportunity.id] ?? {}) : null),
    [opportunity]
  );

  const definitions = useMemo<BlockerDefinition[]>(() => buildBlockerDefinitions(assessment), [assessment]);
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

  const ready = [
    "Aadhaar verified",
    "Bank details complete",
    "Academic record on file",
    "Enrolment confirmed by your institution",
    `${opportunity?.category ?? "Scheme"} eligibility passed`
  ];

  return (
    <div>
      <PageHeader title={guidedDemoActive ? `${opportunity?.name ?? "Selected opportunity"}: prepare before you apply` : "Check before you apply"}>
        Four questions, answered on one page: what is ready, what is missing, what you need to do, and what Disha can
        help with.
      </PageHeader>

      <section className="mb-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SummaryTile label="What is ready" value={`${ready.length} items`} tone="success" body="Already on file and accepted." />
        <SummaryTile
          label="What is missing"
          value={`${outstanding.length} item${outstanding.length === 1 ? "" : "s"}`}
          tone={outstanding.length ? "warning" : "success"}
          body={outstanding.length ? "Still blocking submission." : "Nothing outstanding."}
        />
        <SummaryTile
          label="What you need to do"
          value={`${yours.length} action${yours.length === 1 ? "" : "s"}`}
          tone={yours.length ? "warning" : "success"}
          body={yours.length ? "These are yours to resolve." : "No action needed from you right now."}
        />
        <SummaryTile
          label="Waiting on others"
          value={`${waiting.length} item${waiting.length === 1 ? "" : "s"}`}
          tone={waiting.length ? "active" : "neutral"}
          body={waiting.length ? "With a reviewer. Nothing for you to do." : "Nothing with a reviewer."}
        />
      </section>

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-stone-200">
          <p className="text-xs font-black uppercase tracking-wide text-muted">Can you submit?</p>
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
                Start application
                <ArrowRight size={17} aria-hidden="true" />
              </Link>
            ) : (
              <span className="inline-flex min-h-11 items-center rounded-md bg-stone-200 px-4 py-2 text-sm font-bold text-stone-500">
                Start application
              </span>
            )}
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-primary ring-1 ring-stone-200 transition hover:bg-[#EEF2FF]"
            >
              <Sparkles size={16} aria-hidden="true" />
              What can Disha help with?
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-lg font-black text-ink">What is ready</h2>
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
        {outstanding.length ? `What is missing (${outstanding.length})` : "Nothing is missing"}
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
  return (
    <article className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
      <p className="text-xs font-black uppercase tracking-wide text-muted">{label}</p>
      <p className={clsx("mt-2 text-xl font-black", tone === "success" ? "text-emerald-700" : tone === "warning" ? "text-amber-800" : tone === "active" ? "text-primary" : "text-muted")}>
        {value}
      </p>
      <p className="mt-1 text-xs leading-5 text-muted">{body}</p>
      <div className="mt-2">
        <StatusBadge tone={tone}>{tone === "success" ? "Clear" : tone === "warning" ? "Needs you" : tone === "active" ? "With reviewer" : "None"}</StatusBadge>
      </div>
    </article>
  );
}

/**
 * The blockers shown on Prepare. Titles and rationale come from the canonical assessment's gaps
 * where it has them, so this page cannot describe a different problem from the assessment page.
 */
function buildBlockerDefinitions(assessment: ReturnType<typeof buildOpportunityAssessmentResult> | null): BlockerDefinition[] {
  const gap = (index: number) => assessment?.gaps[index];

  return [
    {
      id: "income-certificate",
      title: "Current income certificate",
      severity: "Required",
      whyItMatters:
        gap(0)?.suggestion ??
        "Verification often happens weeks after submission. A certificate that expires in between gets the application returned.",
      evidencePrompt: "Which income certificate can you provide?",
      evidenceOptions: ["Issued this year", "Issued last year", "Applied for, not yet issued"],
      owner: "You",
      reviewer: institution.cell,
      reviewCheck: "They check the issue date against the scheme's validity window."
    },
    {
      id: "name-match",
      title: "Legal name matches the bank record",
      severity: "Required",
      whyItMatters:
        gap(1)?.suggestion ??
        "A name mismatch is the most common reason an approved scholarship never reaches the account.",
      evidencePrompt: "How does your name appear on the bank record?",
      evidenceOptions: ["Exactly as on Aadhaar", "Initials differ", "Surname order differs"],
      owner: "You",
      reviewer: "Bank record check",
      reviewCheck: "The account name is compared with the name on your identity record."
    }
  ];
}
