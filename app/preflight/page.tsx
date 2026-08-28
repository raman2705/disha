"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, FileUp, RefreshCw } from "lucide-react";
import { InstitutionStatus } from "@/components/InstitutionStatus";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryLink } from "@/components/PrimaryButton";
import { RequirementChecklist } from "@/components/RequirementChecklist";
import { StatusBadge } from "@/components/StatusBadge";
import { institution } from "@/lib/data";

export default function PreflightPage() {
  const [documentAdded, setDocumentAdded] = useState(false);
  const [certificateReplaced, setCertificateReplaced] = useState(false);
  const studentIssues = Number(!documentAdded) + Number(!certificateReplaced);
  const studentComplete = studentIssues === 0;

  return (
    <div>
      <PageHeader title="Check before you apply">
        Requirements are grouped by who owns the work, so you can see what you control and what depends on someone else.
      </PageHeader>

      <section className="mb-8 grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <div className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-stone-200 state-pop">
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Your part</p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            <span className={clsx("text-4xl font-bold", studentComplete ? "text-emerald-700" : "text-primary")}>
              {studentComplete ? "100%" : `${Math.max(0, 100 - studentIssues * 25)}%`}
            </span>
            <StatusBadge tone={studentComplete ? "success" : "warning"}>{studentComplete ? "Complete" : `${studentIssues} action${studentIssues > 1 ? "s" : ""} left`}</StatusBadge>
          </div>
          <p className="mt-4 text-sm leading-6 text-muted">
            {studentComplete
              ? "You have finished your tasks. Remaining movement depends on external verification."
              : "Resolve your own tasks before submitting, then the application can move to institution verification."}
          </p>
          <div className="mt-6 border-t border-stone-100 pt-5">
            <p className="text-xs font-bold uppercase tracking-normal text-muted">Overall application status</p>
            <h2 className="mt-2 text-xl font-bold text-ink">
              {studentComplete ? "Waiting on 1 external action" : "Waiting on your tasks and 1 external action"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-muted">{institution.cell} still needs to complete scholarship verification.</p>
          </div>
          <div className="mt-6">
            {studentComplete ? (
              <PrimaryLink href="/apply">Start application</PrimaryLink>
            ) : (
              <span className="inline-flex min-h-11 items-center rounded-md bg-stone-200 px-4 py-2 text-sm font-semibold text-stone-500">
                Start application
              </span>
            )}
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          <OwnerGroup
            title="Your tasks"
            items={[
              { label: "Aadhaar verified", state: "done" },
              { label: "Bank details complete", state: "done" },
              { label: "Academic details complete", state: "done" },
              { label: "Income certificate validity risk", state: certificateReplaced ? "done" : "warning" },
              { label: "Enrolment proof added", state: documentAdded ? "done" : "missing" }
            ]}
          />
          <OwnerGroup
            title="Your institution"
            items={[
              { label: "Enrolment confirmed", state: "done" },
              { label: "Scholarship verification pending", state: "pending" }
            ]}
          />
          <OwnerGroup
            title="System checks"
            items={[
              { label: "Profile verified", state: "done" },
              { label: "Scheme eligibility passed", state: "done" }
            ]}
          />
        </div>
      </section>

      <section className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
        <h2 className="text-xl font-bold text-ink">What happens outside your application?</h2>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
          Your institution also needs to complete 1 action. ABC College must confirm scholarship verification before the scholarship can proceed.
        </p>
        <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
          <p>
            <span className="font-semibold text-ink">Status:</span> Waiting for institution
          </p>
          <p>
            <span className="font-semibold text-ink">Student action:</span> No action required yet
          </p>
        </div>
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <IssueCard
          resolved={documentAdded}
          severity="Required"
          title="Institute enrolment proof missing"
          explanation="Add your copy of current enrolment proof so ABC College can complete verification without returning the application."
          why="Your upload is the part you control. ABC College still owns the scholarship verification action after submission."
          actor="You"
          cta="Add document"
          icon={<FileUp size={18} />}
          onResolve={() => setDocumentAdded(true)}
        />
        <IssueCard
          resolved={certificateReplaced}
          severity="Warning"
          title="Income certificate may expire during verification"
          explanation="Your income certificate expires shortly after the application deadline. If verification happens later, your institute may ask for a newer certificate."
          why="Replace it with a newer certificate if available."
          actor="You"
          cta="Replace certificate"
          icon={<RefreshCw size={18} />}
          onResolve={() => setCertificateReplaced(true)}
        />
      </div>

      <div className="mt-8">
        <InstitutionStatus mode="compact" />
      </div>
    </div>
  );
}

function OwnerGroup({ title, items }: { title: string; items: { label: string; state: "done" | "warning" | "missing" | "pending" }[] }) {
  return (
    <section className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <h2 className="text-lg font-bold text-ink">{title}</h2>
      <div className="mt-4">
        <RequirementChecklist items={items} />
      </div>
    </section>
  );
}

function IssueCard({
  resolved,
  severity,
  title,
  explanation,
  why,
  actor,
  cta,
  icon,
  onResolve
}: {
  resolved: boolean;
  severity: string;
  title: string;
  explanation: string;
  why: string;
  actor: string;
  cta: string;
  icon: React.ReactNode;
  onResolve: () => void;
}) {
  return (
    <article
      className={clsx(
        "rounded-xl bg-white p-5 shadow-sm ring-1 transition state-pop",
        resolved ? "ring-emerald-200" : severity === "Required" ? "ring-red-200" : "ring-amber-200"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <StatusBadge tone={resolved ? "success" : severity === "Required" ? "danger" : "warning"}>
            {resolved ? "Resolved" : severity}
          </StatusBadge>
          <h2 className="mt-3 text-xl font-bold text-ink">{resolved ? title.replace("missing", "added").replace("may expire", "updated") : title}</h2>
        </div>
        {resolved ? <CheckCircle2 className="text-emerald-700" size={26} /> : null}
      </div>
      <p className="mt-3 text-sm leading-6 text-slate-700">{resolved ? "This student-owned issue is no longer blocking your part." : explanation}</p>
      <p className="mt-4 rounded-md bg-stone-50 p-3 text-sm leading-6 text-slate-700">
        <span className="font-semibold text-ink">{severity === "Required" ? "Why this matters:" : "Recommended action:"}</span> {why}
      </p>
      <p className="mt-4 text-sm">
        <span className="font-semibold text-ink">Who needs to act:</span> {resolved ? "No student action needed" : actor}
      </p>
      <div className="mt-5">
        {resolved ? (
          <span className="inline-flex min-h-11 items-center gap-2 rounded-md bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 ring-1 ring-emerald-200">
            <CheckCircle2 size={18} />
            Completed
          </span>
        ) : (
          <button
            type="button"
            onClick={onResolve}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
          >
            {icon}
            {cta}
          </button>
        )}
      </div>
    </article>
  );
}
