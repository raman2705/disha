import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, FileText, Route, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { getAssessmentAvailability, getOpportunity, opportunities } from "@/lib/opportunities";

export function generateStaticParams() {
  return opportunities.map((opportunity) => ({ id: opportunity.id }));
}

export default async function OpportunityDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const opportunity = getOpportunity(id);

  if (!opportunity) {
    notFound();
  }
  const assessment = getAssessmentAvailability(opportunity);

  return (
    <div>
      <Link href="/opportunities" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={17} />
        Back to opportunities
      </Link>

      <PageHeader eyebrow={opportunity.category} title={opportunity.name}>
        <div className="flex flex-wrap gap-3 pt-2">
          <StatusBadge tone={opportunity.status === "Open" || opportunity.status === "Rolling" ? "success" : "warning"}>{opportunity.status}</StatusBadge>
          <span className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-ink">{opportunity.provider}</span>
          <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-900">{opportunity.deadline}</span>
          <span className="rounded-md border border-indigo-200 bg-indigo-50 px-3 py-1 text-sm font-semibold text-primary">{assessmentLabel(assessment.availability)}</span>
        </div>
      </PageHeader>

      <section className="mb-7 grid gap-6 lg:grid-cols-[0.64fr_0.36fr]">
        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="font-serif text-3xl font-bold text-ink">Can you actually access this?</h2>
          <p className="mt-3 text-base leading-7 text-slate-700">{opportunity.description}</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            <InfoList title="Access route" icon={<Route size={20} />} items={opportunity.access} />
            <InfoList title="Eligibility gates" icon={<CheckCircle2 size={20} />} items={opportunity.eligibility} />
            <InfoList title="Readiness packet" icon={<FileText size={20} />} items={opportunity.readiness} />
          </div>
        </article>

        <aside className="rounded-lg bg-[#FBF3EA] p-6 ring-1 ring-stone-200">
          <p className="text-xs font-bold uppercase tracking-normal text-muted">Disha view</p>
            <h2 className="mt-2 font-serif text-2xl font-bold text-ink">Score evidence, not adjectives.</h2>
          <p className="mt-3 text-sm leading-6 text-slate-700">
            {assessment.note}
          </p>
          <Link href={`/opportunities/${opportunity.id}/assess`} className="mt-6 inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">
            Assess with Disha
            <ArrowRight size={17} />
          </Link>
        </aside>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.58fr_0.42fr]">
        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="font-serif text-2xl font-bold text-ink">Opportunity summary</h2>
          <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="font-semibold text-muted">Target applicant</dt>
              <dd className="mt-1 font-bold text-ink">{opportunity.targetApplicant}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Funding / benefit</dt>
              <dd className="mt-1 font-bold text-ink">{opportunity.funding}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Opportunity stage</dt>
              <dd className="mt-1 font-bold text-ink">{opportunity.stage}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Current application state</dt>
              <dd className="mt-1 font-bold text-ink">{opportunity.applicationStatus ?? "Not started"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Source / reference</dt>
              <dd className="mt-1 font-bold text-ink">{opportunity.officialSource ?? "Reference not attached in demo data"}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Tags</dt>
              <dd className="mt-1 font-bold text-ink">{opportunity.tags.join(", ")}</dd>
            </div>
          </dl>
        </article>

        <article className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="font-serif text-2xl font-bold text-ink">Application steps</h2>
          <div className="mt-4 space-y-3">
            {(opportunity.applicationSteps?.length ? opportunity.applicationSteps : [
              { label: "Review eligibility", owner: "Student" },
              { label: "Prepare documents", owner: "Student" },
              { label: "Submit through official route", owner: "Applicant / institution" }
            ]).map((step) => (
              <div key={`${step.label}-${step.owner}`} className="rounded-md bg-[#FBF7F1] p-3 text-sm">
                <p className="font-bold text-ink">{step.label}</p>
                <p className="mt-1 text-muted">Owner: {step.owner}{step.status ? ` · ${step.status}` : ""}</p>
              </div>
            ))}
          </div>
        </article>

        <article id="assistant" className="rounded-lg bg-[#F6F5FF] p-6 ring-1 ring-indigo-100 lg:col-span-2">
          <div className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-primary shadow-sm">
              <Sparkles size={19} />
            </span>
            <div>
              <h2 className="font-serif text-2xl font-bold text-ink">Ask Disha Assistant</h2>
              <p className="mt-2 text-sm leading-6 text-muted">This page knows you are viewing {opportunity.name}.</p>
            </div>
          </div>
          <div className="mt-5 space-y-2">
            {["Am I eligible?", "Is this worth my time?", "What documents will I need?"].map((question) => (
              <Link key={question} href={`/opportunities/${opportunity.id}/assess?ask=${encodeURIComponent(question)}`} className="block rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-[#EEF2FF]">
                {question}
              </Link>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}

function assessmentLabel(level: "full" | "partial" | "discovery") {
  if (level === "full") return "Full assessment";
  if (level === "partial") return "Partial assessment";
  return "Discovery only";
}

function InfoList({ title, icon, items }: { title: string; icon: React.ReactNode; items: string[] }) {
  return (
    <section className="rounded-lg bg-[#FBF7F1] p-4">
      <div className="flex items-center gap-2 text-primary">
        {icon}
        <h3 className="font-bold text-ink">{title}</h3>
      </div>
      <ul className="mt-3 space-y-2 text-sm leading-5 text-slate-700">
        {items.slice(0, 4).map((item) => (
          <li key={item} className="flex gap-2">
            <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
            {item}
          </li>
        ))}
      </ul>
    </section>
  );
}
