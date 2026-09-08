"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, GraduationCap, Rocket } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { StatusBadge } from "@/components/StatusBadge";
import { useAppState } from "@/components/AppContext";
import { translations } from "@/lib/i18n";
import { canonicalGuidedDemoOpportunityId, demoApplications, getCanonicalApplicationForDemoState } from "@/lib/data";

const icons = {
  Scholarship: GraduationCap,
  "Research Grant": FlaskConical,
  "Startup Funding": Rocket
} as const;

export default function ApplicationsPage() {
  const { language, demoState, guidedDemoActive, normalAssessment } = useAppState();
  const t = translations[language];
  const normalResult = normalAssessment.assessmentResult;
  const canonicalApplication = getCanonicalApplicationForDemoState(demoState, canonicalGuidedDemoOpportunityId);
  const orderedApplications = [
    canonicalApplication,
    ...demoApplications.filter((application) => application.opportunityId !== canonicalGuidedDemoOpportunityId)
  ];

  if (!guidedDemoActive) {
    return (
      <div>
        <PageHeader eyebrow={t.nav.applications} title="No submitted applications yet">
          Start with an assessment. Disha will track ownership after you decide to apply.
        </PageHeader>
        <section className="mx-auto max-w-2xl rounded-lg bg-white p-7 shadow-sm ring-1 ring-stone-200">
          <h2 className="font-serif text-3xl font-bold text-ink">
            {normalResult ? "You have an assessment in progress" : "Assess an opportunity first."}
          </h2>
          {normalResult ? (
            <div className="mt-4 rounded-lg bg-[#FBF7F1] p-4">
              <p className="text-xs font-black uppercase tracking-wide text-muted">Assessment, not an application</p>
              <p className="mt-1.5 text-sm font-bold text-ink">{normalResult.opportunityName}</p>
              <p className="mt-1 text-sm leading-6 text-slate-700">
                {normalResult.recommendationLabel}. {normalResult.nextAction}
              </p>
            </div>
          ) : (
            <p className="mt-3 text-sm leading-6 text-muted">
              This keeps normal mode clean. The guided sample journey appears only when you choose the sample journey.
            </p>
          )}
          <Link href="/assess" className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-bold text-white">
            {normalResult ? "Continue this assessment" : "Start assessment"}
            <ArrowRight size={16} />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader eyebrow={t.nav.applications} title={language === "hi" ? "सभी सक्रिय आवेदन" : "All active applications"}>
        {language === "hi"
          ? "छात्रवृत्ति, शोध अनुदान और स्टार्टअप फंडिंग में कौन मालिक है, क्या रुका है और अगला कदम क्या है।"
          : "Track ownership, blockers and next steps across scholarship, research grant and startup funding applications."}
      </PageHeader>

      <section className="grid gap-4 lg:grid-cols-3">
        {orderedApplications.map((application) => {
          const Icon = icons[application.category as keyof typeof icons] ?? GraduationCap;
          return (
            <Link key={application.id} href={application.href} className="group flex min-h-72 flex-col rounded-lg bg-white p-5 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-soft">
              <div className="flex items-start justify-between gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F7E8DC] text-[#8F5139]">
                  <Icon size={21} />
                </span>
                <StatusBadge tone={application.tone}>{language === "hi" ? translateStatus(application.status) : application.status}</StatusBadge>
              </div>
              <p className="mt-5 text-xs font-bold uppercase tracking-normal text-muted">{language === "hi" ? translateCategory(application.category) : application.category}</p>
              <h2 className="mt-2 font-serif text-2xl font-bold leading-tight text-ink">{application.title}</h2>
              <p className="mt-2 text-sm font-semibold text-muted">{application.provider}</p>
              <dl className="mt-5 space-y-3 text-sm">
                <div>
                  <dt className="font-semibold text-muted">{language === "hi" ? "वर्तमान मालिक" : "Current owner"}</dt>
                  <dd className="mt-1 font-bold text-ink">{language === "hi" ? translateOwner(application.owner) : application.owner}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-muted">{language === "hi" ? "अगला कदम" : "Next step"}</dt>
                  <dd className="mt-1 leading-6 text-slate-700">{application.nextStep}</dd>
                </div>
              </dl>
              <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-primary">
                {language === "hi" ? "ट्रैकर खोलें" : "Open tracker"}
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}

function translateCategory(category: string) {
  const categories: Record<string, string> = {
    Scholarship: "छात्रवृत्ति",
    "Research Grant": "शोध अनुदान",
    "Startup Funding": "स्टार्टअप फंडिंग"
  };
  return categories[category] ?? category;
}

function translateStatus(status: string) {
  const statuses: Record<string, string> = {
    "Institute verification": "संस्थान सत्यापन",
    "Scientific review": "वैज्ञानिक समीक्षा",
    "Incubator screening": "इनक्यूबेटर स्क्रीनिंग",
    "Strengthening evidence": "साक्ष्य मजबूत करना",
    "Payment blocker": "भुगतान अवरोध",
    "Renewal upcoming": "नवीनीकरण आगामी"
  };
  return statuses[status] ?? status;
}

function translateOwner(owner: string) {
  const owners: Record<string, string> = {
    "BIT Scholarship and Research Cell": "BIT छात्रवृत्ति और शोध सेल",
    "ANRF review panel": "ANRF समीक्षा पैनल",
    "Partner incubator": "सहयोगी इनक्यूबेटर",
    Student: "छात्र"
  };
  return owners[owner] ?? owner;
}
