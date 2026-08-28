import Link from "next/link";
import { ArrowRight } from "lucide-react";
import clsx from "clsx";
import { StatusBadge } from "@/components/StatusBadge";

const statusTone = {
  Eligible: "success",
  "Needs information": "warning",
  "Not eligible": "neutral"
} as const;

export function ScholarshipCard({ scholarship }: { scholarship: (typeof import("@/lib/data").scholarships)[number] }) {
  return (
    <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200 transition hover:shadow-soft">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-xl font-bold text-ink">{scholarship.title}</h2>
            <StatusBadge tone={statusTone[scholarship.status as keyof typeof statusTone]}>{scholarship.status}</StatusBadge>
          </div>
          <div className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-sm">
            <p className="font-semibold text-primary">{scholarship.amount}</p>
            <p className="font-semibold text-muted">Deadline {scholarship.deadline}</p>
          </div>
          <h3 className="mt-5 text-sm font-bold text-ink">Why this matches you</h3>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {scholarship.evidence.map((item) => (
              <div
                key={item.label}
                className={clsx(
                  "border-l-2 pl-3",
                  item.result === "fail" && "border-red-500",
                  item.result === "warning" && "border-amber-500",
                  item.result === "pass" && "border-emerald-500"
                )}
              >
                <p className={clsx("text-sm font-semibold", item.result === "fail" ? "text-red-800" : "text-ink")}>
                  {item.result === "fail" ? "×" : item.result === "warning" ? "!" : "✓"} {item.label}: {item.value}
                </p>
                <p className="mt-1 text-xs text-muted">{item.requirement}</p>
              </div>
            ))}
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-6 text-muted">{scholarship.explanation}</p>
        </div>
        <Link
          href={`/scholarships/${scholarship.id}`}
          className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          {scholarship.cta}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </article>
  );
}
