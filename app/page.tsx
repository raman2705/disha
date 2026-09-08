"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import clsx from "clsx";
import { ArrowRight, Search } from "lucide-react";
import { CompassMark, DishaWordmark } from "@/components/DishaMark";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { getOpportunity } from "@/lib/opportunities";

const quickStarts = [
  { label: "Scholarships", category: "Scholarships" },
  { label: "Fellowships", category: "Fellowships" },
  { label: "Research grants", category: "Research Grants" },
  { label: "Startup funding", category: "Startup Funding" },
  { label: "Government programs", category: "Government Schemes" }
];

const stages = [
  { label: "Discover", body: "Find opportunities worth your time.", detail: "Ranked by whether preparing is worth it, not by how many exist." },
  { label: "Assess", body: "Eligibility and fit, kept separate.", detail: "Hard rules first, then how competitive the application would be." },
  { label: "Prepare", body: "See what is ready and what is missing.", detail: "Each blocker names the evidence it needs and who checks it." },
  { label: "Apply", body: "Submit with what Disha already holds.", detail: "A review of prefilled answers rather than a retyping exercise." },
  { label: "Track", body: "Know who owns the next move.", detail: "Through verification, payment and renewal, including why things stall." }
];

const journey = [
  { id: "discover", label: "Discover", body: "Find relevant opportunities" },
  { id: "assess", label: "Assess", body: "Understand your fit" },
  { id: "apply", label: "Apply", body: "Get help with next steps" }
];

/** The one opportunity shown as a worked example. Read from the catalogue so it stays truthful. */
const sample = getOpportunity("pmrf");

