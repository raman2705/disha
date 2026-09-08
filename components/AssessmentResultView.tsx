"use client";

import clsx from "clsx";
import { AlertTriangle, CheckCircle2, CircleHelp, Info, TrendingUp } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import type { AssessmentResult, FitBand } from "@/lib/opportunities";

const eligibilityCopy = {
  eligible: { label: "Eligible", tone: "success" as const },
  ineligible: { label: "Not eligible", tone: "danger" as const },
  uncertain: { label: "Needs more information", tone: "warning" as const }
};

const fitCopy: Record<FitBand, { label: string; tone: "success" | "active" | "warning" | "neutral" }> = {
  strong: { label: "Strong", tone: "success" },
  moderate: { label: "Moderate", tone: "active" },
  low: { label: "Low", tone: "warning" },
  unknown: { label: "Not enough information", tone: "neutral" }
};

/**
 * The basic result: three separate ideas, never blended into one number.
 *
 * Eligibility comes from the opportunity's published hard rules. Initial fit is a band over named
 * alignment signals. Missing information is stated rather than silently folded into a lower score.
 */
export function BasicResultView({ result }: { result: AssessmentResult }) {
  const eligibility = eligibilityCopy[result.eligibility.status];
  const fit = fitCopy[result.initialFit.band];
  // A failed hard rule settles the question. The fit band stays visible and truthful, but it is
  // labelled so a strong alignment can never be read as an invitation to apply anyway.
  const blocked = result.eligibility.status === "ineligible";

  return (
    <section aria-labelledby="basic-result-heading" className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-stone-200 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="basic-result-heading" className="text-xs font-black uppercase tracking-[0.16em] text-[#9B6D55]">
          Initial assessment
        </h2>
        <span className="text-xs font-bold text-muted">
          {result.coverage.checkedCriteria} of {result.coverage.totalCriteria} criteria checked
        </span>
      </div>

      <h3 className="mt-3 font-serif text-3xl font-black leading-tight text-ink">{result.opportunityName}</h3>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <div className="rounded-xl bg-[#FBF7F1] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Eligibility</p>
          <div className="mt-2">
            <StatusBadge tone={eligibility.tone}>{eligibility.label}</StatusBadge>
          </div>
        </div>
        <div className="rounded-xl bg-[#FBF7F1] p-4">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            {blocked ? "Fit if you were eligible" : "Initial fit"}
          </p>
          <div className="mt-2">
            <StatusBadge tone={blocked ? "neutral" : fit.tone}>{fit.label}</StatusBadge>
          </div>
        </div>
      </div>

      {blocked ? (
        <p className="mt-3 rounded-xl bg-[#FDEBEC] p-3.5 text-sm leading-6 text-red-900">
          A published hard requirement does not pass, so this opportunity is not open to you however
          well the rest of the profile aligns. {result.eligibility.blockers.join("; ")}.
        </p>
      ) : null}

      {result.initialFit.signals.length ? (
        <dl className="mt-5 divide-y divide-stone-100 border-y border-stone-100">
          {result.initialFit.signals.map((signal) => (
            <div key={signal.id} className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 py-3">
              <dt className="text-sm font-bold text-ink">{signal.label}</dt>
              <dd className={clsx("text-sm font-black", bandTextTone(signal.band))}>{fitCopy[signal.band].label}</dd>
              <dd className="w-full text-xs leading-5 text-muted">
                {signal.explanation}
                {signal.source ? <span className="text-muted/80"> Source: {signal.source}.</span> : null}
              </dd>
            </div>
          ))}
        </dl>
      ) : null}

      <div className="mt-5">
        <h4 className="text-xs font-black uppercase tracking-wide text-muted">Why</h4>
        <ul className="mt-2 space-y-2">
          {result.initialFit.reasons.map((reason) => (
            <li key={reason} className="flex gap-2.5 text-sm leading-6 text-slate-700">
              <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" aria-hidden="true" />
              {reason}
            </li>
          ))}
        </ul>
      </div>

      {result.initialFit.missingInformation.length ? (
        <div className="mt-5 rounded-xl bg-[#FFF8EC] p-4">
          <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-amber-900">
            <CircleHelp size={15} aria-hidden="true" />
            Still needs evidence ({result.initialFit.missingInformation.length})
          </h4>
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {result.initialFit.missingInformation.map((item) => (
              <li key={item} className="rounded-md bg-white/70 px-2 py-1 text-xs font-semibold text-amber-900">
                {item}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <details className="mt-5 text-sm">
        <summary className="cursor-pointer text-xs font-bold text-primary">How this band was decided</summary>
        <p className="mt-2 text-xs leading-5 text-muted">{result.initialFit.rule}</p>
      </details>
    </section>
  );
}

/**
 * The deep result. Shows the weighted score only when the engine was willing to compute one, which
 * it refuses to do below 60% of known selection weight rather than inventing precision.
 */
export function DeepResultView({ result }: { result: AssessmentResult }) {
  const scored = result.competitiveness.score !== null;

  return (
    <section aria-labelledby="deep-result-heading" className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-stone-200 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 id="deep-result-heading" className="text-xs font-black uppercase tracking-[0.16em] text-[#9B6D55]">
          Deeper assessment
        </h2>
        <StatusBadge tone="active">Confidence: {result.confidence.level}</StatusBadge>
      </div>

      <p className="mt-4 text-base leading-7 text-slate-700">{result.overallAssessment}</p>

      <div className="mt-5 rounded-xl bg-[#FBF7F1] p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-muted">How competitive this may be</p>
        <p className="mt-1.5 text-lg font-black text-ink">
          {scored ? `${result.competitiveness.score}/100 · ${result.competitiveness.band}` : "Not scored yet"}
        </p>
        <p className="mt-1 text-xs leading-5 text-muted">
          {scored
            ? `Weighted across the published selection criteria, covering ${result.competitiveness.assessedWeightPercent}% of known selection weight.`
            : `Disha will not put a number on this yet. Usable evidence covers ${result.competitiveness.assessedWeightPercent}% of known selection weight, below the 60% it needs.`}
        </p>
        <p className="mt-1.5 text-xs leading-5 text-muted">{result.confidence.explanation}</p>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <ResultList title="Strengths" icon={TrendingUp} items={result.strengths} empty="No strong evidence captured yet." />
        <ResultList title="Gaps" icon={AlertTriangle} items={result.gaps.map((gap) => gap.label)} empty="No major gap captured." />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Fact label="Strongest evidence" value={result.strongestEvidence} />
        <Fact label="Biggest gap" value={result.biggestGap?.summary ?? "No single dominant gap."} />
      </div>

      {result.competitiveness.criteria.length ? (
        <div className="mt-6">
          <h4 className="text-xs font-black uppercase tracking-wide text-muted">What matters most in selection</h4>
          <ul className="mt-3 space-y-3">
            {result.competitiveness.criteria
              .slice()
              .sort((a, b) => b.weight - a.weight)
              .map((criterion) => (
                <li key={criterion.id} className="rounded-xl bg-[#FBF7F1] p-3.5">
                  <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                    <p className="text-sm font-bold text-ink">{criterion.label}</p>
                    <p className="text-xs font-bold text-muted">
                      {criterion.weight}% weight · {criterion.evidenceStrength.replace(/_/g, " ")}
                    </p>
                  </div>
                  <p className="mt-1 text-xs leading-5 text-muted">{criterion.explanation}</p>
                  <p className="mt-1 text-[11px] leading-4 text-muted/80">
                    Basis: {criterion.basis.replace(/_/g, " ")}
                    {criterion.source ? ` · Source: ${criterion.source}` : " · Source not publicly disclosed"}
                  </p>
                </li>
              ))}
          </ul>
        </div>
      ) : null}

      {result.improvementActions.length ? (
        <div className="mt-6">
          <h4 className="text-xs font-black uppercase tracking-wide text-muted">What you can improve</h4>
          <ol className="mt-2 space-y-2">
            {result.improvementActions.map((action, index) => (
              <li key={action} className="flex gap-2.5 text-sm leading-6 text-slate-700">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#DDE3FA] text-xs font-black text-primary">
                  {index + 1}
                </span>
                {action}
              </li>
            ))}
          </ol>
        </div>
      ) : null}

      <div className="mt-6 flex items-start gap-2.5 rounded-xl bg-[#EEF2FF] p-4">
        <Info size={17} className="mt-0.5 shrink-0 text-primary" aria-hidden="true" />
        <div>
          <p className="text-sm font-bold text-ink">Next step</p>
          <p className="mt-0.5 text-sm leading-6 text-slate-700">{result.nextAction}</p>
        </div>
      </div>
    </section>
  );
}

function ResultList({
  title,
  icon: Icon,
  items,
  empty
}: {
  title: string;
  icon: typeof TrendingUp;
  items: string[];
  empty: string;
}) {
  return (
    <div>
      <h4 className="flex items-center gap-2 text-xs font-black uppercase tracking-wide text-muted">
        <Icon size={15} aria-hidden="true" />
        {title}
      </h4>
      <ul className="mt-2 space-y-1.5">
        {items.length ? (
          items.map((item) => (
            <li key={item} className="text-sm leading-6 text-slate-700">
              {item}
            </li>
          ))
        ) : (
          <li className="text-sm leading-6 text-muted">{empty}</li>
        )}
      </ul>
    </div>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-black uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-1 text-sm leading-6 text-slate-700">{value}</p>
    </div>
  );
}

function bandTextTone(band: FitBand) {
  if (band === "strong") return "text-emerald-700";
  if (band === "moderate") return "text-primary";
  if (band === "low") return "text-amber-800";
  return "text-muted";
}
