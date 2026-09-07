"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { ArrowRight, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { scholarships, ScholarshipLevel } from "@/lib/data";
import { evaluateScholarships, sampleEligibilityProfile, sortMatches } from "@/lib/matching";

const primaryFilters = ["All", "School", "Diploma", "Undergraduate", "Postgraduate", "Research"] as const;
const sortOptions = ["Best fit", "Deadline", "Amount"] as const;

export default function ScholarshipsPage() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState<(typeof primaryFilters)[number]>("All");
  const [sort, setSort] = useState<(typeof sortOptions)[number]>("Best fit");
  const [personalised, setPersonalised] = useState(false);
  const [moreFiltersOpen, setMoreFiltersOpen] = useState(false);
  const [moreFilters, setMoreFilters] = useState({
    domicile: "All",
    scope: "All",
    schemeType: "All",
    course: "All",
    category: "All",
    gender: "All",
    disability: "All",
    minority: "All",
    institutionType: "All",
    score: "All",
    income: "All",
    cycle: "All"
  });

  const profile = useMemo(() => sampleEligibilityProfile(), []);
  const evaluated = useMemo(() => evaluateScholarships(profile), [profile]);
  const personalisedResults = useMemo(() => sortMatches(evaluated, sort), [evaluated, sort]);

  const shown = useMemo(() => {
    const base = personalised ? personalisedResults.map((result) => result.scholarship) : sortScholarshipList(scholarships, sort);
    return base.filter((scholarship) => {
      const text = `${scholarship.title} ${scholarship.provider} ${scholarship.criteria.join(" ")}`.toLowerCase();
      const queryMatch = !query || text.includes(query.toLowerCase());
      const levelMatch = level === "All" || scholarship.level.some((item) => item === level);
      const domicileMatch = moreFilters.domicile === "All" || scholarship.applicability.includes(moreFilters.domicile) || scholarship.applicability === "All India";
      const scopeMatch = moreFilters.scope === "All" || scholarship.scope === moreFilters.scope;
      const typeMatch = moreFilters.schemeType === "All" || scholarship.schemeType.includes(moreFilters.schemeType);
      const courseMatch = moreFilters.course === "All" || scholarship.rules.courses?.includes(moreFilters.course) || !scholarship.rules.courses;
      const categoryMatch = moreFilters.category === "All" || scholarship.rules.categories?.includes(moreFilters.category) || !scholarship.rules.categories;
      const genderMatch = moreFilters.gender === "All" || scholarship.rules.genders?.includes(moreFilters.gender) || !scholarship.rules.genders;
      const disabilityMatch = moreFilters.disability === "All" || (moreFilters.disability === "Yes" ? scholarship.rules.disabilityRequired : !scholarship.rules.disabilityRequired);
      const minorityMatch = moreFilters.minority === "All" || (moreFilters.minority === "Yes" ? scholarship.rules.minorityRequired : !scholarship.rules.minorityRequired);
      const institutionTypeMatch = moreFilters.institutionType === "All" || scholarship.rules.institutionTypes?.includes(moreFilters.institutionType) || !scholarship.rules.institutionTypes;
      const scoreMatch = moreFilters.score === "All" || !scholarship.rules.scoreMin || scoreFilterAllows(moreFilters.score, scholarship.rules.scoreMin);
      const incomeMatch = moreFilters.income === "All" || !scholarship.rules.incomeMaxLakh || incomeFilterAllows(moreFilters.income, scholarship.rules.incomeMaxLakh);
      const cycleMatch = moreFilters.cycle === "All" || scholarship.cycle.includes(moreFilters.cycle);
      return queryMatch && levelMatch && domicileMatch && scopeMatch && typeMatch && courseMatch && categoryMatch && genderMatch && disabilityMatch && minorityMatch && institutionTypeMatch && scoreMatch && incomeMatch && cycleMatch;
    });
  }, [level, moreFilters, personalised, personalisedResults, query]);

  const resultById = new Map(personalisedResults.map((result) => [result.scholarship.id, result]));
  const counts = {
    recommended: personalisedResults.filter((result) => result.state === "recommended").length,
    could: personalisedResults.filter((result) => result.state === "could").length
  };

  return (
    <div>
      <PageHeader title={personalised ? "Scholarships matched to you" : "Explore scholarships"}>
        {personalised
          ? `${counts.recommended} recommended and ${counts.could} could match with more details. Known-ineligible schemes stay browseable, but are not counted as matches.`
          : "Browse a fuller catalogue of scholarship references, then personalise the list when you are ready."}
      </PageHeader>

      <section className="mb-5 rounded-[1rem] bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label>
            <span className="sr-only">Search scholarships</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search scholarships"
              className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-muted">
            Sort
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as (typeof sortOptions)[number])}
              className="h-11 rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              {sortOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
          <button
            type="button"
            onClick={() => setMoreFiltersOpen(true)}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-stone-200 bg-white px-4 py-2 text-sm font-bold text-ink transition hover:bg-[#FBF7F1]"
          >
            <SlidersHorizontal size={17} />
            More filters
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Scholarship level filters">
          {primaryFilters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setLevel(item)}
              className={clsx(
                "min-h-9 rounded-md border px-3 py-1.5 text-sm font-semibold transition",
                level === item ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[1rem] bg-[#EEF2FF] p-4">
        <div>
          <h2 className="text-lg font-bold text-ink">{shown.length} scholarships</h2>
          <p className="mt-1 text-sm text-muted">
            {personalised ? "Disha now knows which schemes are relevant to this sample student." : "General criteria are shown before profile personalisation."}
          </p>
        </div>
        {!personalised ? (
          <button
            type="button"
            onClick={() => setPersonalised(true)}
            className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Check eligibility
          </button>
        ) : (
          <StatusBadge tone="active">Personalised</StatusBadge>
        )}
      </section>

      <div className="space-y-3 state-pop">
        {shown.map((scholarship) => {
          const result = resultById.get(scholarship.id);
          const isIneligible = personalised && result?.state === "ineligible";

          return (
            <article key={scholarship.id} className="grid gap-4 rounded-[0.85rem] bg-white p-4 shadow-sm md:grid-cols-[1fr_auto] md:items-center">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="text-base font-bold text-ink">{scholarship.title}</h3>
                  {personalised && result ? (
                    <StatusBadge tone={result.state === "recommended" ? "success" : result.state === "could" ? "warning" : "neutral"}>
                      {result.state === "recommended" ? "Eligible" : result.state === "could" ? `${result.missing.length} detail needed` : "Browse only"}
                    </StatusBadge>
                  ) : null}
                  <span className="text-xs font-semibold text-muted">{scholarship.provider} · {scholarship.scope}</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  <span className="font-semibold text-primary">{scholarship.amount}</span>
                  <span className="text-muted">Deadline {scholarship.deadline}</span>
                  <span className="text-muted">{scholarship.level.join(", ")}</span>
                  <span className="text-muted">{scholarship.cycle}</span>
                </div>
                <p className="mt-2 text-sm leading-6 text-muted">{scholarship.criteria.slice(0, 3).join(", ")}.</p>
                {personalised && result && !isIneligible ? (
                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    {result.state === "recommended" ? "✓ " : "○ "}
                    {result.evidence[0]?.label}: {result.evidence[0]?.value}
                  </p>
                ) : null}
              </div>
              <Link
                href={`/scholarships/${scholarship.id}`}
                className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-3 py-2 text-sm font-bold text-primary ring-1 ring-indigo-100 transition hover:bg-[#EEF2FF]"
              >
                {personalised && result?.state === "could" ? "Complete detail" : "View criteria"}
                <ArrowRight size={16} />
              </Link>
            </article>
          );
        })}
      </div>

      {moreFiltersOpen ? (
        <div className="fixed inset-0 z-50 flex items-start justify-end bg-ink/20 p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="More filters">
          <section className="w-full max-w-md rounded-[1rem] bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between gap-4">
              <h2 className="text-xl font-bold text-ink">More filters</h2>
              <button type="button" onClick={() => setMoreFiltersOpen(false)} className="rounded-md p-2 text-muted hover:bg-[#FBF7F1]" aria-label="Close filters">
                <X size={18} />
              </button>
            </div>
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <FilterSelect label="State / domicile" value={moreFilters.domicile} options={["All", "Delhi", "Maharashtra", "Tamil Nadu", "North Eastern states"]} onChange={(value) => setMoreFilters((current) => ({ ...current, domicile: value }))} />
              <FilterSelect label="Central / State" value={moreFilters.scope} options={["All", "Central", "State"]} onChange={(value) => setMoreFilters((current) => ({ ...current, scope: value }))} />
              <FilterSelect label="Scheme type" value={moreFilters.schemeType} options={["All", "Merit-based", "Need-based", "Category-based", "Disability", "Regional"]} onChange={(value) => setMoreFilters((current) => ({ ...current, schemeType: value }))} />
              <FilterSelect label="Course / discipline" value={moreFilters.course} options={["All", "Engineering", "Agriculture", "Economics", "Veterinary", "Fisheries"]} onChange={(value) => setMoreFilters((current) => ({ ...current, course: value }))} />
              <FilterSelect label="Category" value={moreFilters.category} options={["All", "SC", "ST", "OBC", "EBC", "DNT"]} onChange={(value) => setMoreFilters((current) => ({ ...current, category: value }))} />
              <FilterSelect label="Gender" value={moreFilters.gender} options={["All", "Female", "Male", "Other"]} onChange={(value) => setMoreFilters((current) => ({ ...current, gender: value }))} />
              <FilterSelect label="Disability" value={moreFilters.disability} options={["All", "Yes", "No"]} onChange={(value) => setMoreFilters((current) => ({ ...current, disability: value }))} />
              <FilterSelect label="Minority/community criterion" value={moreFilters.minority} options={["All", "Yes", "No"]} onChange={(value) => setMoreFilters((current) => ({ ...current, minority: value }))} />
              <FilterSelect label="Institution type" value={moreFilters.institutionType} options={["All", "Government / aided", "Private", "AICTE-approved", "Top class institution"]} onChange={(value) => setMoreFilters((current) => ({ ...current, institutionType: value }))} />
              <FilterSelect label="Household income" value={moreFilters.income} options={["All", "Below ₹1 lakh", "₹1-2.5 lakh", "₹2.5-4.5 lakh", "₹4.5-6 lakh", "₹6-8 lakh"]} onChange={(value) => setMoreFilters((current) => ({ ...current, income: value }))} />
              <FilterSelect label="Academic score" value={moreFilters.score} options={["All", "90%+", "80-89%", "70-79%", "60-69%", "Below 60%"]} onChange={(value) => setMoreFilters((current) => ({ ...current, score: value }))} />
              <FilterSelect label="Fresh / Renewal" value={moreFilters.cycle} options={["All", "Fresh", "Renewal"]} onChange={(value) => setMoreFilters((current) => ({ ...current, cycle: value }))} />
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-10 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function incomeFilterAllows(value: string, maxLakh: number) {
  const rank: Record<string, number> = {
    "Below ₹1 lakh": 1,
    "₹1-2.5 lakh": 2.5,
    "₹2.5-4.5 lakh": 4.5,
    "₹4.5-6 lakh": 6,
    "₹6-8 lakh": 8
  };
  return rank[value] ? rank[value] <= maxLakh : true;
}

function scoreFilterAllows(value: string, minimum: number) {
  const rank: Record<string, number> = {
    "90%+": 90,
    "80-89%": 80,
    "70-79%": 70,
    "60-69%": 60,
    "Below 60%": 0
  };
  return rank[value] >= minimum;
}

function sortScholarshipList(items: typeof scholarships, sort: "Best fit" | "Deadline" | "Amount") {
  if (sort === "Deadline") {
    return [...items].sort((a, b) => deadlineRank(a.deadline) - deadlineRank(b.deadline));
  }

  if (sort === "Amount") {
    return [...items].sort((a, b) => amountRank(b.amount) - amountRank(a.amount));
  }

  return items;
}

function deadlineRank(deadline: string) {
  const day = Number.parseInt(deadline, 10);
  if (Number.isNaN(day)) return 99;
  return day;
}

function amountRank(amount: string) {
  const values = amount.match(/[0-9,]+/g)?.map((value) => Number(value.replace(/,/g, ""))) ?? [0];
  return Math.max(...values);
}
