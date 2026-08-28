import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { InstitutionStatus } from "@/components/InstitutionStatus";
import { PrimaryLink } from "@/components/PrimaryButton";
import { RequirementChecklist } from "@/components/RequirementChecklist";
import { StatusBadge } from "@/components/StatusBadge";
import { scholarships } from "@/lib/data";

export function generateStaticParams() {
  return scholarships.map((scholarship) => ({ id: scholarship.id }));
}

export default async function ScholarshipDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scholarship = scholarships.find((item) => item.id === id);

  if (!scholarship) {
    notFound();
  }

  const isCentral = scholarship.id === "central-sector-scholarship";

  return (
    <div>
      <Link href="/scholarships" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={17} />
        Back to scholarships
      </Link>

      <PageHeader title={scholarship.title}>
        <div className="flex flex-wrap gap-3 pt-2">
          <StatusBadge tone={scholarship.status === "Eligible" ? "success" : scholarship.status === "Needs information" ? "warning" : "neutral"}>
            {isCentral ? "You appear eligible" : scholarship.status}
          </StatusBadge>
          <span className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-ink">
            {scholarship.amount}
          </span>
          <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-900">
            Deadline {scholarship.deadline}
          </span>
        </div>
      </PageHeader>

      {isCentral ? (
        <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-emerald-200">
            <h2 className="text-xl font-bold text-ink">Why you qualify</h2>
            <p className="mt-2 text-sm leading-6 text-slate-700">
              You meet the current published criteria based on your saved profile. The decision is rule-based, and the explanation is written in student-friendly language.
            </p>
            <div className="mt-5">
              <RequirementChecklist
                items={[
                  { label: "Undergraduate student", state: "done" },
                  { label: "Class 12 score above required threshold", state: "done" },
                  { label: "Household income within limit", state: "done" }
                ]}
              />
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
            <h2 className="text-xl font-bold text-ink">What you’ll need</h2>
            <div className="mt-5">
              <RequirementChecklist
                items={[
                  { label: "Aadhaar", state: "done" },
                  { label: "Bank details", state: "done" },
                  { label: "Income certificate", state: "done" },
                  { label: "Institute enrolment proof", state: "missing" }
                ]}
              />
            </div>
            <div className="mt-6">
              <PrimaryLink href="/preflight">Check application readiness</PrimaryLink>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200 lg:col-span-2">
            <h2 className="text-xl font-bold text-ink">What happens outside your application?</h2>
            <p className="mt-2 max-w-3xl text-sm leading-6 text-muted">
              Your institution also needs to complete 1 action. {scholarship.institutionAction}
            </p>
            <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
              <p>
                <span className="font-semibold text-ink">Status:</span> Waiting for institution
              </p>
              <p>
                <span className="font-semibold text-ink">Student action:</span> No action required yet
              </p>
            </div>
          </section>

          <div className="lg:col-span-2">
            <InstitutionStatus mode="compact" />
          </div>

          <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200 lg:col-span-2">
            <div className="grid gap-6 md:grid-cols-3">
              <div>
                <h2 className="text-lg font-bold text-ink">About this scholarship</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Supports undergraduate students with annual assistance for academic expenses.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">Eligibility criteria</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Undergraduate enrolment, required academic score and household income within the allowed limit.
                </p>
              </div>
              <div>
                <h2 className="text-lg font-bold text-ink">Documents required</h2>
                <p className="mt-2 text-sm leading-6 text-muted">
                  Aadhaar, bank account details, income certificate and current institute enrolment proof.
                </p>
              </div>
            </div>
          </section>
        </div>
      ) : (
        <section className="rounded-lg border border-slate-200 bg-white p-6">
          <h2 className="text-xl font-bold text-ink">Eligibility explanation</h2>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-muted">{scholarship.explanation}</p>
          <div className="mt-6">
            <PrimaryLink href="/scholarships">Compare scholarships</PrimaryLink>
          </div>
        </section>
      )}
    </div>
  );
}
