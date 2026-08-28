"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import { ArrowRight, Building2, FileWarning, Landmark, Search, WalletCards } from "lucide-react";
import { PrimaryLink } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { scholarships } from "@/lib/data";

const questions = [
  { id: "education", label: "Education level", options: ["Undergraduate", "Post-matric", "Diploma"] },
  { id: "state", label: "State", options: ["Delhi", "Maharashtra", "Tamil Nadu"] },
  { id: "institution", label: "Institution", options: ["ABC College", "Government College", "Private institute"] },
  { id: "income", label: "Household income", options: ["Below ₹2.5 lakh", "₹2.5-4.5 lakh", "Above ₹4.5 lakh"] },
  { id: "score", label: "Class 12 score", options: ["80% or above", "60-79%", "Below 60%"] }
];

export default function LandingPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState(false);
  const firstSelectRef = useRef<HTMLSelectElement | null>(null);
  const complete = questions.every((question) => answers[question.id]);
  const results = useMemo(() => scholarships, []);

  const focusEligibility = () => {
    setFocused(true);
    firstSelectRef.current?.focus();
  };

  return (
    <div className="-mx-4 -mt-12 bg-[#FFF9F3] px-4 pb-16 pt-12 sm:-mx-6 sm:-mt-14 sm:px-6 sm:pt-14 lg:-mx-8 lg:px-8">
      <section className="grid min-h-[68vh] items-center gap-12 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#D97762]">A clearer scholarship journey</p>
          <h1 className="mt-4 max-w-3xl text-4xl font-bold leading-[1.04] tracking-normal text-ink sm:text-6xl">
            Know what you need to do, and what you&apos;re waiting on.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-muted">
            See scholarships you may qualify for, catch issues before you apply, and know who needs to act next, from your institution to verification and payment.
          </p>
          <p className="mt-5 text-sm font-semibold text-muted">A reimagined scholarship experience for the National Scholarship Portal</p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={focusEligibility}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/10 transition hover:bg-blue-900"
            >
              Check eligibility
              <ArrowRight size={18} />
            </button>
            <Link
              href="/scholarships"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-50"
            >
              Browse scholarships
            </Link>
            <Link href="/dashboard" className="text-sm font-semibold text-muted underline-offset-4 hover:text-primary hover:underline">
              Try sample profile
            </Link>
          </div>
        </div>

        <EligibilityPanel
          answers={answers}
          complete={complete}
          focused={focused}
          results={results}
          firstSelectRef={firstSelectRef}
          onAnswer={(id, value) => setAnswers((current) => ({ ...current, [id]: value }))}
        />
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-[#D97762]">How Disha helps</p>
          <h2 className="mt-3 max-w-sm text-3xl font-bold leading-tight text-ink">
            The scholarship journey is easier when ownership is visible.
          </h2>
        </div>
        <div className="grid gap-x-12 gap-y-10 md:grid-cols-2">
          {[
            {
              title: "Find what fits",
              body: "See scholarships that match your circumstances and understand which eligibility rules you meet.",
              icon: Search
            },
            {
              title: "Know what is holding things up",
              body: "See missing documents, institution requirements and other issues before they become unexpected delays.",
              icon: FileWarning
            },
            {
              title: "Know who acts next",
              body: "Understand whether the next step belongs to you, your institution, a verification authority, PFMS or your bank.",
              icon: Building2
            },
            {
              title: "Track it through payment",
              body: "Follow your scholarship after approval until the payment reaches your account.",
              icon: WalletCards
            }
          ].map((item, index) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className={index === 1 ? "md:pt-8" : ""}>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm ring-1 ring-stone-200">
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{item.body}</p>
                {index === 2 ? <div className="mt-4 h-1 w-20 rounded-full bg-[#D97762]" /> : null}
              </article>
            );
          })}
        </div>
      </section>

      <p className="mt-16 border-t border-stone-200 pt-6 text-xs leading-5 text-muted">
        Hackathon prototype using simulated scholarship and application data. Not affiliated with the National Scholarship Portal.
      </p>
    </div>
  );
}

function EligibilityPanel({
  answers,
  complete,
  focused,
  results,
  firstSelectRef,
  onAnswer
}: {
  answers: Record<string, string>;
  complete: boolean;
  focused: boolean;
  results: typeof scholarships;
  firstSelectRef: React.RefObject<HTMLSelectElement | null>;
  onAnswer: (id: string, value: string) => void;
}) {
  return (
    <div className="rounded-[1.5rem] bg-white p-6 shadow-[0_22px_70px_rgba(56,40,28,0.12)] ring-1 ring-stone-200">
      <div className={focused ? "rounded-[1.15rem] ring-2 ring-[#D97762]/25" : ""}>
        <div className="p-1">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF4EC] text-[#D97762]">
              <Landmark size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">{complete ? "3 scholarships may match you" : "Check scholarship eligibility"}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {complete
                  ? "These results use your education, income and institution details to explain fit and next steps."
                  : "Answer a few basic questions to see which scholarships may fit your profile and why. No login required."}
              </p>
            </div>
          </div>

          {!complete ? (
            <div className="mt-6 space-y-4">
              {questions.map((question, index) => (
                <label key={question.id} className="block">
                  <span className="mb-2 block text-sm font-semibold text-ink">{question.label}</span>
                  <select
                    ref={index === 0 ? firstSelectRef : undefined}
                    value={answers[question.id] ?? ""}
                    onChange={(event) => onAnswer(question.id, event.target.value)}
                    className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink"
                  >
                    <option value="">Select</option>
                    {question.options.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </label>
              ))}
            </div>
          ) : (
            <div className="mt-6 space-y-4 state-pop">
              {results.map((scholarship) => (
                <div key={scholarship.id} className="rounded-lg bg-stone-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-bold text-ink">{scholarship.title}</h3>
                    <StatusBadge tone={scholarship.status === "Eligible" ? "success" : scholarship.status === "Needs information" ? "warning" : "neutral"}>
                      {scholarship.status === "Not eligible" ? "Not eligible" : scholarship.status}
                    </StatusBadge>
                  </div>
                  <p className="mt-2 text-sm leading-6 text-muted">{scholarship.explanation}</p>
                </div>
              ))}
              <PrimaryLink href="/dashboard">Try sample profile</PrimaryLink>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
