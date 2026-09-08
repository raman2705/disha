"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowRight, CheckCircle2, MinusCircle, Sparkles, TriangleAlert } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { localise, localiser } from "@/lib/hindi";
import { canonicalGuidedDemoOpportunityId, getGuidedDemoApplication, getGuidedDemoPaymentApplication, getGuidedDemoRenewalApplication, profile } from "@/lib/data";
import { getOpportunity } from "@/lib/opportunities";

const curated = [
  {
    id: "aicte-pragati-scholarship",
    state: "Worth pursuing",
    tone: "success",
    title: "Recommended next step",
    reason: "Ananya is a woman student in an AICTE-approved technical programme, with core academic and bank details ready.",
    evidence: ["Eligibility looks aligned", "Academic record is strong", "One document should be refreshed before applying"],
    cta: "See why",
    href: "/opportunities/aicte-pragati-scholarship/assess",
    icon: CheckCircle2
  },
  {
    id: "startup-india-seed-fund",
    state: "Promising",
    tone: "warning",
    title: "Has gaps",
    reason: "Her final-year project and research internship create a credible innovation story, but the application needs stronger independent evidence.",
    evidence: ["Prototype evidence exists", "Research evidence is moderate", "Biggest gap: independent research evidence"],
    cta: "Assess",
    href: "/opportunities/startup-india-seed-fund/assess",
    icon: TriangleAlert
  },
  {
    id: "top-class-sc-opportunity",
    state: "Not a fit",
    tone: "neutral",
    title: "Hard eligibility issue",
    reason: "This route is intended for SC students in notified institutions. Ananya's current profile does not show that eligibility requirement.",
    evidence: ["Profile category does not match", "Do not spend time here first", "Look for better-fit scholarships"],
    cta: "Why not?",
    href: "/opportunities/top-class-sc-opportunity/assess",
    icon: MinusCircle
  }
] as const;

export default function DemoDiscoverPage() {
  const { setGuidedDemoOpportunityId, setDemoState, language } = useAppState();
  const tr = localiser(language);
  const [primary, ...alternates] = localise(curated, language);
  const primaryOpportunity = getOpportunity(primary.id);

  useEffect(() => {
    setDemoState("discover");
  }, [setDemoState]);

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="Meet Ananya" title={tr("Start with the scholarship most worth preparing.")}>
        Final-year engineering student · 8.3 CGPA · research internship · final-year project
      </PageHeader>

      <section className="rounded-lg bg-[#FBF3EA] p-5 ring-1 ring-stone-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-2xl font-bold text-ink">{profile.name}</h2>
            <p className="mt-1 text-sm leading-6 text-slate-700">{profile.programme}, {profile.location}</p>
          </div>
          <div className="grid gap-2 text-sm text-slate-700 sm:grid-cols-3">
            <p className="rounded-md bg-white px-3 py-2 font-semibold shadow-sm">{profile.cgpa}</p>
            <p className="rounded-md bg-white px-3 py-2 font-semibold shadow-sm">Research internship</p>
            <p className="rounded-md bg-white px-3 py-2 font-semibold shadow-sm">Final-year project</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.35fr_0.65fr]">
        <article className="rounded-lg bg-white p-6 shadow-soft ring-1 ring-stone-200">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">{primaryOpportunity?.category ?? "Scholarship"}</p>
              <h2 className="mt-2 max-w-2xl font-serif text-3xl font-bold leading-tight text-ink">{primaryOpportunity?.name ?? primary.id}</h2>
              <p className="mt-2 text-sm font-bold text-primary">{primary.title}</p>
            </div>
            <StatusBadge tone={primary.tone}>{primary.state}</StatusBadge>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-700">{primary.reason}</p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            {primary.evidence.map((point) => (
              <p key={point} className="flex gap-2 rounded-md bg-[#FBF7F1] p-3 text-sm font-semibold leading-6 text-slate-700 ring-1 ring-stone-100">
                <Sparkles size={15} className="mt-1 shrink-0 text-primary" />
                {point}
              </p>
            ))}
          </div>
          <Link
            href={primary.href}
            onClick={() => setGuidedDemoOpportunityId(canonicalGuidedDemoOpportunityId)}
            className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700"
          >
            {primary.cta}
            <ArrowRight size={16} />
          </Link>
        </article>

        <aside className="space-y-3">
          <div className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-sm font-bold text-ink">Other matches Disha considered</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Useful context, but not the main guided path.</p>
          </div>
          {alternates.map((item) => {
          const opportunity = getOpportunity(item.id);
          const Icon = item.icon;
          const guidedApplication = getGuidedDemoApplication(item.id);
          const guidedPayment = getGuidedDemoPaymentApplication(item.id);
          const guidedRenewal = getGuidedDemoRenewalApplication(item.id);
          const hasFullDemoJourney = guidedApplication?.opportunityId === item.id && guidedPayment?.opportunityId === item.id && guidedRenewal?.opportunityId === item.id;
          const selectedOpportunityId = hasFullDemoJourney ? item.id : canonicalGuidedDemoOpportunityId;

          return (
            <article key={item.id} className="rounded-lg bg-white p-4 shadow-sm ring-1 ring-stone-200">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-9 w-9 items-center justify-center rounded-md bg-[#F7E8DC] text-[#8F5139]">
                  <Icon size={18} />
                </span>
                <StatusBadge tone={item.tone}>{item.state}</StatusBadge>
              </div>
              <p className="mt-4 text-xs font-bold uppercase tracking-normal text-muted">{opportunity?.category ?? "Opportunity"}</p>
              <h2 className="mt-1 font-serif text-xl font-bold leading-tight text-ink">{opportunity?.name ?? item.id}</h2>
              <p className="mt-2 text-sm font-bold text-primary">{item.title}</p>
              <p className="mt-3 text-sm leading-6 text-slate-700">{item.reason}</p>
              <Link
                href={item.href}
                onClick={() => setGuidedDemoOpportunityId(selectedOpportunityId)}
                className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary"
              >
                {item.cta}
                <ArrowRight size={16} />
              </Link>
            </article>
          );
        })}
        </aside>
      </section>

      <section className="rounded-lg bg-[#EEF2FF] p-4 ring-1 ring-indigo-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="font-serif text-xl font-bold text-ink">{tr("This is discovery with judgment.")}</h2>
            <p className="mt-1 text-sm leading-6 text-muted">Disha narrows the field before asking a student to invest time in an application.</p>
          </div>
          <Link href="/opportunities" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-white px-4 py-2 text-sm font-bold text-primary shadow-sm">
            Browse all opportunities
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
