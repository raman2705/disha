"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Eye, FlaskConical, GraduationCap, HelpCircle, Rocket } from "lucide-react";
import { InstitutionStatus } from "@/components/InstitutionStatus";
import { OwnershipRail } from "@/components/OwnershipRail";
import { StatusBadge } from "@/components/StatusBadge";
import { applicationId, getApplicationOwnership, getDemoApplication, institution } from "@/lib/data";
import { useAppState } from "@/components/AppContext";
import { localise, localiser } from "@/lib/hindi";

export default function VerificationTrackerPage() {
  const params = useParams<{ id: string }>();
  const { setDemoState, language } = useAppState();
  const tr = localiser(language);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const currentApplication = getDemoApplication(params.id) ?? getDemoApplication("css-2026");
  const ownership = currentApplication ? localise(getApplicationOwnership(currentApplication), language) : null;

  useEffect(() => {
    if (params.id.includes("pragati")) setDemoState("verification");
  }, [params.id, setDemoState]);

  if (currentApplication && ownership && params.id !== "css-2026") {
    return (
      <ApplicationTracker
        icon={iconForCategory(currentApplication.category)}
        category={currentApplication.category}
        title={currentApplication.title}
        status={ownership.status}
        owner={ownership.currentOwner}
        headline={headlineForOwnership(currentApplication.id, ownership.label)}
        body={ownership.summary}
        applicantAction={ownership.applicantAction}
        rail={ownership.rail}
        evidence={ownership.evidence}
        nextTitle={ownership.nextExpectedOwner ? "What happens next?" : "Current ownership"}
        nextBody={ownership.nextExpectedOwner ? `If this step clears, ownership moves to ${ownership.nextExpectedOwner}.` : ownership.summary}
        documents={currentApplication.documents}
        warning={currentApplication.tone === "warning" || currentApplication.tone === "danger"}
      />
    );
  }

  if (!currentApplication || !ownership) {
    return null;
  }

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
              Waiting on {institution.name}
            </h1>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              {ownership.summary}
            </p>
            <p className="mt-5 max-w-xl text-lg font-bold leading-snug text-ink">
              {ownership.applicantAction}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">{tr("Current owner")}</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{ownership.currentOwner}</h2>
            </div>
            <OwnershipRail items={ownership.rail} evidence={ownership.evidence} />
            <dl className="grid gap-4 border-t border-stone-100 pt-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="font-semibold text-muted">Expected by</dt>
                <dd className="mt-1 font-bold text-ink">{ownership.expectedBy ?? "Not available"}</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted">Student action</dt>
                <dd className="mt-1 font-bold text-ink">{ownership.applicantAction}</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted">Last update</dt>
                <dd className="mt-1 font-bold text-ink">{ownership.lastUpdated ?? "Not available"}</dd>
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
            After {institution.name} verifies the application, it moves to state verification. You will only need to act if a correction is requested.
          </p>
        </section>
      ) : null}
    </div>
  );
}

function ApplicationTracker({
  icon,
  category,
  title,
  status,
  owner,
  headline,
  body,
  applicantAction,
  rail,
  evidence,
  nextTitle,
  nextBody,
  documents,
  warning = false
}: {
  icon: React.ReactNode;
  category: string;
  title: string;
  status: string;
  owner: string;
  headline: string;
  body: string;
  applicantAction: string;
  rail: { actor: string; state: "completed" | "current" | "waiting" | "blocked" | "student-action"; detail: string }[];
  evidence: string;
  nextTitle: string;
  nextBody: string;
  documents: string[];
  warning?: boolean;
}) {
  const { language } = useAppState();
  const tr = localiser(language);
  const [showDocuments, setShowDocuments] = useState(false);
  const [showNext, setShowNext] = useState(false);

  return (
    <div className="space-y-7">
      <Link href="/applications" className="inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={17} />
        Back to applications
      </Link>

      <section className="overflow-hidden rounded-[1.1rem] bg-white p-7 shadow-soft sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.44fr_0.56fr] lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <span className="flex h-12 w-12 items-center justify-center rounded-md bg-[#F7E8DC] text-[#8F5139]">{icon}</span>
              <StatusBadge tone={warning ? "warning" : "active"}>{status}</StatusBadge>
              <span className="text-sm font-semibold text-muted">{category}</span>
            </div>
            <h1 className="mt-5 max-w-xl text-4xl font-bold leading-tight tracking-normal text-ink sm:text-5xl">
              {headline}
            </h1>
            <p className="mt-3 text-base font-bold text-primary">{title}</p>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">{body}</p>
            <p className="mt-5 max-w-xl text-lg font-bold leading-snug text-ink">{applicantAction}</p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">{tr("Current owner")}</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{owner}</h2>
            </div>
            <OwnershipRail items={rail} evidence={evidence} className={warning ? "bg-[#FFF3DD]" : undefined} />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.78fr]">
        <section className="rounded-[1rem] bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-lg font-bold text-ink">{tr("Application packet")}</h2>
          <ul className="mt-3 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
            {documents.map((document) => (
              <li key={document}>✓ {document}</li>
            ))}
          </ul>
        </section>

        <aside className="space-y-4">
          <section className="rounded-[1rem] bg-[#FBF7F1] p-5">
            <h2 className="text-lg font-bold text-ink">{nextTitle}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">{nextBody}</p>
          </section>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => setShowDocuments((value) => !value)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-primary shadow-sm transition hover:bg-[#FBF7F1]"
            >
              <Eye size={18} />
              {showDocuments ? "Hide details" : "View evidence"}
            </button>
            <button
              type="button"
              onClick={() => setShowNext((value) => !value)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-[#FBF7F1]"
            >
              <HelpCircle size={18} />
              Why this is with them
            </button>
          </div>
        </aside>
      </section>

      {showDocuments || showNext ? (
        <section className="rounded-[1rem] bg-white p-5 shadow-sm state-pop">
          <h2 className="text-lg font-bold text-ink">{showDocuments ? "Evidence Disha found" : "Why ownership is here"}</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            {showDocuments ? documents.join(", ") : evidence}
          </p>
        </section>
      ) : null}
    </div>
  );
}

function iconForCategory(category: string) {
  if (category === "Research Grant") return <FlaskConical size={26} />;
  if (category === "Startup Funding") return <Rocket size={26} />;
  return <GraduationCap size={26} />;
}

function headlineForOwnership(applicationId: string, label: string) {
  const headlines: Record<string, string> = {
    "pragati-readiness-2026": "AICTE Pragati is with your institution",
    "anrf-arg-2026": "Your proposal is with the review panel",
    "sisfs-2026": "Incubator needs a budget clarification"
  };
  return headlines[applicationId] ?? label;
}
