"use client";

import { useState } from "react";
import clsx from "clsx";
import { CheckCircle2, Save } from "lucide-react";
import { PrimaryButton } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";

export default function PaymentTrackerPage() {
  const [editing, setEditing] = useState(false);
  const [corrected, setCorrected] = useState(false);

  return (
    <div className="space-y-8">
      <section className="rounded-2xl bg-white p-8 shadow-soft ring-1 ring-stone-200">
        <p className="text-sm font-bold uppercase tracking-normal text-muted">Scholarship payment</p>
        <h1 className="mt-2 text-6xl font-bold tracking-normal text-ink">₹12,000</h1>
        <div className="mt-5">
          <StatusBadge tone={corrected ? "active" : "danger"}>{corrected ? "Revalidation pending" : "Action required"}</StatusBadge>
        </div>
        <PaymentProgress corrected={corrected} />
      </section>

      <section
        className={clsx(
          "rounded-2xl bg-white p-7 shadow-sm ring-1 state-pop",
          corrected ? "ring-emerald-200" : "ring-red-200"
        )}
      >
        {!corrected ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <div>
              <h2 className="text-3xl font-bold text-ink">We couldn’t validate your beneficiary name</h2>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                The beneficiary details sent for payment could not be matched successfully with your bank account information.
              </p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <Compare label="Application" value="Aditi S." tone="danger" />
                <Compare label="Bank record" value="Aditi Sharma" tone="success" />
              </div>
              <p className="mt-6 text-xl font-bold text-ink">You need to act</p>
              <p className="mt-2 text-sm leading-6 text-muted">Review your bank details to restart validation.</p>
            </div>

            <div>
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
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
                  >
                    <Save size={18} />
                    Save corrected details
                  </button>
                </form>
              )}
            </div>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
            <div>
              <div className="flex items-center gap-3">
                <CheckCircle2 className="text-emerald-700" size={28} />
                <h2 className="text-3xl font-bold text-ink">Details updated</h2>
              </div>
              <p className="mt-3 max-w-2xl text-base leading-7 text-muted">
                The user-fixed blocker is gone. Your payment is now waiting for PFMS and bank validation.
              </p>
            </div>
            <dl className="grid gap-4 text-sm">
              <div>
                <dt className="font-semibold text-muted">Status</dt>
                <dd className="mt-1 text-lg font-bold text-ink">Revalidation pending</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted">Owner</dt>
                <dd className="mt-1 text-lg font-bold text-primary">PFMS / bank validation</dd>
              </div>
              <div>
                <dt className="font-semibold text-muted">Student action</dt>
                <dd className="mt-1 text-lg font-bold text-ink">Nothing else required</dd>
              </div>
            </dl>
          </div>
        )}
      </section>
    </div>
  );
}

function PaymentProgress({ corrected }: { corrected: boolean }) {
  const steps = [
    { label: "Approved", state: "done" },
    { label: "Sent to PFMS", state: "done" },
    { label: "Bank validation", state: corrected ? "active" : "blocked" },
    { label: "Credited", state: "pending" }
  ];

  return (
    <ol className="mt-8 grid gap-3 sm:grid-cols-[auto_1fr_auto_1fr_auto_1fr_auto] sm:items-center">
      {steps.map((step, index) => (
        <li key={step.label} className="contents">
          <div className="flex items-center gap-2">
            <span
              className={clsx(
                "flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold",
                step.state === "done" && "bg-emerald-600 text-white",
                step.state === "active" && "bg-primary text-white",
                step.state === "blocked" && "bg-red-600 text-white",
                step.state === "pending" && "bg-stone-200 text-stone-500"
              )}
            >
              {step.state === "done" ? "✓" : step.state === "blocked" ? "!" : index + 1}
            </span>
            <span className="font-semibold text-ink">{step.label}</span>
          </div>
          {index < steps.length - 1 ? <div className="hidden h-px bg-stone-200 sm:block" /> : null}
        </li>
      ))}
    </ol>
  );
}

function Compare({ label, value, tone }: { label: string; value: string; tone: "danger" | "success" }) {
  return (
    <div className={clsx("rounded-lg p-4", tone === "danger" ? "bg-red-50" : "bg-emerald-50")}>
      <p className="text-xs font-bold uppercase tracking-normal text-muted">{label}</p>
      <p className="mt-2 text-xl font-bold text-ink">{value}</p>
    </div>
  );
}
