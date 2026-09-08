"use client";

import Link from "next/link";
import { ArrowRight, BookOpen, FileCheck2, HelpCircle, Landmark } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { useAppState } from "@/components/AppContext";
import { translations } from "@/lib/i18n";
import { getOpportunity } from "@/lib/opportunities";

/**
 * Resources are written for Disha as a whole, not for one scheme. When a journey is actually in
 * progress the page names that opportunity; otherwise it stays category-neutral rather than
 * talking about a scholarship to somebody assessing startup funding.
 */
export default function ResourcesPage() {
  const { language, guidedDemoActive, guidedDemoOpportunityId, normalAssessment } = useAppState();
  const t = translations[language].resources;

  const activeId = guidedDemoActive ? guidedDemoOpportunityId : normalAssessment.opportunityId;
  const active = activeId ? getOpportunity(activeId) : undefined;

  const resources = [
    {
      title: t.accessTitle,
      body: t.accessBody,
      icon: HelpCircle,
      href: active ? `/opportunities/${active.id}` : "/opportunities"
    },
    {
      title: t.evidenceTitle,
      body: t.evidenceBody,
      icon: FileCheck2,
      href: active ? `/opportunities/${active.id}/assess` : "/assess"
    },
    {
      title: t.trackingTitle,
      body: t.trackingBody,
      icon: BookOpen,
      href: "/applications"
    },
    {
      title: t.categoriesTitle,
      body: t.categoriesBody,
      icon: Landmark,
      href: "/opportunities"
    }
  ];

  return (
    <div>
      <PageHeader eyebrow={t.eyebrow} title={t.title}>
        {active ? `${t.contextual} ${active.name}.` : t.generic}
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Link
              key={resource.title}
              href={resource.href}
              className="group rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-soft"
            >
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F7E8DC] text-[#8F5139]">
                <Icon size={21} />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-ink">{resource.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{resource.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                {t.open}
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