export default function LandingPage() {
  const router = useRouter();
  const { startGuidedDemo } = useAppState();
  const [query, setQuery] = useState("");

  const explore = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = query.trim();
    router.push(trimmed ? `/opportunities?q=${encodeURIComponent(trimmed)}` : "/opportunities");
  };

  const walkThroughDemo = () => {
    startGuidedDemo();
    router.push("/demo");
  };

  // No 100vw anywhere on this page: vw units include the scrollbar gutter, which made the page
  // scroll sideways by a few pixels on desktops with classic scrollbars. The paper background
  // already comes from body, so the old full-bleed wrapper was not needed for it.
  return (
    <div className="-mt-12 sm:-mt-14">
      <div className="mx-auto max-w-5xl pb-20">
        <section className="pt-12 sm:pt-16 lg:pt-20">
          <DishaWordmark size="lg" settle />

          <h1 className="landing-rise mt-9 max-w-3xl font-serif text-[2.75rem] font-black leading-[1.04] tracking-tight text-ink sm:text-6xl lg:text-[4.25rem]">
            Where do you want to go next?
          </h1>

          <p className="landing-rise landing-rise-1 mt-6 max-w-2xl text-lg leading-8 text-slate-700">
            Explore scholarships, fellowships, grants, funding and more, with Disha helping you assess your fit and
            navigate the journey from discovery to application.
          </p>

          <form onSubmit={explore} className="landing-rise landing-rise-2 mt-9 max-w-4xl" role="search">
            <label htmlFor="landing-search" className="sr-only">
              Describe the opportunity you are looking for
            </label>
            <div className="flex flex-col gap-2 rounded-2xl bg-white p-2 shadow-soft ring-1 ring-stone-200 transition focus-within:ring-2 focus-within:ring-primary/40 sm:flex-row sm:items-center sm:gap-1 sm:rounded-full sm:p-1.5 sm:pl-5">
              <div className="flex min-w-0 flex-1 items-center gap-3 px-3 sm:px-0 sm:pr-4">
                <Search size={19} className="shrink-0 text-muted" aria-hidden="true" />
                <input
                  id="landing-search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Try: psychology research fellowships for final-year students"
                  className="min-h-12 w-full min-w-0 bg-transparent text-base text-ink outline-none placeholder:text-muted/80"
                />
              </div>
              <button
                type="submit"
                className="inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-black text-white transition hover:bg-blue-700 sm:rounded-full"
              >
                Explore opportunities
                <ArrowRight size={17} aria-hidden="true" />
              </button>
            </div>
          </form>

          <div className="landing-rise landing-rise-3 mt-4">
            <button
              type="button"
              onClick={walkThroughDemo}
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-bold text-ink shadow-sm ring-1 ring-stone-300 transition hover:bg-white hover:ring-stone-400"
            >
              <CompassMark size={17} className="text-ink" />
              See a sample journey
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <p className="mt-2 text-xs leading-5 text-muted">
              Walks through one student's full path, from discovery to renewal. No sign-up.
            </p>
          </div>

          <div className="landing-rise landing-rise-3 mt-5 flex flex-wrap items-center gap-2">
            {quickStarts.map((item) => (
              <Link
                key={item.category}
                href={`/opportunities?category=${encodeURIComponent(item.category)}`}
                className="rounded-full border border-stone-200 bg-white/70 px-3.5 py-1.5 text-sm font-semibold text-slate-600 transition hover:border-stone-300 hover:bg-white hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <section id="how-it-works" className="landing-rise landing-rise-4 pt-16 sm:pt-20">
          <div className="relative">
            <span
              aria-hidden="true"
              className="journey-rail absolute left-[16.667%] right-[16.667%] top-[9px] hidden h-px origin-left bg-stone-300 sm:block"
            />

            <ol className="relative grid gap-6 sm:grid-cols-3 sm:gap-6">
              {journey.map((step, index) => {
                const isAssess = step.id === "assess";
                return (
                  <li key={step.id} className="relative flex items-start gap-4 sm:block sm:text-center">
                    {index < journey.length - 1 ? (
                      // Stacked layout: join this dot to the next one across the 24px grid gap.
                      <span aria-hidden="true" className="absolute -bottom-6 left-[8.5px] top-[18px] w-px bg-stone-300 sm:hidden" />
                    ) : null}
                    <span className="flex h-[18px] w-[18px] shrink-0 items-center justify-center sm:mx-auto">
                      {isAssess ? (
                        <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full bg-[#DDE3FA]">
                          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
                        </span>
                      ) : (
                        <span className="h-2.5 w-2.5 rounded-full border-[1.5px] border-stone-400 bg-paper" />
                      )}
                    </span>
                    <div className="sm:mt-3.5">
                      <h2
                        className={clsx(
                          "leading-none",
                          isAssess ? "text-lg font-black text-ink" : "text-base font-bold text-slate-600"
                        )}
                      >
                        {step.label}
                      </h2>
                      <p className={clsx("mt-1.5 text-sm leading-6", isAssess ? "text-slate-700" : "text-muted")}>
                        {step.body}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
        </section>

        <section id="how-disha-works" className="landing-rise landing-rise-5 scroll-mt-8 pt-16 sm:pt-20">
          <h2 className="font-serif text-3xl font-black leading-tight text-ink">How Disha works</h2>
          <p className="mt-2 max-w-2xl text-base leading-7 text-slate-700">
            Five stages, one thread. Most applicants lose an opportunity somewhere between deciding to apply and
            getting paid, so Disha stays with the application the whole way.
          </p>
          <ol className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {stages.map((stage, index) => (
              <li key={stage.label} className="rounded-xl bg-white p-4 shadow-sm ring-1 ring-stone-200">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#DDE3FA] text-xs font-black text-primary">
                    {index + 1}
                  </span>
                  <h3 className="text-sm font-black text-ink">{stage.label}</h3>
                </div>
                <p className="mt-2.5 text-sm leading-6 text-slate-700">{stage.body}</p>
                <p className="mt-2 text-xs leading-5 text-muted">{stage.detail}</p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="sample-heading" className="landing-rise landing-rise-5 pt-16 sm:pt-20">
          <h2 id="sample-heading" className="text-sm font-black uppercase tracking-[0.18em] text-[#9B6D55]">
            What an assessment looks like
          </h2>

          <article className="mt-5 max-w-2xl rounded-2xl bg-white p-6 shadow-soft ring-1 ring-stone-200 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="inline-flex items-center gap-2 rounded-full border border-dashed border-[#C9A896] bg-[#FDF4EE] px-3 py-1 text-xs font-black uppercase tracking-wider text-[#8F5139]">
                Sample assessment
              </span>
              <span className="text-xs font-bold text-muted">{sample?.category ?? "Fellowships"}</span>
            </div>

            <h3 className="mt-4 font-serif text-3xl font-black leading-tight text-ink">
              {sample?.name ?? "Prime Minister's Research Fellowship"}
            </h3>
            <p className="mt-1 text-sm font-semibold text-muted">{sample?.provider ?? "Ministry of Education"}</p>

            <div className="mt-4">
              <StatusBadge tone="success">Strong fit</StatusBadge>
            </div>

            <dl className="mt-6 space-y-5 border-t border-stone-100 pt-5">
              <div>
                <dt className="text-xs font-black uppercase tracking-wider text-muted">Why this fits</dt>
                <dd className="mt-1.5 text-sm leading-6 text-slate-700">
                  In this example, research experience and academic background align with important parts of the
                  opportunity.
                </dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase tracking-wider text-muted">What matters</dt>
                <dd className="mt-2">
                  <ul className="flex flex-wrap gap-2">
                    {["Research experience", "Academic match", "Proposal strength"].map((item) => (
                      <li
                        key={item}
                        className="rounded-md bg-[#FBF7F1] px-2.5 py-1 text-xs font-semibold text-slate-700"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </dd>
              </div>
              <div>
                <dt className="text-xs font-black uppercase tracking-wider text-muted">Next step</dt>
                <dd className="mt-1.5 text-sm leading-6 text-slate-700">
                  Review your evidence and application requirements.
                </dd>
              </div>
            </dl>

            <p className="mt-6 border-t border-stone-100 pt-4 text-xs leading-5 text-muted">
              Example only. It is not an assessment of you. Disha builds your own from details you provide.
            </p>
          </article>

          <div className="mt-5 max-w-2xl">
            <Link href="/assess" className="inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline">
              Assess an opportunity
              <ArrowRight size={15} aria-hidden="true" />
            </Link>
            <button
              type="button"
              onClick={walkThroughDemo}
              className="mt-2.5 block text-left text-sm font-semibold text-muted underline underline-offset-4 transition hover:text-ink"
            >
              Or walk through the full journey with a sample profile
            </button>
          </div>
        </section>

        <footer id="about" className="landing-rise landing-rise-5 mt-16 scroll-mt-8 border-t border-stone-200 pt-8 sm:mt-20">
          <div className="flex max-w-2xl items-start gap-4">
            <CompassMark size={32} className="mt-0.5 hidden text-ink sm:block" />
            <div>
              <h2 className="text-sm font-black uppercase tracking-wide text-muted">About Disha</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Disha means direction. Searching is the easy part; the hard part is knowing whether an opportunity is
                worth your time and what to fix before you apply. Disha brings opportunities together, separates formal
                eligibility from the evidence that selectors actually weigh, and stays with you through the steps that
                follow.
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
