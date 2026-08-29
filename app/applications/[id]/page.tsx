"use client";

import { useState } from "react";
import { Eye, HelpCircle } from "lucide-react";
import { InstitutionStatus } from "@/components/InstitutionStatus";
import { OwnershipRail } from "@/components/OwnershipRail";
import { StatusBadge } from "@/components/StatusBadge";
import { applicationId, institution } from "@/lib/data";

const waitingRail = [
  { actor: "Student", state: "completed" as const, detail: "Done" },
  { actor: "ABC College", state: "current" as const, detail: "Reviewing" },
  { actor: "Verification", state: "waiting" as const, detail: "Next" },
  { actor: "Scheme", state: "waiting" as const, detail: "Waiting" },
  { actor: "PFMS", state: "waiting" as const, detail: "Waiting" },
  { actor: "Bank", state: "waiting" as const, detail: "Waiting" }
];

export default function VerificationTrackerPage() {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showNext, setShowNext] = useState(false);

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[1.1rem] bg-white p-7 shadow-soft sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge tone="active">Institute verification · Day 6</StatusBadge>
              <span className="text-sm font-semibold text-muted">Application ID: {applicationId}</span>
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl">
              Waiting on ABC College
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              Your scholarship cell is reviewing your enrolment and submitted documents.
            </p>
            <p className="mt-5 max-w-xl text-lg font-bold leading-snug text-ink">
              Nothing required from you right now.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Current owner</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{institution.cell}</h2>
            </div>
            <OwnershipRail items={waitingRail} evidence="Institute verification pending · updated 27 Aug" />
            <dl className="grid gap-4 border-t border-stone-100 pt-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-semibold text-muted">Expected by</dt>
                <dd className="mt-1 font-bold text-ink">2 September</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted">Student action</dt>
                <dd className="mt-1 font-bold text-ink">Nothing required</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted">Last update</dt>
                <dd className="mt-1 font-bold text-ink">27 Aug</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
        <InstitutionStatus mode="waiting" />

        <aside className="space-y-4">
          <section className="rounded-[1rem] bg-[#FBF7F1] p-5">
            <h2 className="text-lg font-bold text-ink">Still waiting?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your institute usually completes this step within 7 days. If the status does not change after 2 September, contact your scholarship cell.
            </p>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowDocuments((value) => !value)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-[#FBF7F1]"
            >
              <Eye size={18} />
              View documents
            </button>
            <button
              type="button"
              onClick={() => setShowNext((value) => !value)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-[#FBF7F1]"
            >
              <HelpCircle size={18} />
              What happens next?
            </button>
          </div>
        </aside>
      </section>

      {showDocuments ? (
        <section className="rounded-[1rem] bg-white p-5 shadow-sm state-pop">
          <h2 className="text-lg font-bold text-ink">Submitted documents</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            <li>✓ Aadhaar verification record</li>
            <li>✓ Income certificate</li>
            <li>✓ Bank account details</li>
            <li>✓ Institute enrolment proof</li>
          </ul>
        </section>
      ) : null}

      {showNext ? (
        <section className="rounded-[1rem] bg-white p-5 shadow-sm state-pop">
          <h2 className="text-lg font-bold text-ink">Next stage</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            After ABC College verifies the application, it moves to state verification. You will only need to act if a correction is requested.
          </p>
        </section>
      ) : null}
    </div>
  );
}
