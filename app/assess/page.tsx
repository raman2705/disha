"use client";

import { FormEvent, useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, FileText, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState, type NormalAssessmentDraft } from "@/components/AppContext";
import { opportunities } from "@/lib/opportunities";

const opportunityChoices = opportunities.filter((opportunity) => ["Scholarships", "Fellowships", "Research Grants", "Startup Funding", "Government Schemes"].includes(opportunity.category)).slice(0, 8);

export default function NormalAssessPage() {
  const { normalAssessment, setNormalAssessment, setAssistantOpen } = useAppState();
  const [draft, setDraft] = useState<NormalAssessmentDraft>(normalAssessment);
  const selectedOpportunity = useMemo(() => opportunityChoices.find((item) => item.id === draft.opportunityId) ?? opportunityChoices[0], [draft.opportunityId]);
  const readiness = readinessLabel(draft);
  const generated = draft.generated;

  const submit = (event: FormEvent) => {
    event.preventDefault();
    const nextDraft = { ...draft, opportunityId: selectedOpportunity.id, generated: true };
    setDraft(nextDraft);
    setNormalAssessment(nextDraft);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Get started" title="Assess an opportunity in a few minutes.">
        Add just enough profile and evidence context for Disha to give you a useful first read.
      </PageHeader>

      <section className="grid gap-8 lg:grid-cols-[0.48fr_0.52fr]">
        <form onSubmit={submit} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-2xl font-black text-ink">Your basics</h2>
          <div className="mt-6 space-y-4">
            <Field label="Name" value={draft.name} onChange={(value) => setDraft((current) => ({ ...current, name: value }))} placeholder="Your name" />
            <Field label="Institution" value={draft.institution} onChange={(value) => setDraft((current) => ({ ...current, institution: value }))} placeholder="College, lab, incubator or organisation" />
            <Field label="Programme or role" value={draft.programme} onChange={(value) => setDraft((current) => ({ ...current, programme: value }))} placeholder="B.Tech CSE, founder, researcher..." />
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Gender" value={draft.gender} onChange={(value) => setDraft((current) => ({ ...current, gender: value }))} placeholder="Optional" />
              <Field label="Income band" value={draft.income} onChange={(value) => setDraft((current) => ({ ...current, income: value }))} placeholder="e.g. Rs 3.5 lakh/year" />
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink">Opportunity</span>
              <select
                value={draft.opportunityId}
                onChange={(event) => setDraft((current) => ({ ...current, opportunityId: event.target.value }))}
                className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {opportunityChoices.map((opportunity) => (
                  <option key={opportunity.id} value={opportunity.id}>{opportunity.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-7 border-t border-stone-100 pt-5">
            <h3 className="text-base font-black text-ink">Evidence you can confirm now</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <EvidenceToggle label="Identity details" checked={draft.evidence.identity} onChange={(value) => setDraft((current) => ({ ...current, evidence: { ...current.evidence, identity: value } }))} />
              <EvidenceToggle label="Academic / role proof" checked={draft.evidence.academic} onChange={(value) => setDraft((current) => ({ ...current, evidence: { ...current.evidence, academic: value } }))} />
              <EvidenceToggle label="Income proof" checked={draft.evidence.income} onChange={(value) => setDraft((current) => ({ ...current, evidence: { ...current.evidence, income: value } }))} />
              <EvidenceToggle label="Bank details" checked={draft.evidence.bank} onChange={(value) => setDraft((current) => ({ ...current, evidence: { ...current.evidence, bank: value } }))} />
            </div>
          </div>

          <button type="submit" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700">
            Generate assessment
            <ArrowRight size={17} />
          </button>
        </form>

        <section className="rounded-lg bg-[#FFFCF8] p-6 ring-1 ring-stone-200">
          <p className="text-xs font-black uppercase tracking-normal text-muted">First read</p>
          <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-ink">
            {generated ? readiness.headline : "Tell Disha what you already have."}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            {generated
              ? readiness.body
              : "You can test Disha without using the guided demo. This creates a lightweight assessment saved in your browser."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Eligibility" value={generated ? readiness.eligibility : "Pending"} tone={generated ? "success" : "neutral"} />
            <Metric label="Fit" value={generated ? readiness.fit : "Pending"} tone={generated ? "active" : "neutral"} />
            <Metric label="Readiness" value={generated ? readiness.readiness : "Pending"} tone={generated ? readiness.tone : "neutral"} />
          </div>

          {generated ? (
            <div className="mt-7 rounded-md bg-white p-4 shadow-sm ring-1 ring-stone-100">
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 text-primary" size={20} />
                <div>
                  <h3 className="text-lg font-black text-ink">Biggest thing to fix</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{readiness.next}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => setAssistantOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white">
                  <Sparkles size={17} />
                  Ask Disha
                </button>
                <details className="rounded-md bg-[#FBF7F1] px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-stone-200">
                  <summary className="cursor-pointer">Why?</summary>
                  <p className="mt-3 max-w-xl font-normal leading-6">{readiness.why}</p>
                </details>
              </div>
            </div>
          ) : null}
        </section>
      </section>
    </div>
  );
}

function Field({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (value: string) => void; placeholder: string }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15" />
    </label>
  );
}

function EvidenceToggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-md bg-[#FBF7F1] px-3 py-2 text-sm font-bold text-slate-700 ring-1 ring-stone-100">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-4 w-4 accent-primary" />
      {label}
    </label>
  );
}

function Metric({ label, value, tone }: { label: string; value: string; tone: "success" | "active" | "warning" | "neutral" }) {
  return (
    <div className="rounded-md bg-white p-3 shadow-sm ring-1 ring-stone-100">
      <p className="text-xs font-bold uppercase tracking-normal text-muted">{label}</p>
      <div className="mt-2">
        <StatusBadge tone={tone}>{value}</StatusBadge>
      </div>
    </div>
  );
}

function readinessLabel(draft: NormalAssessmentDraft) {
  const evidenceCount = Object.values(draft.evidence).filter(Boolean).length;
  const hasBasics = Boolean(draft.name && draft.institution && draft.programme);
  if (!hasBasics) {
    return {
      headline: "Add a little more before judging fit.",
      body: "Disha needs your institution and programme to make the first assessment meaningful.",
      eligibility: "Unknown",
      fit: "Unknown",
      readiness: "Low",
      tone: "warning" as const,
      next: "Add your institution and programme first.",
      why: "Without those basics, Disha cannot map your profile to the opportunity requirements."
    };
  }
  if (evidenceCount >= 3) {
    return {
      headline: "Promising match. One check may remain.",
      body: "Your basics and several evidence items are present. Disha can now help you decide what to improve before applying.",
      eligibility: "Likely",
      fit: "Good",
      readiness: draft.evidence.income ? "Moderate" : "Needs proof",
      tone: draft.evidence.income ? "active" as const : "warning" as const,
      next: draft.evidence.income ? "Confirm the official application requirements before submission." : "Add or refresh income proof before you submit.",
      why: "The assessment separates profile fit from submission readiness, so missing proof does not erase a good underlying fit."
    };
  }
  return {
    headline: "Worth checking, but evidence is thin.",
    body: "Disha has enough to start, but not enough to be confident. Add two or three concrete proof items next.",
    eligibility: "Unknown",
    fit: "Possible",
    readiness: "Low",
    tone: "warning" as const,
    next: "Add academic or role proof, income proof and bank details.",
    why: "A useful assessment depends on evidence, not just profile claims."
  };
}
