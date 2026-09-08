"use client";

import { useEffect, useState } from "react";
import clsx from "clsx";
import { CheckCircle2, Clock, ShieldCheck } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { translations } from "@/lib/i18n";
import {
  blockerOwner,
  blockerStateCopy,
  nextBlockerStatus,
  type BlockerDefinition,
  type BlockerStatus
} from "@/lib/blockers";

/** How long the simulated review takes. Deterministic, and labelled as simulated on screen. */
const REVIEW_MS = 1600;

/**
 * Renders one blocker through its real lifecycle.
 *
 * Providing evidence is a genuine input, not a button that marks the blocker done: the applicant
 * chooses what they are supplying, submits it, and then waits on a reviewer they do not control.
 */
export function BlockerCard({
  definition,
  status,
  onChange
}: {
  definition: BlockerDefinition;
  status: BlockerStatus;
  onChange: (status: BlockerStatus) => void;
}) {
  const { language } = useAppState();
  const t = translations[language].blocker;
  const [choice, setChoice] = useState("");
  const copy = blockerStateCopy[status.state];
  const stateLabel = {
    missing: t.missing,
    action_needed: t.actionNeeded,
    provided: t.provided,
    under_review: t.underReview,
    resolved: t.resolved
  }[status.state];
  const owner = blockerOwner(definition, status);

  // The review is the one transition the applicant does not drive.
  useEffect(() => {
    if (status.state !== "under_review") return;
    const timer = setTimeout(() => onChange(nextBlockerStatus(status, { type: "review_passed" })), REVIEW_MS);
    return () => clearTimeout(timer);
  }, [status, onChange]);

  return (
    <article
      className={clsx(
        "rounded-xl bg-white p-5 shadow-sm ring-1 transition",
        status.state === "resolved"
          ? "ring-emerald-200"
          : status.state === "under_review" || status.state === "provided"
            ? "ring-indigo-200"
            : definition.severity === "Required"
              ? "ring-red-200"
              : "ring-amber-200"
      )}
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <StatusBadge tone={copy.tone}>{stateLabel}</StatusBadge>
          <h3 className="mt-3 text-lg font-black leading-tight text-ink">{definition.title}</h3>
        </div>
        {status.state === "resolved" ? <CheckCircle2 className="shrink-0 text-emerald-700" size={24} aria-hidden="true" /> : null}
      </div>

      <p className="mt-2.5 text-sm leading-6 text-slate-700">{copy.meaning}</p>

      <p className="mt-3 rounded-lg bg-[#FBF7F1] p-3 text-sm leading-6 text-slate-700">
        <span className="font-bold text-ink">{t.whyMatters}</span> {definition.whyItMatters}
      </p>

      {status.returnedReason ? (
        <p className="mt-3 rounded-lg bg-[#FFF3DD] p-3 text-sm leading-6 text-amber-900">
          <span className="font-bold">{t.returned}</span> {status.returnedReason}
        </p>
      ) : null}

      <dl className="mt-3.5 grid gap-1.5 text-sm">
        <div className="flex flex-wrap gap-x-2">
          <dt className="font-bold text-ink">{t.whoOwns}</dt>
          <dd className="text-slate-700">{owner}</dd>
        </div>
        {status.evidence ? (
          <div className="flex flex-wrap gap-x-2">
            <dt className="font-bold text-ink">{t.youProvided}</dt>
            <dd className="text-slate-700">{status.evidence}</dd>
          </div>
        ) : null}
      </dl>

      {status.state === "missing" ? (
        <button
          type="button"
          onClick={() => onChange(nextBlockerStatus(status, { type: "start" }))}
          className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
        >
          {definition.evidencePrompt}
        </button>
      ) : null}

      {status.state === "action_needed" ? (
        <div className="mt-4 rounded-lg bg-[#FBF7F1] p-3.5">
          <p className="text-sm font-bold text-ink">{definition.evidencePrompt}</p>
          <div className="mt-2.5 flex flex-wrap gap-2" role="radiogroup" aria-label={definition.evidencePrompt}>
            {definition.evidenceOptions.map((option) => (
              <button
                key={option}
                type="button"
                role="radio"
                aria-checked={choice === option}
                onClick={() => setChoice(option)}
                className={clsx(
                  "min-h-10 rounded-lg px-3 py-1.5 text-xs font-bold ring-1 transition",
                  choice === option ? "bg-primary text-white ring-primary" : "bg-white text-slate-700 ring-stone-200 hover:bg-white"
                )}
              >
                {option}
              </button>
            ))}
          </div>
          <button
            type="button"
            disabled={!choice}
            onClick={() => onChange(nextBlockerStatus(status, { type: "provide", evidence: choice }))}
            className="mt-3.5 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-stone-300"
          >
            {t.save}
          </button>
        </div>
      ) : null}

      {status.state === "provided" ? (
        <div className="mt-4">
          <p className="text-sm leading-6 text-slate-700">
            {definition.reviewer} still has to accept it. {definition.reviewCheck}
          </p>
          <button
            type="button"
            onClick={() => onChange(nextBlockerStatus(status, { type: "submit_for_review" }))}
            className="mt-3 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
          >
            <ShieldCheck size={16} aria-hidden="true" />
            {t.sendTo} {definition.reviewer}
          </button>
        </div>
      ) : null}

      {status.state === "under_review" ? (
        <p className="mt-4 inline-flex items-center gap-2 rounded-md bg-[#EEF2FF] px-3.5 py-2.5 text-sm font-bold text-primary">
          <Clock size={16} className="animate-pulse" aria-hidden="true" />
          {definition.reviewer} {t.simulated}
        </p>
      ) : null}

      {status.state === "resolved" ? (
        <p className="mt-4 text-sm leading-6 text-slate-700">
          {definition.reviewer} accepted {status.evidence ? `"${status.evidence}"` : "the evidence"}. Nothing further is needed from you here.
        </p>
      ) : null}
    </article>
  );
}
