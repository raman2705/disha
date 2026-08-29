"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { ArrowRight, Building2, FileWarning, Landmark, Search, WalletCards } from "lucide-react";
import { StatusBadge } from "@/components/StatusBadge";
import { evaluateScholarships, isCoreProfileComplete, MatchProfile } from "@/lib/matching";

const questions = [
  { id: "education", label: "Current education level", options: ["Class 9-10", "Class 11-12", "Diploma", "Undergraduate", "Postgraduate", "Professional / Technical degree", "Research / PhD"] },
  { id: "domicile", label: "State / domicile", options: [] },
  { id: "income", label: "Household income", options: ["Below ₹1 lakh", "₹1-2.5 lakh", "₹2.5-4.5 lakh", "₹4.5-6 lakh", "₹6-8 lakh", "Above ₹8 lakh"] },
  { id: "score", label: "Academic performance", options: ["90%+", "80-89%", "70-79%", "60-69%", "Below 60%"] }
];

const statesAndUnionTerritories = [
  "Andaman and Nicobar Islands",
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chandigarh",
  "Chhattisgarh",
  "Dadra and Nagar Haveli and Daman and Diu",
  "Delhi",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jammu and Kashmir",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Ladakh",
  "Lakshadweep",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Puducherry",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal"
];

const optionalQuestions = [
  { id: "institution", label: "Institution", options: ["ABC College", "Government College", "Private institute", "Technical institute", "Agricultural university"] },
  { id: "institutionType", label: "Institution type", options: ["Government / aided", "Private", "AICTE-approved", "Top class institution"] },
  { id: "course", label: "Course / discipline", options: ["Economics", "Engineering", "Medicine", "Agriculture", "Veterinary", "Fisheries"] },
  { id: "yearOfStudy", label: "Year of study", options: ["Year 1", "Year 2", "Year 3", "Year 4", "Final year"] },
  { id: "category", label: "Category", options: ["General", "SC", "ST", "OBC", "EBC", "DNT"] },
  { id: "gender", label: "Gender", options: ["Female", "Male", "Other"] },
  { id: "disability", label: "Disability status", options: ["Yes", "No"] },
  { id: "minority", label: "Minority/community criterion", options: ["Yes", "No"] },
  { id: "hosteller", label: "Hosteller / day scholar", options: ["Hosteller", "Day scholar"] },
  { id: "existingScholarship", label: "Existing scholarship", options: ["No", "Yes"] },
  { id: "renewalStatus", label: "Renewal status", options: ["Fresh", "Renewal"] }
];

