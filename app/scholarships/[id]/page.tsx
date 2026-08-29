import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import clsx from "clsx";
import { PageHeader } from "@/components/PageHeader";
import { InstitutionStatus } from "@/components/InstitutionStatus";
import { PrimaryLink } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { scholarships } from "@/lib/data";
import { evaluateScholarship, sampleEligibilityProfile } from "@/lib/matching";

const statusTone = {
  recommended: "success",
  could: "warning",
  ineligible: "danger"
} as const;

export function generateStaticParams() {
  return scholarships.map((scholarship) => ({ id: scholarship.id }));
}

export default async function ScholarshipDetail({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scholarship = scholarships.find((item) => item.id === id);

  if (!scholarship) {
    notFound();
  }

  const result = evaluateScholarship(scholarship, sampleEligibilityProfile());
  const statusLabel =
    result.state === "recommended"
      ? "You appear eligible"
      : result.state === "could"
        ? `${result.missing.length} detail needed`
        : "Not eligible for sample profile";

  return (
    <div>
      <Link href="/scholarships" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary">
        <ArrowLeft size={17} />
        Back to scholarships
      </Link>

      <PageHeader title={scholarship.title}>
        <div className="flex flex-wrap gap-3 pt-2">
          <StatusBadge tone={statusTone[result.state]}>{statusLabel}</StatusBadge>
          <span className="rounded-md border border-slate-200 bg-white px-3 py-1 text-sm font-semibold text-ink">
            {scholarship.amount}
          </span>
          <span className="rounded-md border border-amber-200 bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-900">
            Deadline {scholarship.deadline}
          </span>
        </div>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[1fr_0.78fr]">
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-bold text-ink">Eligibility evidence</h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Eligibility shown here is a simplified prototype assessment based on the information provided. Confirm final scheme rules before applying.
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {result.evidence.length ? (
              result.evidence.map((item) => (
                <div
                  key={item.label}
                  className={clsx(
                    "rounded-lg border-l-2 bg-[#FBF7F1] p-3",
                    item.result === "pass" && "border-emerald-500",
                    item.result === "warning" && "border-amber-500",
                    item.result === "fail" && "border-red-500"
                  )}
                >
                  <p className={clsx("text-sm font-bold", item.result === "fail" ? "text-red-800" : item.result === "warning" ? "text-amber-900" : "text-ink")}>
                    {item.result === "fail" ? "×" : item.result === "warning" ? "○" : "✓"} {item.label}: {item.value}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-muted">{item.requirement}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted">Add profile details to see personalised evidence for this scheme.</p>
            )}
          </div>
        </section>

        <aside className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-bold text-ink">Scheme summary</h2>
          <dl className="mt-5 space-y-4 text-sm">
            <div>
              <dt className="font-semibold text-muted">Provider</dt>
              <dd className="mt-1 font-bold text-ink">{scholarship.provider}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Level</dt>
              <dd className="mt-1 font-bold text-ink">{scholarship.level.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Applicability</dt>
              <dd className="mt-1 font-bold text-ink">{scholarship.applicability}</dd>
            </div>
            <div>
              <dt className="font-semibold text-muted">Fresh / renewal</dt>
              <dd className="mt-1 font-bold text-ink">{scholarship.cycle}</dd>
            </div>
          </dl>
          <div className="mt-6">
            <PrimaryLink href={result.state === "recommended" ? "/preflight" : "/scholarships"}>
              {result.state === "recommended" ? "Check application readiness" : "Compare scholarships"}
            </PrimaryLink>
          </div>
        </aside>

        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200 lg:col-span-2">
          <h2 className="text-xl font-bold text-ink">Simplified criteria</h2>
          <div className="mt-4 grid gap-3 md:grid-cols-3">
            {scholarship.criteria.map((criterion) => (
              <p key={criterion} className="rounded-lg bg-[#FBF7F1] p-3 text-sm font-semibold text-ink">
                {criterion}
              </p>
            ))}
          </div>
          <p className="mt-5 text-sm leading-6 text-muted">
            {scholarship.institutionAction}
          </p>
        </section>

        {result.state === "recommended" ? (
          <div className="lg:col-span-2">
            <InstitutionStatus mode="compact" />
          </div>
        ) : null}
      </div>
    </div>
  );
}
