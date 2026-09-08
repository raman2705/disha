"use client";

import { FormEvent, useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, CheckCircle2, FileText, Sparkles } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState, type NormalAssessmentDraft } from "@/components/AppContext";
import { opportunities } from "@/lib/opportunities";
import { finalizeNormalAssessment, resolveWorkingDraft } from "@/lib/normalAssessment";

const opportunityChoices = opportunities.filter((opportunity) => ["Scholarships", "Fellowships", "Research Grants", "Startup Funding", "Government Schemes"].includes(opportunity.category)).slice(0, 8);

export default function NormalAssessPage() {
  const { normalAssessment, setNormalAssessment, setAssistantOpen } = useAppState();
  const [draft, setDraft] = useState<NormalAssessmentDraft>(normalAssessment);
  const [notice, setNotice] = useState("");
  const edited = useRef(false);

  // Adopt the stored draft once AppProvider has hydrated it, but never over an edit in progress.
  useEffect(() => {
    setDraft((current) => resolveWorkingDraft(current, normalAssessment, edited.current));
  }, [normalAssessment]);
  const selectedOpportunity = useMemo(() => opportunityChoices.find((item) => item.id === draft.opportunityId) ?? opportunityChoices[0], [draft.opportunityId]);
  const assessmentResult = draft.generated && draft.assessmentResult?.opportunityId === selectedOpportunity.id ? draft.assessmentResult : null;
  const generated = Boolean(assessmentResult);

  const updateDraft = (updater: (current: NormalAssessmentDraft) => NormalAssessmentDraft) => {
    edited.current = true;
    setNotice("");
    setDraft((current) => ({ ...updater(current), generated: false, assessmentResult: null }));
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    edited.current = true;
    const missing = [
      draft.name.trim() ? "" : "name",
      draft.institution.trim() ? "" : "institution",
      draft.programme.trim() ? "" : "programme"
    ].filter(Boolean);
    if (missing.length) {
      setNotice(`Add ${missing.join(", ")} before generating the assessment.`);
      return;
    }
    const nextDraft = finalizeNormalAssessment(draft, selectedOpportunity);
    setDraft(nextDraft);
    setNormalAssessment(nextDraft);
    setNotice(`Assessment saved for ${selectedOpportunity.name}.`);
  };

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader eyebrow="Get started" title="Assess an opportunity in a few minutes.">
        Add just enough profile and evidence context for Disha to give you a useful first read.
      </PageHeader>

      <section className="grid gap-8 lg:grid-cols-[0.48fr_0.52fr]">
        <form onSubmit={submit} className="rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-2xl font-black text-ink">About you</h2>
          <div className="mt-6 space-y-4">
            <Field label="Name" value={draft.name} onChange={(value) => updateDraft((current) => ({ ...current, name: value }))} placeholder="Your name" />
            <Field label="Institution" value={draft.institution} onChange={(value) => updateDraft((current) => ({ ...current, institution: value }))} placeholder="College, lab, incubator or organisation" />
            <Field label="Programme or role" value={draft.programme} onChange={(value) => updateDraft((current) => ({ ...current, programme: value }))} placeholder="B.Tech CSE, founder, researcher..." />
            <div className="grid gap-4 sm:grid-cols-2">
              <SelectField label="Current status" value={draft.currentStatus} options={["", "student", "working", "researcher", "founder", "other"]} onChange={(value) => updateDraft((current) => ({ ...current, currentStatus: value as NormalAssessmentDraft["currentStatus"] }))} />
              <Field label="City / state" value={draft.city} onChange={(value) => updateDraft((current) => ({ ...current, city: value }))} placeholder="Bengaluru, Karnataka" />
              <Field label="Gender" value={draft.gender} onChange={(value) => updateDraft((current) => ({ ...current, gender: value }))} placeholder="Optional" />
              <Field label="Income band" value={draft.income} onChange={(value) => updateDraft((current) => ({ ...current, income: value }))} placeholder="e.g. Rs 3.5 lakh/year" />
            </div>
            <label className="block">
              <span className="mb-2 block text-sm font-bold text-ink">Opportunity</span>
              <select
                value={selectedOpportunity.id}
                onChange={(event) => updateDraft((current) => ({ ...current, opportunityId: event.target.value }))}
                className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15"
              >
                {opportunityChoices.map((opportunity) => (
                  <option key={opportunity.id} value={opportunity.id}>{opportunity.name}</option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-7 border-t border-stone-100 pt-5">
            <h3 className="text-base font-black text-ink">Education & work</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <Field label="Highest qualification" value={draft.highestQualification} onChange={(value) => updateDraft((current) => ({ ...current, highestQualification: value }))} placeholder="Undergraduate, PG, PhD..." />
              <Field label="Field / discipline" value={draft.field} onChange={(value) => updateDraft((current) => ({ ...current, field: value }))} placeholder="Engineering, design, biology..." />
              <Field label="CGPA / percentage" value={draft.cgpa} onChange={(value) => updateDraft((current) => ({ ...current, cgpa: value }))} placeholder="8.2 CGPA or 82%" />
              <SelectField label="Work / project experience" value={draft.workExperience} options={["", "none", "under 6 months", "6-12 months", "1-2 years", "2-5 years", "5+ years"]} onChange={(value) => updateDraft((current) => ({ ...current, workExperience: value as NormalAssessmentDraft["workExperience"] }))} />
              <SelectField label="Ownership" value={draft.ownership} options={["", "mainly assisted", "owned individual tasks", "owned a project/workstream", "led multiple projects/team"]} onChange={(value) => updateDraft((current) => ({ ...current, ownership: value as NormalAssessmentDraft["ownership"] }))} />
              <SelectField label="Measurable outcomes" value={draft.measurableOutcomes} options={["", "yes", "no", "unsure"]} onChange={(value) => updateDraft((current) => ({ ...current, measurableOutcomes: value as NormalAssessmentDraft["measurableOutcomes"] }))} />
            </div>
          </div>

          <div className="mt-7 border-t border-stone-100 pt-5">
            <h3 className="text-base font-black text-ink">What you have done</h3>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <SelectField label="Research experience" value={draft.researchExperience} options={["", "no", "coursework project", "research internship", "thesis/dissertation", "independent research", "multiple research experiences"]} onChange={(value) => updateDraft((current) => ({ ...current, researchExperience: value as NormalAssessmentDraft["researchExperience"] }))} />
              <SelectField label="Leadership" value={draft.leadership} options={["", "no", "informally", "led a small project/team", "held a formal leadership role", "led significant teams/programs"]} onChange={(value) => updateDraft((current) => ({ ...current, leadership: value as NormalAssessmentDraft["leadership"] }))} />
              <SelectField label="Largest team / group" value={draft.largestTeam} options={["", "1-5", "6-10", "11-25", "25+"]} onChange={(value) => updateDraft((current) => ({ ...current, largestTeam: value as NormalAssessmentDraft["largestTeam"] }))} />
              <SelectField label="Leadership duration" value={draft.leadershipDuration} options={["", "one-off", "under 3 months", "3-12 months", "1+ year"]} onChange={(value) => updateDraft((current) => ({ ...current, leadershipDuration: value as NormalAssessmentDraft["leadershipDuration"] }))} />
              <SelectField label="Impact / volunteering" value={draft.impactExperience} options={["", "none", "occasional volunteering", "regular volunteering", "led an initiative", "built/ran sustained program"]} onChange={(value) => updateDraft((current) => ({ ...current, impactExperience: value as NormalAssessmentDraft["impactExperience"] }))} />
              <SelectField label="Startup stage" value={draft.startupStage} options={["", "none", "exploring idea", "idea validated", "prototype/MVP", "active users", "revenue", "funded/incubated"]} onChange={(value) => updateDraft((current) => ({ ...current, startupStage: value as NormalAssessmentDraft["startupStage"] }))} />
            </div>
            <MultiToggle label="Research outputs" values={["report", "poster", "conference presentation", "preprint", "publication", "patent", "dataset/tool"]} selected={draft.researchOutputs} onChange={(researchOutputs) => updateDraft((current) => ({ ...current, researchOutputs }))} />
          </div>

          <div className="mt-7 border-t border-stone-100 pt-5">
            <h3 className="text-base font-black text-ink">What you are looking for</h3>
            <MultiToggle label="Goals" values={["financial support", "research experience", "higher education", "career exposure", "international opportunity", "startup funding", "mentorship", "recognition", "social impact", "network"]} selected={draft.goals} onChange={(goals) => updateDraft((current) => ({ ...current, goals }))} />
            <MultiToggle label="Opportunity interests" values={["scholarships", "fellowships", "research grants", "startup funding", "government programs"]} selected={draft.opportunityInterests} onChange={(opportunityInterests) => updateDraft((current) => ({ ...current, opportunityInterests }))} />
            <div className="mt-4">
              <SelectField label="Application effort tolerance" value={draft.effortTolerance} options={["", "quick applications only", "a few hours", "several days", "willing to invest significant effort for a strong opportunity"]} onChange={(value) => updateDraft((current) => ({ ...current, effortTolerance: value as NormalAssessmentDraft["effortTolerance"] }))} />
            </div>
          </div>

          <div className="mt-7 border-t border-stone-100 pt-5">
            <h3 className="text-base font-black text-ink">Evidence you can confirm now</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <EvidenceToggle label="Identity details" checked={draft.evidence.identity} onChange={(value) => updateDraft((current) => ({ ...current, evidence: { ...current.evidence, identity: value } }))} />
              <EvidenceToggle label="Academic / role proof" checked={draft.evidence.academic} onChange={(value) => updateDraft((current) => ({ ...current, evidence: { ...current.evidence, academic: value } }))} />
              <EvidenceToggle label="Income proof" checked={draft.evidence.income} onChange={(value) => updateDraft((current) => ({ ...current, evidence: { ...current.evidence, income: value } }))} />
              <EvidenceToggle label="Bank details" checked={draft.evidence.bank} onChange={(value) => updateDraft((current) => ({ ...current, evidence: { ...current.evidence, bank: value } }))} />
            </div>
          </div>

          <button type="submit" className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white transition hover:bg-blue-700">
            Generate assessment
            <ArrowRight size={17} />
          </button>
          {notice ? <p className="mt-4 text-sm font-bold text-primary" aria-live="polite">{notice}</p> : null}
        </form>

        <section className="rounded-lg bg-[#FFFCF8] p-6 ring-1 ring-stone-200">
          <p className="text-xs font-black uppercase tracking-normal text-muted">First read</p>
          <h2 className="mt-3 font-serif text-4xl font-black leading-tight text-ink">
            {generated ? assessmentHeadline(assessmentResult!) : "Tell Disha what you already have."}
          </h2>
          <p className="mt-4 text-sm leading-6 text-slate-700">
            {generated
              ? assessmentResult!.overallAssessment
              : "You can test Disha without using the guided demo. This creates a lightweight assessment saved in your browser."}
          </p>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            <Metric label="Eligibility" value={generated ? sentenceCase(assessmentResult!.eligibility.status) : "Pending"} tone={generated ? eligibilityTone(assessmentResult!.eligibility.status) : "neutral"} />
            <Metric label="Competitive fit" value={generated ? competitiveFitValue(assessmentResult!) : "Pending"} tone={generated ? bandTone(assessmentResult!.competitiveness.band) : "neutral"} />
            <Metric label="Confidence" value={generated ? sentenceCase(assessmentResult!.confidence.level) : "Pending"} tone={generated ? confidenceTone(assessmentResult!.confidence.level) : "neutral"} />
          </div>

          {generated ? (
            <div className="mt-7 rounded-md bg-white p-4 shadow-sm ring-1 ring-stone-100">
              <StatusBadge tone={recommendationTone(assessmentResult!.recommendationKey)}>{assessmentResult!.recommendationLabel}</StatusBadge>
              <div className="flex items-start gap-3">
                <FileText className="mt-0.5 text-primary" size={20} />
                <div>
                  <h3 className="text-lg font-black text-ink">Biggest thing to fix</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-700">{assessmentResult!.nextAction}</p>
                </div>
              </div>
              <div className="mt-5 flex flex-wrap gap-3">
                <button type="button" onClick={() => setAssistantOpen(true)} className="inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-black text-white">
                  <Sparkles size={17} />
                  Ask Disha
                </button>
                <details className="rounded-md bg-[#FBF7F1] px-4 py-2 text-sm font-bold text-slate-700 ring-1 ring-stone-200">
                  <summary className="cursor-pointer">Why?</summary>
                  <p className="mt-3 max-w-xl font-normal leading-6">{assessmentResult!.biggestGap?.whyItMatters ?? assessmentResult!.strongestEvidence}</p>
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

function SelectField({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-ink">{label}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/15">
        {options.map((option) => (
          <option key={option || `${label}-blank`} value={option}>{option || "Not provided yet"}</option>
        ))}
      </select>
    </label>
  );
}

function MultiToggle({ label, values, selected, onChange }: { label: string; values: string[]; selected: string[]; onChange: (values: string[]) => void }) {
  const toggle = (value: string) => {
    onChange(selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value]);
  };

  return (
    <div className="mt-4">
      <p className="mb-2 text-sm font-bold text-ink">{label}</p>
      <div className="flex flex-wrap gap-2">
        {values.map((value) => (
          <button
            key={value}
            type="button"
            onClick={() => toggle(value)}
            className={clsx("rounded-md px-3 py-2 text-xs font-bold ring-1", selected.includes(value) ? "bg-primary text-white ring-primary" : "bg-white text-slate-700 ring-stone-200")}
          >
            {value}
          </button>
        ))}
      </div>
    </div>
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

function assessmentHeadline(result: NonNullable<NormalAssessmentDraft["assessmentResult"]>) {
  if (result.recommendationKey === "strongly_pursue") return "Strong eligibility evidence. Ready to prepare.";
  if (result.recommendationKey === "worth_pursuing") return "Worth pursuing. Fix the key gap first.";
  if (result.recommendationKey === "pursue_after_improving") return "Worth checking after one improvement.";
  if (result.recommendationKey === "low_priority") return "Not enough evidence to prioritize yet.";
  if (result.recommendationKey === "verify_eligibility") return "Verify eligibility before investing effort.";
  if (result.recommendationKey === "insufficient_information") return "Add evidence before Disha estimates fit.";
  return "Check a hard requirement before continuing.";
}

function eligibilityTone(status: NonNullable<NormalAssessmentDraft["assessmentResult"]>["eligibility"]["status"]) {
  if (status === "eligible") return "success" as const;
  if (status === "ineligible") return "warning" as const;
  return "neutral" as const;
}

function bandTone(status: NonNullable<NormalAssessmentDraft["assessmentResult"]>["competitiveness"]["band"]) {
  if (status === "strong") return "success" as const;
  if (status === "competitive") return "active" as const;
  if (status === "developing" || status === "weak") return "warning" as const;
  return "neutral" as const;
}

function confidenceTone(status: NonNullable<NormalAssessmentDraft["assessmentResult"]>["confidence"]["level"]) {
  if (status === "high") return "success" as const;
  if (status === "medium") return "active" as const;
  return "warning" as const;
}

function competitiveFitValue(result: NonNullable<NormalAssessmentDraft["assessmentResult"]>) {
  return result.competitiveness.score === null ? sentenceCase(result.competitiveness.band) : `${result.competitiveness.score}/100`;
}

function sentenceCase(value: string) {
  return value.charAt(0).toUpperCase() + value.slice(1).replace(/_/g, " ");
}

function recommendationTone(recommendationKey: NonNullable<NormalAssessmentDraft["assessmentResult"]>["recommendationKey"]) {
  if (recommendationKey === "strongly_pursue" || recommendationKey === "worth_pursuing") return "success" as const;
  if (recommendationKey === "pursue_after_improving") return "active" as const;
  if (recommendationKey === "low_priority") return "neutral" as const;
  if (recommendationKey === "insufficient_information" || recommendationKey === "verify_eligibility") return "warning" as const;
  return "warning" as const;
}
