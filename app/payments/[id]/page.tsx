"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, Save } from "lucide-react";
import { OwnershipRail } from "@/components/OwnershipRail";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";

const failedRail = [
  { actor: "Authority", state: "completed" as const, detail: "Done" },
  { actor: "PFMS", state: "completed" as const, detail: "Done" },
  { actor: "You", state: "student-action" as const, detail: "Action needed" },
  { actor: "Bank", state: "blocked" as const, detail: "Blocked" }
];

const revalidationRail = [
  { actor: "Authority", state: "completed" as const, detail: "Done" },
  { actor: "You", state: "completed" as const, detail: "Done" },
  { actor: "PFMS", state: "current" as const, detail: "Revalidating" },
  { actor: "Bank", state: "current" as const, detail: "Checking" }
];

export default function PaymentTrackerPage() {
  const [editing, setEditing] = useState(false);
  const [corrected, setCorrected] = useState(false);

  return (
    <div className="space-y-7">
      <section className="overflow-hidden rounded-[1.1rem] bg-white p-7 shadow-soft sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.38fr_0.62fr] lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-normal text-muted">Scholarship payment</p>
            <h1 className="mt-2 text-6xl font-bold tracking-normal text-ink">₹12,000</h1>
            <div className="mt-5">
              <StatusBadge tone={corrected ? "active" : "danger"}>{corrected ? "Revalidation pending" : "Bank validation failed"}</StatusBadge>
            </div>
            <p className="mt-5 max-w-md text-base leading-7 text-muted">
              {corrected
                ? "Your payment is back with PFMS and your bank for validation."
                : "The scholarship has been approved and sent to PFMS. A beneficiary name mismatch is stopping payment credit."}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Current owner</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{corrected ? "PFMS and bank" : "You"}</h2>
              <p className={clsx("mt-1 text-sm font-semibold", corrected ? "text-primary" : "text-amber-900")}>
                {corrected ? "Revalidating beneficiary details" : "Correct beneficiary name"}
              </p>
            </div>
            <OwnershipRail
              items={corrected ? revalidationRail : failedRail}
              evidence={corrected ? "Beneficiary name updated · revalidation requested" : "Beneficiary name mismatch · updated 27 Aug"}
              className={corrected ? "bg-[#F5F6FF]" : "bg-[#FFF3DD]"}
            />
          </div>
        </div>
      </section>

      <section className={clsx("rounded-[1.1rem] bg-white p-7 shadow-sm state-pop", corrected ? "border border-emerald-100" : "border border-red-100")}>
        {!corrected ? (
          <div className="grid gap-8 lg:grid-cols-[1fr_0.74fr]">
            <div>
              <h2 className="text-3xl font-bold text-ink">Beneficiary name doesn&apos;t match</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                Correct the beneficiary name to restart validation.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Compare label="Application" value="Aditi S." tone="danger" />
                <Compare label="Bank record" value="Aditi Sharma" tone="success" />
              </div>
            </div>

            <div className="rounded-[1rem] bg-[#FFF3DD] p-5">
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Current action</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">You own the next action</h3>
              <p className="mt-2 text-sm leading-6 text-muted">Review the beneficiary field and save the corrected name.</p>
              <div className="mt-6">
                {!editing ? (
                  <PrimaryButton onClick={() => setEditing(true)}>Review details</PrimaryButton>
                ) : (
                  <form
                    className="space-y-4 state-pop"
                    onSubmit={(event) => {
                      event.preventDefault();
                      setCorrected(true);
                      setEditing(false);
                    }}
                  >
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-ink">Corrected beneficiary name</span>
                      <input
                        defaultValue="Aditi Sharma"
                        className="h-11 w-full rounded-md border border-stone-300 bg-white px-3 text-sm text-ink focus:border-accent"
                      />
                    </label>
                    <button
                      type="submit"
                      className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700"
                    >
                      <Save size={18} />
                      Save corrected details
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid gap-7 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-700" size={28} />
                <h2 className="text-3xl font-bold text-ink">Details updated</h2>
              </div>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                Your payment is back with PFMS and your bank for validation.
              </p>
              <p className="mt-5 text-xl font-bold text-ink">Nothing else required from you.</p>
            </div>
            <dl className="rounded-[1rem] bg-[#E8F3EC] p-5 text-sm">
              <div>
                <dt className="font-semibold text-muted">Status</dt>
                <dd className="mt-1 text-lg font-bold text-ink">Revalidation pending</dd>
              </div>
              <div className="mt-4">
                <dt className="font-semibold text-muted">Student</dt>
                <dd className="mt-1 text-lg font-bold text-emerald-800">✓ Your part is complete</dd>
              </div>
              <div className="mt-4">
                <dt className="font-semibold text-muted">PFMS / Bank</dt>
                <dd className="mt-1 text-lg font-bold text-primary">● Revalidating</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </div>
  );
}

function Compare({ label, value, tone }: { label: string; value: string; tone: "danger" | "success" }) {
  return (
    <div className={clsx("rounded-[1rem] p-4", tone === "danger" ? "bg-[#FDEBEC]" : "bg-[#E8F3EC]")}>
      <p className="text-xs font-bold uppercase tracking-normal text-muted">{label}</p>
      <p className="mt-2 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
