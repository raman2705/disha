"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { ArrowLeft, ArrowRight, Pencil, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { BasicResultView, DeepResultView } from "@/components/AssessmentResultView";
import { useAppState } from "@/components/AppContext";
import { coreQuestions, deepQuestions, opportunityQualifiers, type FlowQuestion } from "@/lib/assessmentFlow";
import { finalizeNormalAssessment, type NormalAssessmentDraft } from "@/lib/normalAssessment";
import { opportunities, type CoreProfile, type Opportunity } from "@/lib/opportunities";

const opportunityChoices = opportunities.slice(0, 8);

type Phase = "basic" | "result" | "deep" | "deepResult";

export default function NormalAssessPage() {
  const { normalAssessment, setNormalAssessment, setAssistantOpen } = useAppState();
  const [draft, setDraft] = useState<NormalAssessmentDraft>(normalAssessment);
  const [opportunityId, setOpportunityId] = useState(normalAssessment.opportunityId || opportunityChoices[0].id);
  const [phase, setPhase] = useState<Phase>(normalAssessment.generated ? "result" : "basic");
  const [step, setStep] = useState(0);

  const opportunity = useMemo(
    () => opportunityChoices.find((item) => item.id === opportunityId) ?? opportunityChoices[0],
    [opportunityId]
  );

  const basicQuestions = useMemo<FlowQuestion[]>(
    () => [...coreQuestions, ...opportunityQualifiers(opportunity)],
    [opportunity]
  );
  const deep = useMemo(() => deepQuestions(opportunity), [opportunity]);

  const answered = (question: FlowQuestion) => Boolean(readAnswer(draft.core, question.id));
  const alreadyKnown = basicQuestions.filter(answered).length;

  const setAnswer = (question: FlowQuestion, value: string) => {
    setDraft((current) => ({ ...current, core: writeAnswer(current.core, question.id, value) }));
  };

  const finish = (nextDraft: NormalAssessmentDraft, nextPhase: Phase) => {
    const finalized = finalizeNormalAssessment(nextDraft, opportunity);
    setDraft(finalized);
    setNormalAssessment(finalized);
    setPhase(nextPhase);
    setStep(0);
  };

  const advanceBasic = () => {
    if (step < basicQuestions.length - 1) {
      setStep(step + 1);
      return;
    }
    finish(draft, "result");
  };

  const advanceDeep = () => {
    if (step < deep.length - 1) {
      setStep(step + 1);
      return;
    }
    finish(draft, "deepResult");
  };

  const editAnswers = () => {
    setPhase("basic");
    setStep(0);
  };

  const result = draft.assessmentResult;

  return (
    <div className="mx-auto max-w-3xl pb-16">
      <PageHeader eyebrow="Assess" title="Start with a few questions, not a form.">
        Disha asks only what changes the answer. You get eligibility and an initial fit first, and a deeper assessment
        is entirely optional.
      </PageHeader>

      <div className="mb-6 rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
        <label htmlFor="assess-opportunity" className="text-xs font-black uppercase tracking-wide text-muted">
          Assessing against
        </label>
        <select
          id="assess-opportunity"
          value={opportunity.id}
          onChange={(event) => {
            setOpportunityId(event.target.value);
            setPhase("basic");
            setStep(0);
          }}
          className="mt-2 h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          {opportunityChoices.map((item) => (
            <option key={item.id} value={item.id}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      {phase === "basic" ? (
        <QuestionStep
          question={basicQuestions[step]}
          value={readAnswer(draft.core, basicQuestions[step].id)}
          onChange={(value) => setAnswer(basicQuestions[step], value)}
          index={step}
          total={basicQuestions.length}
          alreadyKnown={alreadyKnown}
          onBack={step > 0 ? () => setStep(step - 1) : undefined}
          onNext={advanceBasic}
          nextLabel={step === basicQuestions.length - 1 ? "See my initial assessment" : "Next"}
        />
      ) : null}

      {phase === "result" && result ? (
        <div className="space-y-5">
          <BasicResultView result={result} />

          <section className="rounded-2xl bg-[#EEF2FF] p-6">
            <h2 className="font-serif text-2xl font-black text-ink">Get a deeper assessment</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              Answer a few more questions to understand your strengths, gaps and how competitive your application may
              be.
            </p>
            {deep.length ? (
              <p className="mt-3 text-sm font-semibold text-primary">
                Disha can already check {result.coverage.checkedCriteria} of {result.coverage.totalCriteria} criteria.
                Answer {deep.length} more question{deep.length === 1 ? "" : "s"} to complete the picture.
              </p>
            ) : (
              <p className="mt-3 text-sm font-semibold text-muted">
                No deeper questionnaire is published for this opportunity yet.
              </p>
            )}
            <div className="mt-5 flex flex-wrap gap-3">
              {deep.length ? (
                <button
                  type="button"
                  onClick={() => {
                    setPhase("deep");
                    setStep(0);
                  }}
                  className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
                >
                  Get a deeper assessment
                  <ArrowRight size={17} aria-hidden="true" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={editAnswers}
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-stone-200 transition hover:bg-[#FBF7F1]"
              >
                <Pencil size={15} aria-hidden="true" />
                Edit my answers
              </button>
              <button
                type="button"
                onClick={() => setAssistantOpen(true)}
                className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-primary ring-1 ring-stone-200 transition hover:bg-white"
              >
                <Sparkles size={15} aria-hidden="true" />
                Ask Disha about this
              </button>
            </div>
          </section>

          <p className="text-sm text-muted">
            Prefer to browse first?{" "}
            <Link href="/opportunities" className="font-semibold text-primary hover:underline">
              Explore other opportunities
            </Link>
            .
          </p>
        </div>
      ) : null}

      {phase === "deep" && deep.length ? (
        <QuestionStep
          question={{ ...deep[step], why: whyDeep(opportunity) }}
          value={draft.deepAnswers[deep[step].id] ?? ""}
          onChange={(value) =>
            setDraft((current) => ({ ...current, deepAnswers: { ...current.deepAnswers, [deep[step].id]: value } }))
          }
          index={step}
          total={deep.length}
          alreadyKnown={0}
          deepLabel
          onBack={step > 0 ? () => setStep(step - 1) : () => setPhase("result")}
          onNext={advanceDeep}
          nextLabel={step === deep.length - 1 ? "See my deeper assessment" : "Next"}
        />
      ) : null}

      {phase === "deepResult" && result ? (
        <div className="space-y-5">
          <BasicResultView result={result} />
          <DeepResultView result={result} />
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                setPhase("deep");
                setStep(0);
              }}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-stone-200 transition hover:bg-[#FBF7F1]"
            >
              <Pencil size={15} aria-hidden="true" />
              Edit deeper answers
            </button>
            <button
              type="button"
              onClick={editAnswers}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-stone-200 transition hover:bg-[#FBF7F1]"
            >
              <Pencil size={15} aria-hidden="true" />
              Edit basic answers
            </button>
            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
            >
              <Sparkles size={15} aria-hidden="true" />
              Ask Disha about this
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function QuestionStep({
  question,
  value,
  onChange,
  index,
  total,
  alreadyKnown,
  onBack,
  onNext,
  nextLabel,
  deepLabel = false
}: {
  question: FlowQuestion;
  value: string;
  onChange: (value: string) => void;
  index: number;
  total: number;
  alreadyKnown: number;
  onBack?: () => void;
  onNext: () => void;
  nextLabel: string;
  deepLabel?: boolean;
}) {
  return (
    <section className="rounded-2xl bg-white p-6 shadow-soft ring-1 ring-stone-200 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-black uppercase tracking-[0.16em] text-[#9B6D55]">
          {deepLabel ? "Deeper assessment" : "Initial assessment"}
        </p>
        <p className="text-xs font-bold text-muted">
          Question {index + 1} of {total}
        </p>
      </div>

      <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-stone-200">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${Math.round(((index + 1) / total) * 100)}%` }}
        />
      </div>

      {!deepLabel && alreadyKnown > 0 ? (
        <p className="mt-3 text-xs font-semibold text-primary">
          Disha already has {alreadyKnown} of these {total} answers from earlier. You can change any of them.
        </p>
      ) : null}

      <h2 className="mt-5 font-serif text-2xl font-black leading-tight text-ink sm:text-3xl">{question.label}</h2>

      {question.freeText ? (
        <input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={question.placeholder}
          className="mt-5 h-12 w-full rounded-lg border border-stone-300 bg-white px-3.5 text-base text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        />
      ) : (
        <div className="mt-5 flex flex-wrap gap-2" role="radiogroup" aria-label={question.label}>
          {question.options.map((option) => (
            <button
              key={option}
              type="button"
              role="radio"
              aria-checked={value === option}
              onClick={() => onChange(option)}
              className={clsx(
                "min-h-11 rounded-lg px-3.5 py-2 text-sm font-semibold ring-1 transition",
                value === option
                  ? "bg-primary text-white ring-primary"
                  : "bg-white text-slate-700 ring-stone-200 hover:bg-[#FBF7F1]"
              )}
            >
              {option}
            </button>
          ))}
        </div>
      )}

      <details className="mt-5">
        <summary className="cursor-pointer text-xs font-bold text-primary">Why we're asking this</summary>
        <p className="mt-2 max-w-xl text-xs leading-5 text-muted">{question.why}</p>
      </details>

      <div className="mt-7 flex flex-wrap items-center gap-3">
        {onBack ? (
          <button
            type="button"
            onClick={onBack}
            className="inline-flex min-h-11 items-center gap-2 rounded-md px-3 py-2 text-sm font-bold text-slate-600 transition hover:bg-stone-100 hover:text-ink"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back
          </button>
        ) : null}
        <button
          type="button"
          onClick={onNext}
          className="inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700"
        >
          {nextLabel}
          <ArrowRight size={17} aria-hidden="true" />
        </button>
        {!value ? <span className="text-xs font-semibold text-muted">You can skip this and answer it later.</span> : null}
      </div>
    </section>
  );
}

function whyDeep(opportunity: Opportunity) {
  return `This question maps to one of the published selection criteria for ${opportunity.name}, so the answer changes how competitive Disha judges the application to be.`;
}

function readAnswer(core: CoreProfile, id: string) {
  if (id in core && id !== "qualifiers") return String(core[id as keyof CoreProfile] ?? "");
  return core.qualifiers[id] ?? "";
}

function writeAnswer(core: CoreProfile, id: string, value: string): CoreProfile {
  if (id in core && id !== "qualifiers") return { ...core, [id]: value };
  return { ...core, qualifiers: { ...core.qualifiers, [id]: value } };
}
