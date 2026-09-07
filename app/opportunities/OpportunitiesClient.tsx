"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import clsx from "clsx";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { translations } from "@/lib/i18n";
import { categoryDefinitions, opportunities, OpportunityCategory } from "@/lib/opportunities";

const allCategory = "All";

export default function OpportunitiesClient({ initialCategory, initialQuery }: { initialCategory: string; initialQuery: string }) {
  const { language } = useAppState();
  const t = translations[language];
  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState<OpportunityCategory | typeof allCategory>(
    initialCategory && categoryDefinitions.some((item) => item.name === initialCategory) ? (initialCategory as OpportunityCategory) : allCategory
  );
  const [status, setStatus] = useState("All");

  const shown = useMemo(() => {
    const categoryFiltered = opportunities.filter((opportunity) => {
      const categoryMatch = category === allCategory || opportunity.category === category;
      const statusMatch = status === "All" || opportunity.status === status;
      return categoryMatch && statusMatch;
    });
    const matches = categoryFiltered.filter((opportunity) => {
      const text = `${opportunity.name} ${opportunity.provider} ${opportunity.targetApplicant} ${opportunity.tags.join(" ")} ${opportunity.description}`.toLowerCase();
      const queryMatch = !query || queryMatchesOpportunity(query, text, opportunity.category);
      return queryMatch;
    });
    return matches;
  }, [category, query, status]);

  return (
    <div>
      <PageHeader eyebrow="Explore opportunities" title="Find the route before you apply">
        Search across scholarships, research grants, fellowships, startup funding and public schemes. Disha separates access, eligibility, evidence strength and readiness.
      </PageHeader>

      <section className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-stone-200">
        <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
          <label>
            <span className="sr-only">Search opportunities</span>
            <div className="flex min-h-11 items-center gap-2 rounded-md border border-stone-300 px-3">
              <Search size={18} className="text-muted" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by program, provider, profile or evidence"
                className="min-h-10 flex-1 bg-transparent text-sm text-ink outline-none"
              />
            </div>
          </label>
          <label className="flex items-center gap-2 text-sm font-semibold text-muted">
            <SlidersHorizontal size={17} />
            Status
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value)}
              className="h-11 rounded-md border border-stone-300 bg-white px-3 text-sm font-semibold text-ink outline-none focus:border-primary focus:ring-2 focus:ring-primary/15"
            >
              {["All", "Open", "Upcoming", "Rolling"].map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
            </select>
          </label>
          <Link href="/opportunities/startup-india-seed-fund/assess" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700">
            {t.assessment.assess}
            <ArrowRight size={17} />
          </Link>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" role="list" aria-label="Opportunity category filters">
          {[allCategory, ...categoryDefinitions.map((item) => item.name)].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item as OpportunityCategory | typeof allCategory)}
              className={clsx(
                "min-h-9 rounded-md border px-3 py-1.5 text-sm font-semibold transition",
                category === item ? "border-primary bg-primary text-white" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              )}
            >
              {item === allCategory ? "All" : t.categories[item as OpportunityCategory]}
            </button>
          ))}
        </div>
      </section>

      <section className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-lg bg-[#EEF2FF] p-4">
        <div>
          <h2 className="text-lg font-bold text-ink">{shown.length} opportunities</h2>
          <p className="mt-1 text-sm text-muted">
            {shown.length ? "Each opportunity includes access requirements, eligibility checks, readiness evidence and evaluator signals where available." : "No exact matches. Try removing a filter or using a broader search term."}
          </p>
        </div>
        <StatusBadge tone="active">5 categories</StatusBadge>
      </section>

      {shown.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {shown.map((opportunity) => (
          <article key={opportunity.id} className="flex min-h-72 flex-col rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-md bg-[#F7E8DC] px-3 py-1 text-xs font-bold text-[#8F5139]">{t.categories[opportunity.category]}</span>
              <span className="rounded-md bg-stone-100 px-3 py-1 text-xs font-bold text-muted">{opportunity.status}</span>
            </div>
            <h2 className="mt-4 font-serif text-2xl font-bold leading-tight text-ink">{opportunity.name}</h2>
            <p className="mt-1 text-sm font-semibold text-muted">{opportunity.provider}</p>
            <p className="mt-3 text-sm leading-6 text-slate-700">{opportunity.description}</p>
            <div className="mt-4 grid gap-2 text-sm">
              <p><span className="font-semibold text-ink">For:</span> {opportunity.targetApplicant}</p>
              <p><span className="font-semibold text-ink">Benefit:</span> {opportunity.funding}</p>
              <p><span className="font-semibold text-ink">Deadline:</span> {opportunity.deadline}</p>
            </div>
            <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
              <div className="flex flex-wrap gap-2">
                {opportunity.tags.slice(0, 3).map((tag) => (
                  <span key={tag} className="rounded-full bg-[#FBF7F1] px-2.5 py-1 text-xs font-semibold text-muted">{tag}</span>
                ))}
              </div>
              <Link href={`/opportunities/${opportunity.id}`} className="inline-flex items-center gap-2 text-sm font-bold text-primary">
                Open
                <ArrowRight size={16} />
              </Link>
            </div>
          </article>
          ))}
        </div>
      ) : (
        <section className="rounded-lg bg-white p-8 text-center shadow-sm ring-1 ring-stone-200">
          <h2 className="font-serif text-2xl font-bold text-ink">No exact matches</h2>
          <p className="mt-2 text-sm leading-6 text-muted">Try removing a filter or searching for a broader category such as scholarship, startup, fellowship or research.</p>
        </section>
      )}
    </div>
  );
}

function queryMatchesOpportunity(query: string, text: string, category: OpportunityCategory) {
  const lower = query.toLowerCase();
  const tokens = lower
    .replace(/[^a-z0-9]+/g, " ")
    .split(" ")
    .filter((token) => token.length > 2 && !["for", "the", "and", "with", "what", "you", "are"].includes(token));

  const intentMatches =
    (/(startup|startups|founder|seed|early|entrepreneur)/.test(lower) && category === "Startup Funding") ||
    (/(phd|research|climate|science|faculty|grant|grants)/.test(lower) && (category === "Research Grants" || category === "Fellowships")) ||
    (/(scholarship|scholarships|ug|undergraduate|student|students)/.test(lower) && category === "Scholarships") ||
    (/(scheme|schemes|government|msme|loan|public)/.test(lower) && category === "Government Schemes");

  return intentMatches || tokens.some((token) => text.includes(token));
}
