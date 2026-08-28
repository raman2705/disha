"use client";

import { useMemo, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { ScholarshipCard } from "@/components/ScholarshipCard";
import { scholarships } from "@/lib/data";
import clsx from "clsx";
import { PrimaryLink } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";

const filters = ["All", "Eligible", "Needs information", "Not eligible"] as const;

export default function ScholarshipsPage() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [personalised, setPersonalised] = useState(false);
  const ordered = useMemo(
    () => (personalised ? [...scholarships].sort((a, b) => (a.status === "Eligible" ? -1 : b.status === "Eligible" ? 1 : 0)) : scholarships),
    [personalised]
  );
  const shown = useMemo(() => (filter === "All" ? ordered : ordered.filter((item) => item.status === filter)), [filter, ordered]);

  return (
    <div>
      <PageHeader title={personalised ? "Scholarships matched to you" : "Explore scholarships"}>
        {personalised
          ? "The system now understands your education, income and institution. Results have been reordered and personalised."
          : "Browse available scholarships without a profile, then check whether a scheme fits you."}
      </PageHeader>

      <div className="mb-6 flex flex-wrap gap-2" role="list" aria-label="Scholarship filters">
        {filters.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={clsx(
              "min-h-10 rounded-md border px-4 py-2 text-sm font-semibold transition",
              filter === item
                ? "border-primary bg-primary text-white"
                : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {!personalised ? (
        <section className="mb-6 rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-bold text-ink">Browse first, personalise when ready</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
            Before profile completion, each scholarship shows amount, deadline and core criteria.
          </p>
          <div className="mt-5 space-y-3">
            {shown.map((scholarship) => (
              <article key={scholarship.id} className="grid gap-4 border-b border-stone-100 pb-4 last:border-b-0 md:grid-cols-[1fr_auto] md:items-center">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="font-bold text-ink">{scholarship.title}</h3>
                    <span className="text-sm font-semibold text-primary">{scholarship.amount}</span>
                    <span className="text-sm text-muted">Deadline {scholarship.deadline}</span>
                  </div>
                  <p className="mt-2 text-sm text-muted">Core criteria: {scholarship.criteria.join(", ")}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setPersonalised(true)}
                  className="inline-flex min-h-10 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
                >
                  Check if I qualify
                </button>
              </article>
            ))}
          </div>
        </section>
      ) : (
        <div className="mb-6 rounded-xl bg-indigo-50 p-5 ring-1 ring-indigo-100 state-pop">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <StatusBadge tone="active">Personalised</StatusBadge>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                Recommendations now include exact reasons, missing information and eligibility status.
              </p>
            </div>
            <PrimaryLink href="/dashboard">Try with sample profile</PrimaryLink>
          </div>
        </div>
      )}

      {personalised ? (
        <div className="space-y-4 state-pop" key={filter}>
          {shown.map((scholarship) => (
            <ScholarshipCard key={scholarship.id} scholarship={scholarship} />
          ))}
        </div>
      ) : null}
    </div>
  );
}
