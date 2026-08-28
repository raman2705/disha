"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, Circle, Eye, HelpCircle } from "lucide-react";
import { InstitutionStatus } from "@/components/InstitutionStatus";
import { StatusBadge } from "@/components/StatusBadge";
import { applicationId, institution } from "@/lib/data";

export default function VerificationTrackerPage() {
  const [showDocuments, setShowDocuments] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [institutionDone, setInstitutionDone] = useState(false);

  return (
    <div className="space-y-8">
      <section className="max-w-4xl rounded-2xl bg-white p-8 shadow-soft ring-1 ring-stone-200 state-pop">
        <div className="flex flex-wrap items-center gap-3">
          <StatusBadge tone={institutionDone ? "success" : "active"}>
            {institutionDone ? "Institution completed" : "Institute verification · Day 6"}
          </StatusBadge>
          <span className="text-sm font-semibold text-muted">Application ID: {applicationId}</span>
        </div>
        <h1 className="mt-5 text-4xl font-bold tracking-normal text-ink sm:text-5xl">
          {institutionDone ? "Waiting on state verification" : "Waiting on ABC College"}
        </h1>
        <p className="mt-4 max-w-2xl text-lg leading-8 text-muted">
          {institutionDone
            ? "ABC College completed enrolment and document checks. Your application has moved to the state officer queue."
            : "Your scholarship cell is reviewing your enrolment and submitted documents."}
        </p>
        <p className="mt-6 text-xl font-bold text-ink">
          {institutionDone ? "You don’t need to do anything. The next actor is the state officer." : "You don’t need to do anything right now."}
        </p>
        <div className="mt-6 flex flex-wrap gap-6 text-sm">
          <p>
            <span className="font-semibold text-muted">Expected by:</span>{" "}
            <span className="font-bold text-ink">{institutionDone ? "6 September" : "2 September"}</span>
          </p>
          <p>
            <span className="font-semibold text-muted">Current actor:</span>{" "}
            <span className="font-bold text-primary">{institutionDone ? "State officer" : institution.cell}</span>
          </p>
        </div>
        <div className="mt-7 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => setInstitutionDone((value) => !value)}
            className={clsx(
              "inline-flex min-h-11 items-center gap-2 rounded-md px-4 py-2 text-sm font-semibold transition",
              institutionDone ? "bg-slate-100 text-slate-700 hover:bg-slate-200" : "bg-primary text-white hover:bg-blue-900"
            )}
          >
            {institutionDone ? "Show waiting state" : "Mark institution completed"}
          </button>
          <button
            type="button"
            onClick={() => setShowDocuments((value) => !value)}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary ring-1 ring-stone-200 transition hover:bg-stone-50"
          >
            <Eye size={18} />
            View submitted documents
          </button>
          <button
            type="button"
            onClick={() => setShowNext((value) => !value)}
            className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 ring-1 ring-stone-200 transition hover:bg-stone-50"
          >
            <HelpCircle size={18} />
            What happens next?
          </button>
        </div>
      </section>

      <ActorTimeline institutionDone={institutionDone} />

      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <InstitutionStatus mode={institutionDone ? "completed" : "waiting"} />

        <aside className="space-y-4">
          <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-lg font-bold text-ink">Still waiting?</h2>
            <p className="mt-2 text-sm leading-6 text-muted">
              Your institute usually completes this step within 7 days. If the status does not change after 2 September, contact your scholarship cell.
            </p>
          </section>

          {showDocuments ? (
            <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-emerald-200 state-pop">
              <h2 className="text-lg font-bold text-ink">Submitted documents</h2>
              <ul className="mt-3 space-y-2 text-sm text-slate-700">
                <li>✓ Aadhaar verification record</li>
                <li>✓ Income certificate</li>
                <li>✓ Bank account details</li>
                <li>✓ Institute enrolment proof</li>
              </ul>
            </section>
          ) : null}

          {showNext ? (
            <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-blue-200 state-pop">
              <h2 className="text-lg font-bold text-ink">Next stage</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {institutionDone
                  ? "A state officer checks scheme and state-level rules. You will only need to act if a correction is requested."
                  : "After ABC College verifies the application, it moves to state verification. You will only need to act if a correction is requested."}
              </p>
            </section>
          ) : null}
        </aside>
      </div>
    </div>
  );
}

function ActorTimeline({ institutionDone }: { institutionDone: boolean }) {
  const actors = [
    { actor: "Student", lines: ["Application submitted", "Documents complete"], state: "done" },
    {
      actor: "ABC College",
      lines: ["Enrolment confirmed", "Required document uploaded", institutionDone ? "Scholarship verification completed" : "Scholarship verification pending"],
      state: institutionDone ? "done" : "active"
    },
    { actor: "State officer", lines: [institutionDone ? "Review in queue" : "Not started"], state: institutionDone ? "active" : "pending" },
    { actor: "Ministry / Scheme authority", lines: ["Not started"], state: "pending" },
    { actor: "PFMS", lines: ["Not started"], state: "pending" }
  ];

  return (
    <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-xl font-bold text-ink">Actor and dependency timeline</h2>
      <div className="mt-5 grid gap-4 lg:grid-cols-5">
        {actors.map((item) => (
          <article
            key={item.actor}
            className={clsx(
              "rounded-lg p-4",
              item.state === "active" && "bg-indigo-50 ring-2 ring-indigo-200",
              item.state === "done" && "bg-white ring-1 ring-emerald-100",
              item.state === "pending" && "bg-stone-50"
            )}
          >
            <div className="flex items-center gap-2">
              {item.state === "done" ? <CheckCircle2 className="text-emerald-700" size={18} /> : <Circle className={item.state === "active" ? "text-primary" : "text-slate-400"} size={18} />}
              <h3 className="font-bold text-ink">{item.actor}</h3>
            </div>
            <ul className="mt-3 space-y-2 text-sm text-muted">
              {item.lines.map((line) => (
                <li key={line}>{item.state === "done" ? "✓" : item.state === "active" ? "●" : "○"} {line}</li>
              ))}
            </ul>
          </article>
        ))}
      </div>
    </section>
  );
}