export default function LandingPage() {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [focused, setFocused] = useState(false);
  const firstSelectRef = useRef<HTMLSelectElement | null>(null);
  const complete = isCoreProfileComplete(answers);

  const focusEligibility = () => {
    setFocused(true);
    firstSelectRef.current?.focus();
  };

  return (
    <div className="-mx-4 -mt-12 bg-paper px-4 pb-16 pt-12 sm:-mx-6 sm:-mt-14 sm:px-6 sm:pt-14 lg:-mx-8 lg:px-8">
      <section className="grid min-h-[68vh] items-center gap-12 py-8 lg:grid-cols-[1.02fr_0.98fr] lg:py-12">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-accent">A clearer scholarship journey</p>
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
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-950/10 transition hover:bg-blue-700"
            >
              Check eligibility
              <ArrowRight size={18} />
            </button>
            <Link
              href="/scholarships"
              className="inline-flex min-h-12 items-center justify-center rounded-md bg-white px-5 py-3 text-sm font-semibold text-primary shadow-sm transition hover:bg-[#EEF2FF]"
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
          firstSelectRef={firstSelectRef}
          onAnswer={(id, value) => setAnswers((current) => ({ ...current, [id]: value }))}
        />
      </section>

      <section className="mt-12 grid gap-10 lg:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-accent">How Disha helps</p>
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
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-primary shadow-sm">
                  <Icon size={20} />
                </div>
                <h3 className="text-xl font-bold text-ink">{item.title}</h3>
                <p className="mt-2 max-w-sm text-sm leading-6 text-muted">{item.body}</p>
                {index === 2 ? <div className="mt-4 h-1 w-20 rounded-full bg-accent" /> : null}
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
  firstSelectRef,
  onAnswer
}: {
  answers: MatchProfile;
  complete: boolean;
  focused: boolean;
  firstSelectRef: React.RefObject<HTMLSelectElement | null>;
  onAnswer: (id: string, value: string) => void;
}) {
  const [moreDetails, setMoreDetails] = useState(false);
  const evaluated = complete ? evaluateScholarships(answers) : [];
  const bestMatches = evaluated.filter((item) => item.state === "recommended");
  const couldMatch = evaluated.filter((item) => item.state === "could").slice(0, 4);
  const categoryPrompt = complete && couldMatch.some((item) => item.missing.includes("category"));
  const scoreQuestionLabel =
    answers.education === "Postgraduate" || answers.education === "Research / PhD"
      ? "Latest academic performance"
      : answers.education === "Undergraduate" || answers.education === "Professional / Technical degree"
        ? "Class 12 percentage"
        : "Academic performance";

  return (
    <div className="rounded-[1.1rem] bg-white p-6 shadow-soft">
      <div className={focused ? "rounded-[1rem] ring-2 ring-accent/25" : ""}>
        <div className="p-1">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#FFF3DD] text-accent">
              <Landmark size={20} />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-ink">
                {complete ? `${bestMatches.length} scholarships match your profile` : "Check scholarship eligibility"}
              </h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {complete
                  ? "Based on the information you provided."
                  : "Answer a few basic questions to see which scholarships may fit your profile and why. No login required."}
              </p>
            </div>
          </div>

          {!complete ? (
            <div className="mt-6 space-y-4">
              {questions.map((question, index) => (
                <DishaField
                  key={question.id}
                  id={question.id}
                  label={question.id === "score" ? scoreQuestionLabel : question.label}
                  options={question.id === "domicile" ? statesAndUnionTerritories : question.options}
                  value={answers[question.id as keyof MatchProfile] ?? ""}
                  inputMode={question.id === "domicile" ? "search" : "select"}
                  selectRef={index === 0 ? firstSelectRef : undefined}
                  onAnswer={onAnswer}
                />
              ))}
              <button
                type="button"
                onClick={() => setMoreDetails((value) => !value)}
                className="rounded-md text-sm font-bold text-primary underline-offset-4 outline-none hover:underline focus-visible:ring-2 focus-visible:ring-primary/20"
              >
                {moreDetails ? "Hide more details" : "+ Add more details for better matches"}
              </button>
              {moreDetails ? (
                <div className="grid gap-4 rounded-xl bg-[#FBF7F1] p-4 sm:grid-cols-2">
                  {optionalQuestions.map((question) => (
                    <DishaField
                      key={question.id}
                      id={question.id}
                      label={question.label}
                      options={question.options}
                      value={answers[question.id as keyof MatchProfile] ?? ""}
                      onAnswer={onAnswer}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ) : (
            <div className="mt-6 space-y-4 state-pop">
              <section>
                <h3 className="text-sm font-bold uppercase tracking-normal text-muted">Best matches</h3>
                <div className="mt-3 space-y-3">
                  {bestMatches.slice(0, 3).map((result) => (
                    <EligibilityResultCard key={result.scholarship.id} result={result} />
                  ))}
                </div>
              </section>
              {couldMatch.length ? (
                <section>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="text-sm font-bold uppercase tracking-normal text-muted">Could match</h3>
                    {categoryPrompt ? (
                      <button type="button" onClick={() => setMoreDetails(true)} className="text-sm font-bold text-primary">
                        Add category
                      </button>
                    ) : null}
                  </div>
                  <div className="mt-3 space-y-3">
                    {couldMatch.map((result) => (
                      <EligibilityResultCard key={result.scholarship.id} result={result} />
                    ))}
                  </div>
                </section>
              ) : null}
              {moreDetails ? (
                <div className="grid gap-4 rounded-xl bg-[#FBF7F1] p-4 sm:grid-cols-2">
                  {optionalQuestions.slice(0, 8).map((question) => (
                    <DishaField
                      key={question.id}
                      id={question.id}
                      label={question.label}
                      options={question.options}
                      value={answers[question.id as keyof MatchProfile] ?? ""}
                      onAnswer={onAnswer}
                    />
                  ))}
                </div>
              ) : null}
              <p className="rounded-lg bg-[#EEF2FF] p-3 text-xs leading-5 text-muted">
                Eligibility shown here is a simplified prototype assessment based on the information provided. Confirm final scheme rules before applying.
              </p>
              <Link href="/scholarships" className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                Explore other scholarships <ArrowRight size={16} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DishaField({
  id,
  label,
  options,
  value,
  inputMode = "select",
  selectRef,
  onAnswer
}: {
  id: string;
  label: string;
  options: string[];
  value: string;
  inputMode?: "select" | "search";
  selectRef?: React.RefObject<HTMLSelectElement | null>;
  onAnswer: (id: string, value: string) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {inputMode === "search" ? (
        <>
          <input
            list={`${id}-options`}
            value={value}
            onChange={(event) => onAnswer(id, event.target.value)}
            placeholder="Search or select"
            className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
          />
          <datalist id={`${id}-options`}>
            {options.map((option) => (
              <option key={option} value={option} />
            ))}
          </datalist>
        </>
      ) : (
        <select
          ref={selectRef}
          value={value}
          onChange={(event) => onAnswer(id, event.target.value)}
          className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
        >
          <option value="">Select</option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      )}
    </label>
  );
}

function EligibilityResultCard({ result }: { result: ReturnType<typeof evaluateScholarships>[number] }) {
  return (
    <article className="rounded-[1rem] bg-[#FBF7F1] p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h4 className="font-bold text-ink">{result.scholarship.title}</h4>
          <p className="mt-1 text-sm font-semibold text-primary">{result.scholarship.amount}</p>
        </div>
        <StatusBadge tone={result.state === "recommended" ? "success" : "warning"}>
          {result.state === "recommended" ? "Eligible" : `${result.missing.length} more detail${result.missing.length === 1 ? "" : "s"} needed`}
        </StatusBadge>
      </div>
      <div className="mt-3 grid gap-2 sm:grid-cols-2">
        {result.evidence.slice(0, 3).map((item) => (
          <div key={`${result.scholarship.id}-${item.label}`} className={item.result === "warning" ? "text-xs font-semibold text-amber-900" : "text-xs font-semibold text-slate-700"}>
            <p>{item.result === "warning" ? "○" : "✓"} {item.label}: {item.value}</p>
            <p className="mt-0.5 font-medium text-muted">{item.requirement}</p>
          </div>
        ))}
      </div>
      <Link href={`/scholarships/${result.scholarship.id}`} className="mt-3 inline-flex text-sm font-semibold text-primary">
        {result.state === "recommended" ? "View details" : `Complete ${result.missing.length} detail${result.missing.length === 1 ? "" : "s"}`}
      </Link>
    </article>
  );
}
