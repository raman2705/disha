"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FileSearch, RefreshCw, Sparkles, TriangleAlert } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { ananyaEvidencePassport, getGuidedDemoApplication, profile } from "@/lib/data";
import { buildNormalApplicant } from "@/lib/normalAssessment";
import { Language, languageLabels, translations } from "@/lib/i18n";
import {
  buildOpportunityAssessmentResult,
  getAssessmentAvailability,
  getAssessmentQuestions,
  Opportunity,
  sampleAssessmentResponses
} from "@/lib/opportunities";

const statusTone = {
  Pass: "success",
  Fail: "danger",
  Unknown: "warning",
  Strong: "success",
  Moderate: "active",
  Weak: "warning",
  Missing: "neutral",
  eligible: "success",
  ineligible: "danger",
  uncertain: "warning",
  strong: "success",
  competitive: "active",
  developing: "warning",
  weak: "warning",
  unknown: "neutral",
  high: "success",
  medium: "active",
  low: "warning",
  credible: "active",
  claim_only: "warning",
  none: "neutral",
  moderate: "active"
} as const;

export default function AssessmentClient({ opportunity, initialAsk: _initialAsk }: { opportunity: Opportunity; initialAsk: string }) {
  const { guidedDemoActive, guidedDemoOpportunityId, language, normalAssessment, setLanguage, setDemoState, setAssistantOpen } = useAppState();
  const t = translations[language];
  const storageKey = `disha-assessment-${opportunity.id}`;
  const assessmentConfig = useMemo(() => getAssessmentAvailability(opportunity), [opportunity]);
  const fullAssessmentAvailable = assessmentConfig.availability === "full";
  const questions = useMemo(() => getAssessmentQuestions(opportunity), [opportunity]);
  const guidedApplication = getGuidedDemoApplication(guidedDemoOpportunityId);
  const trackerHref = guidedDemoActive ? guidedApplication?.href ?? "/applications" : "/applications";
  const [responses, setResponses] = useState<Record<string, string>>({});
  const applicant = useMemo(() => guidedDemoActive ? profile : buildNormalApplicant(normalAssessment), [guidedDemoActive, normalAssessment]);
  const assessmentResult = useMemo(() => {
    if (!guidedDemoActive && normalAssessment.assessmentResult?.opportunityId === opportunity.id) {
      return normalAssessment.assessmentResult;
    }
    // Same builder, same core profile: this page can never compute a different verdict from the
    // one /assess saved or the one the assistant reads.
    return buildOpportunityAssessmentResult(opportunity, responses, applicant, guidedDemoActive ? {} : { core: normalAssessment.core });
  }, [applicant, guidedDemoActive, normalAssessment.assessmentResult, normalAssessment.core, opportunity, responses]);
  const isCanonicalPragati = opportunity.id === "aicte-pragati-scholarship";
  const isDemoPragati = guidedDemoActive && isCanonicalPragati;
  const applicantLabel = guidedDemoActive ? "Ananya" : normalAssessment.name || "your profile";
  const decisionHeading = guidedDemoActive ? "Worth pursuing. Refresh one critical document before submitting." : decisionHeadline(assessmentResult);
  const prepareHref = guidedDemoActive ? "/preflight" : "/assess";

  useEffect(() => {
    if (isDemoPragati) setDemoState("assess");
  }, [isDemoPragati, setDemoState]);

  useEffect(() => {
    const parsed = readStoredResponses(storageKey);
    if (parsed) {
      if (Object.values(parsed).some(Boolean) || !guidedDemoActive || guidedDemoOpportunityId !== opportunity.id) {
        setResponses(parsed);
        return;
      }
    }

    if (guidedDemoActive && guidedDemoOpportunityId === opportunity.id && sampleAssessmentResponses[opportunity.id]) {
      setResponses(sampleAssessmentResponses[opportunity.id]);
    }
  }, [guidedDemoActive, guidedDemoOpportunityId, opportunity.id, storageKey]);

  useEffect(() => {
    window.localStorage.setItem(storageKey, JSON.stringify(responses));
  }, [responses, storageKey]);

  const applySample = () => {
    if (!fullAssessmentAvailable) return;
    setResponses(sampleAssessmentResponses[opportunity.id] ?? Object.fromEntries(questions.map((question) => [question.id, question.options[2] ?? question.options[1] ?? ""])));
  };

  const openAssistant = () => setAssistantOpen(true);

  return (
    <div>
      <Link href={`/opportunities/${opportunity.id}`} className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={17} />
        Back to opportunity
      </Link>

      <section className="mb-7 grid gap-6 lg:grid-cols-[0.56fr_0.44fr]">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[#9B6D55]">{opportunity.category}</p>
          <h1 className="mt-3 max-w-3xl font-serif text-5xl font-black leading-[0.98] tracking-normal text-ink">
            {opportunity.name} assessment
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-700">
            {assessmentResult.overallAssessment} {guidedDemoActive
              ? "Disha generated this from Ananya's profile, Evidence Passport and programme requirements before asking her to correct anything."
              : "Disha generated this from your current evidence answers and the programme requirements."}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <StatusBadge tone="active">{assessmentResult.recommendationLabel}</StatusBadge>
            <span className="text-sm font-semibold text-muted">Confidence: {sentenceCase(assessmentResult.confidence.level)}</span>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button type="button" onClick={openAssistant} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
              <Sparkles size={18} />
              Ask Disha
            </button>
            <Link href={prepareHref} className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-stone-200 transition hover:bg-[#FBF7F1]">
              {guidedDemoActive ? "Prepare packet" : "Update assessment"}
              <ArrowRight size={18} />
            </Link>
            <label className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-semibold text-ink shadow-sm ring-1 ring-stone-200">
              Language
              <select value={language} onChange={(event) => setLanguage(event.target.value as Language)} className="bg-transparent font-bold outline-none">
                {Object.entries(languageLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </label>
          </div>
        </div>

        <section className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Decision</p>
          <h2 className="mt-2 font-serif text-3xl font-bold leading-tight text-ink">
            {decisionHeading}
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            This separates formal eligibility from competitive evidence. Disha only shows a fit score when enough criterion weight has usable evidence.
          </p>
          <div className="mt-5 grid gap-3">
            {assessmentResult.gaps.slice(0, 2).map((gap) => (
              <div key={gap.label} className="rounded-md bg-[#FFF3DD] p-3 ring-1 ring-amber-100">
                <p className="text-sm font-bold text-ink">{gap.label}</p>
                <p className="mt-1 text-sm leading-6 text-slate-700">{gap.suggestion}</p>
              </div>
            ))}
          </div>
          <button type="button" onClick={openAssistant} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-[#EEF2FF] px-4 py-2 text-sm font-bold text-primary ring-1 ring-indigo-100">
            <Sparkles size={18} />
            Ask why Disha thinks this
          </button>
        </section>
      </section>

      {!guidedDemoActive ? (
        <section className="mb-7 rounded-lg bg-[#EEF2FF] p-5">
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge tone={assessmentResult.depth === "deep" ? "success" : "active"}>
              {assessmentResult.depth === "deep" ? "Deeper assessment" : "Initial assessment"}
            </StatusBadge>
            <span className="text-sm font-semibold text-muted">
              Disha can already check {assessmentResult.coverage.checkedCriteria} of {assessmentResult.coverage.totalCriteria} criteria for this opportunity.
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-slate-700">
            {assessmentResult.coverage.remainingQuestions > 0
              ? `Answer ${assessmentResult.coverage.remainingQuestions} more question${assessmentResult.coverage.remainingQuestions === 1 ? "" : "s"} to complete the deeper assessment. Nothing you have already told Disha is asked again.`
              : "Every published question for this opportunity has been answered."}
          </p>
          {assessmentResult.coverage.remainingQuestions > 0 ? (
            <Link href="/assess" className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
              Answer the remaining questions
              <ArrowRight size={15} />
            </Link>
          ) : null}
        </section>
      ) : null}

      <section className="mb-7 grid gap-4 md:grid-cols-4">
        <AssessmentSummaryCard title={t.assessment.eligibility} status={assessmentResult.eligibility.status} body={eligibilitySummary(assessmentResult)} />
        <AssessmentSummaryCard
          title={assessmentResult.depth === "basic" ? "Initial fit" : "Competitive fit"}
          status={assessmentResult.depth === "basic" ? assessmentResult.initialFit.band : assessmentResult.competitiveness.band}
          body={competitiveFitSummary(assessmentResult)}
        />
        <AssessmentSummaryCard title="Confidence" status={assessmentResult.confidence.level} body={assessmentResult.confidence.explanation} />
        <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <div className="flex items-start justify-between gap-3">
            <h2 className="font-serif text-xl font-bold text-ink">Recommendation</h2>
            <StatusBadge tone={assessmentResult.effortVsUpside.effort === "High" ? "warning" : "active"}>{assessmentResult.effortVsUpside.effort}</StatusBadge>
          </div>
          <p className="mt-3 text-lg font-black text-ink">{assessmentResult.recommendationLabel}</p>
          <p className="mt-2 text-sm leading-6 text-muted">{assessmentResult.recommendation.explanation}</p>
        </article>
      </section>

      <details className="mb-7 rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <summary className="cursor-pointer font-serif text-2xl font-bold text-ink">Why Disha thinks this</summary>
        <div className="mt-5 grid gap-5 lg:grid-cols-[0.56fr_0.44fr]">
        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#EEF2FF] text-primary">
              <FileSearch size={19} />
            </span>
            <div>
              <h2 className="font-serif text-3xl font-bold text-ink">Why Disha thinks this</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                {guidedDemoActive
                  ? "Disha mapped programme requirements to Ananya's reusable Evidence Passport. The conclusion is not a self-rating: academic and institution proof are strong, income appears within threshold, and readiness is moderate because the proof document is stale."
                  : "Disha mapped programme requirements to the evidence answers on this page. The conclusion is not a self-rating; it changes when you correct missing or stale proof."}
              </p>
            </div>
          </div>
          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            {ananyaEvidencePassport.records.slice(0, 6).map((record) => (
              <div key={record.id} className="rounded-md bg-[#FBF7F1] p-3 ring-1 ring-stone-100">
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-bold text-ink">{record.label}</p>
                  <StatusBadge tone={record.status === "verified" || record.status === "available" ? "success" : "warning"}>{record.status}</StatusBadge>
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-700">{record.value}</p>
                <p className="mt-2 text-xs font-semibold text-muted">{record.source} · {record.freshness}</p>
              </div>
            ))}
          </div>
        </article>

        <article className="rounded-lg bg-[#FFF3DD] p-6 ring-1 ring-amber-100">
          <div className="flex gap-3">
            <TriangleAlert className="mt-1 text-amber-800" size={22} />
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">Biggest risk</h2>
              <p className="mt-3 text-lg font-black text-ink">{assessmentResult.gaps[0]?.label ?? "No major gap captured"}</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{assessmentResult.gaps[0]?.severity === "critical" ? "This is a formal eligibility blocker." : "This could materially affect the current recommendation."}</p>
              <p className="mt-4 rounded-md bg-white/70 p-3 text-sm font-semibold leading-6 text-slate-700">
                {assessmentResult.gaps[0]?.suggestion ?? "Keep documents current."}
              </p>
            </div>
          </div>
        </article>
        </div>
      </details>

      <details className="mb-7 rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <summary className="cursor-pointer font-serif text-2xl font-bold text-ink">See full assessment</summary>
        <div className="mt-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="font-serif text-3xl font-bold text-ink">{t.assessment.evaluatorLens}</h2>
            <p className="mt-2 text-sm leading-6 text-muted">See how your current evidence maps to what this opportunity evaluates.</p>
          </div>
          <StatusBadge tone="active">{assessmentResult.competitiveness.criteria.length ? `${assessmentResult.competitiveness.criteria.length} selection criteria mapped` : "Assessment unavailable"}</StatusBadge>
        </div>

        <div className="mt-6 grid gap-4 lg:grid-cols-2">
          {assessmentResult.competitiveness.criteria.length ? assessmentResult.competitiveness.criteria.map((criterion) => (
            <article key={criterion.id} className="rounded-lg bg-[#FBF7F1] p-5 ring-1 ring-stone-200">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-serif text-xl font-bold text-ink">{criterion.label}</h3>
                  <p className="mt-1 text-sm leading-6 text-muted">Importance: {sentenceCase(criterion.importance)} · Weight: {criterion.weight}%</p>
                </div>
                <StatusBadge tone={statusTone[criterion.evidenceStrength]}>{sentenceCase(criterion.evidenceStrength)}</StatusBadge>
              </div>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="font-bold text-ink">Source basis</dt>
                  <dd className="mt-1 leading-6 text-slate-700">{sentenceCase(criterion.basis)}{criterion.source ? ` · ${criterion.source}` : ""}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">{guidedDemoActive ? "Ananya's evidence" : "Your evidence"}</dt>
                  <dd className="mt-1 leading-6 text-slate-700">{criterion.evidenceFromProfile?.join("; ") || "No profile evidence captured yet."}</dd>
                </div>
                <div>
                  <dt className="font-bold text-ink">{criterion.evidenceScore !== null && criterion.evidenceScore >= 3 ? "Finding" : t.assessment.gap}</dt>
                  <dd className="mt-1 leading-6 text-slate-700">{criterion.explanation}</dd>
                </div>
                <div className="flex flex-wrap gap-2 pt-1 text-xs font-bold text-muted">
                  <span>Evidence score: {criterion.evidenceScore ?? "Unknown"}</span>
                </div>
              </dl>
            </article>
          )) : (
            <article className="rounded-lg bg-[#FBF7F1] p-5 ring-1 ring-stone-200 lg:col-span-2">
              <h3 className="font-serif text-xl font-bold text-ink">Detailed assessment is not available for this opportunity yet.</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Disha has discovery information for access, eligibility and readiness. It does not have enough verified criteria to assess academics, research experience, leadership, programme fit or evidence quality.
              </p>
              {opportunity.selectionCriteria?.length ? (
                <ul className="mt-4 grid gap-2 text-sm text-slate-700 sm:grid-cols-2">
                  {opportunity.selectionCriteria.map((criterion) => (
                    <li key={criterion.label}>Noted criterion: {criterion.label}</li>
                  ))}
                </ul>
              ) : null}
            </article>
          )}
        </div>
        </div>
      </details>

      <details className="mb-7 rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
        <summary className="cursor-pointer font-serif text-2xl font-bold text-ink">Review or correct Disha's evidence</summary>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mt-2 text-sm leading-6 text-muted">
              {guidedDemoActive
                ? "The initial assessment is generated automatically. Use these controls only if Ananya needs to correct missing or stale evidence in the demo."
                : "Use these controls to add or correct evidence for this opportunity."}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={applySample}
              disabled={!fullAssessmentAvailable || isDemoPragati}
              title={isDemoPragati ? "AICTE Pragati is derived from the Evidence Passport." : fullAssessmentAvailable ? undefined : "Detailed assessment is not available for this opportunity yet."}
              className="inline-flex min-h-10 items-center gap-2 rounded-md bg-[#EEF2FF] px-3 py-2 text-sm font-bold text-primary ring-1 ring-indigo-100 disabled:cursor-not-allowed disabled:bg-stone-100 disabled:text-stone-500"
            >
              <CheckCircle2 size={17} />
              Use sample inputs
            </button>
            <button type="button" onClick={() => setResponses({})} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-stone-200 transition hover:bg-[#FBF7F1]">
              <RefreshCw size={17} />
              Clear corrections
            </button>
          </div>
        </div>
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          {questions.length ? questions.map((question) => (
            <label key={question.id} className="block">
              <span className="mb-2 block text-sm font-semibold text-ink">{question.label}</span>
              <select
                value={responses[question.id] ?? ""}
                onChange={(event) => setResponses((current) => ({ ...current, [question.id]: event.target.value }))}
                disabled={isDemoPragati}
                className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15 disabled:bg-stone-100 disabled:text-stone-500"
              >
                {question.options.map((option, index) => (
                  <option key={`${question.id}-${option || "blank"}`} value={option}>
                    {index === 0 ? "Evidence not corrected" : option}
                  </option>
                ))}
              </select>
            </label>
          )) : (
            <div className="rounded-md bg-[#FBF7F1] p-4 text-sm leading-6 text-slate-700 md:col-span-3">
              Full assessment unavailable. Disha can still show opportunity details, eligibility and readiness requirements without inventing scores.
            </div>
          )}
        </div>
      </details>

      <section className="rounded-lg bg-[#F6F5FF] p-6 ring-1 ring-indigo-100">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Sparkles size={19} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">{t.assistant.title}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">The same assistant opens as a drawer and keeps the assessment screen visible.</p>
            </div>
          </div>
          <Link href={trackerHref} className="inline-flex items-center gap-2 text-sm font-bold text-primary">
            Open application tracker
            <ArrowRight size={16} />
          </Link>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {["Should I actually apply?", "What should I improve first?", "Why is my readiness only moderate?", "What evidence are you using?"].map((question) => (
            <button key={question} type="button" onClick={openAssistant} className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-[#EEF2FF]">
              {question}
            </button>
          ))}
        </div>
        <button type="button" onClick={openAssistant} className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white">
          Open Disha Assistant
          <ArrowRight size={16} />
        </button>
      </section>
    </div>
  );
}

/**
 * Saved answers are user data written by an earlier build. Read them defensively: a corrupt blob
 * or a value that is no longer a plain string must never take the assessment page down.
 */
function readStoredResponses(storageKey: string): Record<string, string> | null {
  const saved = window.localStorage.getItem(storageKey);
  if (!saved) return null;

  try {
    const parsed: unknown = JSON.parse(saved);
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) return null;
    return Object.fromEntries(
      Object.entries(parsed as Record<string, unknown>).filter((entry): entry is [string, string] => typeof entry[1] === "string")
    );
  } catch {
    window.localStorage.removeItem(storageKey);
    return null;
  }
}

function decisionHeadline(assessment: ReturnType<typeof buildOpportunityAssessmentResult>) {
  if (assessment.eligibility.status === "ineligible") return "Check eligibility before spending more time.";
  if (assessment.eligibility.status === "uncertain") return "Verify eligibility before investing effort.";
  if (assessment.competitiveness.score === null) return "Add evidence before deciding to apply.";
  if (assessment.recommendation.verdict === "low_priority") return "Not enough evidence to prioritize yet.";
  if (assessment.competitiveness.band === "developing") return "Worth checking after evidence improves.";
  return "Strong enough to prepare with confidence.";
}

function AssessmentSummaryCard({ title, status, body }: { title: string; status: keyof typeof statusTone; body: string }) {
  return (
    <article className="rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-serif text-xl font-bold text-ink">{title}</h2>
        <StatusBadge tone={statusTone[status]}>{status}</StatusBadge>
      </div>
      <p className="mt-3 text-sm leading-6 text-muted">{body}</p>
    </article>
  );
}

function eligibilitySummary(assessment: ReturnType<typeof buildOpportunityAssessmentResult>) {
  if (assessment.eligibility.status === "ineligible") return `Hard blocker: ${assessment.eligibility.blockers.join(", ")}.`;
  const passCount = assessment.eligibility.conditions.filter((condition) => condition.result === "pass").length;
  const unknownCount = assessment.eligibility.conditions.filter((condition) => condition.result === "unknown").length;
  if (unknownCount) return `You meet ${passCount} requirements; ${unknownCount} still need verification.`;
  return `You meet ${passCount} of ${assessment.eligibility.conditions.length} verified requirements.`;
}

function competitiveFitSummary(assessment: ReturnType<typeof buildOpportunityAssessmentResult>) {
  if (assessment.depth === "basic") {
    return `Initial fit: ${assessment.initialFit.band}. ${assessment.initialFit.rule}`;
  }
  if (assessment.eligibility.status === "ineligible") return "Not assessed because formal eligibility failed.";
  if (assessment.competitiveness.score === null) return `No numeric score shown. Usable evidence covers ${assessment.competitiveness.assessedWeightPercent}% of known selection weight.`;
  return `${sentenceCase(assessment.competitiveness.band)}: ${assessment.competitiveness.score}/100, based on ${assessment.competitiveness.assessedWeightPercent}% of known selection weight.`;
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}
