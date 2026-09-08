"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, ClipboardCheck, Compass, CreditCard, FileSearch, FileUp, Map, RotateCw } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { ananyaEvidencePassport, getApplicationOwnership, getCanonicalApplicationForDemoState, institution, journey, stageForDemoState, type Stage } from "@/lib/data";

const icons = {
  Discover: Compass,
  Assess: FileSearch,
  Prepare: FileUp,
  Apply: ClipboardCheck,
  Verification: Map,
  Payment: CreditCard,
  Renewal: RotateCw
} as const;

const copy: Record<Stage, { body: string; href: string }> = {
  Discover: { body: "Shortlist opportunities and decide where time is worth spending.", href: "/demo" },
  Assess: { body: "Map programme requirements to profile evidence before asking for corrections.", href: "/opportunities/aicte-pragati-scholarship/assess" },
  Prepare: { body: "Fix stale or missing evidence before submission.", href: "/preflight" },
  Apply: { body: "Submit the packet once profile, bank and document fields are aligned.", href: "/apply" },
  Verification: { body: "Track who owns progress and whether Ananya needs to act.", href: "/applications/pragati-readiness-2026" },
  Payment: { body: "Catch PFMS or bank blockers and hand corrected data to the right owner.", href: "/payments/pragati-payment-2026" },
  Renewal: { body: "Reuse carried-forward evidence and update year-specific proof.", href: "/renewal" }
};

export default function MyPathPage() {
  const { demoState, guidedDemoActive, normalAssessment } = useAppState();
  const normalResult = normalAssessment.assessmentResult;
  const activeStage = stageForDemoState(demoState);
  const activeIndex = journey.indexOf(activeStage);
  const canonicalApplication = getCanonicalApplicationForDemoState(demoState);
  const ownership = getApplicationOwnership(canonicalApplication);
  const carriedEvidence = ananyaEvidencePassport.records.filter((record) => ["legal-name", "institution-enrolment", "academic-record", "bank-account"].includes(record.id));

  if (!guidedDemoActive) {
    return (
      <div className="mx-auto max-w-4xl">
        <PageHeader eyebrow="My Path" title="Your path starts with an assessment">
          Disha will build a journey once you choose an opportunity and add a few evidence items.
        </PageHeader>
        <section className="rounded-lg bg-white p-7 shadow-sm ring-1 ring-stone-200">
          <StatusBadge tone={normalResult ? "active" : "neutral"}>{normalResult ? "Assessment complete" : "Not started"}</StatusBadge>
          <h2 className="mt-4 font-serif text-3xl font-bold text-ink">
            {normalResult ? `${normalResult.recommendationLabel}: ${normalResult.opportunityName}` : "No demo journey is loaded."}
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
            {normalResult
              ? normalResult.nextAction
              : "Use normal mode for your own inputs, or choose Try the demo from the homepage to see the complete sample journey."}
          </p>
          <Link href="/assess" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white">
            Open assessment
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow="My Path" title="Ananya's AICTE Pragati pathway">
        One lifecycle from discovery to renewal, with evidence and ownership carried forward.
      </PageHeader>

      <section className="grid gap-4 lg:grid-cols-7">
        {journey.map((stage, index) => {
          const Icon = icons[stage];
          const state = index < activeIndex ? "Done" : index === activeIndex ? "Active" : index === activeIndex + 1 ? "Next" : "Available";
          return (
            <Link key={stage} href={copy[stage].href} className="group rounded-lg bg-white p-4 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex items-center justify-between gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-md bg-[#F7E8DC] text-[#8F5139]">
                  <Icon size={20} />
                </span>
                <StatusBadge tone={state === "Done" ? "success" : state === "Active" ? "active" : "neutral"}>{state}</StatusBadge>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-normal text-muted">Step {index + 1}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold text-ink">{stage}</h2>
              <p className="mt-2 min-h-24 text-sm leading-6 text-slate-700">{copy[stage].body}</p>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Open
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>

      <section className="mt-7 grid gap-5 lg:grid-cols-[0.58fr_0.42fr]">
        <article className="rounded-lg bg-[#FBF3EA] p-6 ring-1 ring-stone-200">
          <h2 className="font-serif text-2xl font-bold text-ink">Evidence carried forward</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Reusable proof Disha can apply across assessment, submission, payment and renewal.</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {carriedEvidence.map((record) => (
              <p key={record.id} className="flex gap-2 rounded-md bg-white p-3 text-sm font-semibold leading-6 text-slate-700 shadow-sm">
                <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-emerald-700" />
                {record.label}: {record.value}
              </p>
            ))}
          </div>
        </article>

        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Current ownership</p>
          <h2 className="mt-2 font-serif text-2xl font-bold text-ink">{canonicalApplication.status}</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-muted">Current owner</dt>
              <dd className="mt-1 text-lg font-bold text-ink">{ownership.currentOwner}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Action</dt>
              <dd className="mt-1 leading-6 text-slate-700">{ownership.applicantAction}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Institution</dt>
              <dd className="mt-1 leading-6 text-slate-700">{institution.name}</dd>
            </div>
          </dl>
        </article>
      </section>
    </div>
  );
}
