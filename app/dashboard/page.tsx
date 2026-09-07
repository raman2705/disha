"use client";

import Link from "next/link";
import { ArrowRight, CalendarClock, FileWarning, Hourglass, Search, WalletCards } from "lucide-react";
import { OwnershipRail } from "@/components/OwnershipRail";
import { PrimaryLink } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { canonicalGuidedDemoOpportunityId, demoApplications, getApplicationOwnership, getCanonicalApplicationForDemoState, profile } from "@/lib/data";
import { useAppState } from "@/components/AppContext";

export default function Dashboard() {
  const { demoState } = useAppState();
  const activeApplication = getCanonicalApplicationForDemoState(demoState, canonicalGuidedDemoOpportunityId);
  const activeOwnership = activeApplication ? getApplicationOwnership(activeApplication) : null;
  const scholarshipApplications = [
    activeApplication,
    ...demoApplications.filter((application) => application.category === "Scholarship" && application.opportunityId !== canonicalGuidedDemoOpportunityId)
  ];

  return (
    <div className="space-y-9">
      <section className="overflow-hidden rounded-[1.1rem] bg-white p-7 shadow-soft sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold text-accent">Good afternoon, {profile.name.split(" ")[0]}</p>
            <p className="mt-6 text-sm font-semibold text-muted">Academic year 2026-27</p>
            <h1 className="mt-2 max-w-md text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl">
              {activeApplication?.title ?? "AICTE Pragati Scholarship"}
            </h1>
            <div className="mt-6 flex flex-wrap items-end gap-4">
              <div>
                <p className="mt-1 text-4xl font-bold text-ink">{activeApplication?.benefit ?? "Rs 50,000/year"}</p>
                <p className="text-sm font-semibold text-muted">Scholarship amount</p>
              </div>
              <StatusBadge tone="active">{activeOwnership?.label ?? "Waiting on institution"}</StatusBadge>
            </div>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              {activeOwnership?.summary ?? "Your application is complete. Your institution is reviewing your enrolment and documents."}
            </p>
            <p className="mt-4 text-lg font-bold text-ink">{activeOwnership?.applicantAction ?? "Nothing required from you right now."}</p>
            <Link href="/applications/pragati-readiness-2026" className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
              Track verification <ArrowRight size={16} />
            </Link>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Current owner</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{activeOwnership?.currentOwner ?? "Institution"}</h2>
              <p className="mt-1 text-sm font-semibold text-primary">{activeOwnership?.status ?? "Institute verification"}</p>
            </div>
            {activeOwnership ? <OwnershipRail items={activeOwnership.rail} evidence={activeOwnership.evidence} /> : null}
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        <article className="rounded-[1rem] bg-[#FFF3DD] p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-amber-800">
              <FileWarning size={21} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Needs you</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Income certificate expires soon</h2>
              <p className="mt-2 max-w-lg text-sm leading-6 text-muted">
                Replacing it now can prevent a return request if verification happens after the deadline.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <PrimaryLink href="/preflight">Review readiness</PrimaryLink>
                <span className="text-sm font-semibold text-amber-900">Student-owned task</span>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-[1rem] bg-[#EEF2FF] p-6 shadow-sm">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-primary">
              <Hourglass size={21} />
            </span>
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Waiting on others</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{activeOwnership?.currentOwner ?? "Institution"}</h2>
              <p className="mt-2 font-semibold text-primary">Scholarship verification pending</p>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
                Waiting for 3 days. Disha will surface a student action only if the application is returned.
              </p>
              <div className="mt-5">
                <PrimaryLink href="/applications/pragati-readiness-2026">Open verification</PrimaryLink>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
        <article className="rounded-[1rem] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <CalendarClock className="text-accent" size={22} />
            <h2 className="text-xl font-bold text-ink">Upcoming</h2>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-semibold text-muted">Application deadline</p>
              <p className="mt-1 text-2xl font-bold text-ink">31 October</p>
              <p className="mt-2 text-sm leading-6 text-muted">Keep documents current before institution verification closes.</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-muted">Next academic year</p>
              <p className="mt-1 text-2xl font-bold text-ink">Renewal opens 2027</p>
              <p className="mt-2 text-sm leading-6 text-muted">Latest marksheet and institution renewal verification will be required.</p>
            </div>
          </div>
        </article>

        <article className="rounded-[1rem] bg-white p-6 shadow-sm">
          <div className="flex items-center gap-3">
            <WalletCards className="text-primary" size={22} />
            <h2 className="text-xl font-bold text-ink">Payment readiness</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-muted">
            Payment begins only after scheme approval. Disha will track PFMS and bank validation once the scholarship is sanctioned.
          </p>
          <Link href="/payments/pragati-payment-2026" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">
            See payment tracker <ArrowRight size={16} />
          </Link>
        </article>
      </section>

      <section className="overflow-hidden rounded-[1rem] bg-white shadow-sm">
        <div className="border-b border-stone-100 p-6">
          <h2 className="text-2xl font-bold text-ink">Your scholarships</h2>
          <p className="mt-1 text-sm text-muted">Active, payment, and renewal states in one place.</p>
        </div>
        {scholarshipApplications.map((application) => {
          const ownership = getApplicationOwnership(application);
          return (
            <Link key={application.id} href={application.href} className="grid gap-3 border-b border-stone-100 p-5 transition last:border-b-0 hover:bg-[#FBF7F1] md:grid-cols-[1fr_0.8fr_0.8fr_auto] md:items-center">
              <div>
                <p className="font-bold text-ink">{application.title}</p>
                <p className="mt-1 text-sm text-muted">{application.canonicalStage}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-muted">Status</p>
                <p className="mt-1 text-sm font-semibold text-ink">{ownership.status}</p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-normal text-muted">Current owner</p>
                <p className="mt-1 text-sm font-semibold text-ink">{ownership.currentOwner}</p>
              </div>
              <ArrowRight className="text-primary" size={18} />
            </Link>
          );
        })}
      </section>

      <section className="rounded-[1rem] bg-[#EEF2FF] p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-3">
              <Search className="text-primary" size={21} />
              <h2 className="text-xl font-bold text-ink">Looking for another scholarship?</h2>
            </div>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-muted">
              Discovery stays available, with eligibility evidence and criteria shown before you apply.
            </p>
          </div>
          <PrimaryLink href="/scholarships">Browse scholarships</PrimaryLink>
        </div>
      </section>
    </div>
  );
}
