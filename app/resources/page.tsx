import Link from "next/link";
import { ArrowRight, BookOpen, FileCheck2, HelpCircle } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const resources = [
  {
    title: "Access requirements",
    body: "Check whether a route needs an institution, incubator, supervisor, nomination or partner before you spend time on the full application.",
    icon: HelpCircle,
    href: "/opportunities/aicte-pragati-scholarship"
  },
  {
    title: "Evidence guide",
    body: "Turn eligibility into proof: admission details, income certificate, academic records, bank details and institution validation.",
    icon: FileCheck2,
    href: "/opportunities/aicte-pragati-scholarship/assess"
  },
  {
    title: "Scholarship tracking",
    body: "After applying, use OwnershipRail to see who owns the next step, what is blocked, and when the applicant needs to act.",
    icon: BookOpen,
    href: "/applications/pragati-readiness-2026"
  }
];

export default function ResourcesPage() {
  return (
    <div>
      <PageHeader eyebrow="Resources" title="Make the next step concrete">
        Short guides connected to the AICTE Pragati scholarship journey.
      </PageHeader>

      <section className="grid gap-4 md:grid-cols-2">
        {resources.map((resource) => {
          const Icon = resource.icon;
          return (
            <Link key={resource.title} href={resource.href} className="group rounded-lg bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-soft">
              <span className="flex h-11 w-11 items-center justify-center rounded-md bg-[#F7E8DC] text-[#8F5139]">
                <Icon size={21} />
              </span>
              <h2 className="mt-4 font-serif text-2xl font-bold text-ink">{resource.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-700">{resource.body}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">
                Open guide
                <ArrowRight size={16} className="transition group-hover:translate-x-1" />
              </span>
            </Link>
          );
        })}
      </section>
    </div>
  );
}
