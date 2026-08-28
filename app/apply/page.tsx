"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, Send } from "lucide-react";
import { ApplicationProgress } from "@/components/ApplicationProgress";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton } from "@/components/PrimaryButton";
import { RequirementChecklist } from "@/components/RequirementChecklist";
import { applicationId, profile } from "@/lib/data";

const steps = ["Personal details", "Education", "Bank details", "Documents & review"];

export default function ApplyPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const fields = useMemo(
    () => [
      [
        ["Full name", profile.name],
        ["Email", profile.email],
        ["Phone", profile.phone],
        ["Location", profile.location]
      ],
      [
        ["Institute", profile.college],
        ["Programme", profile.programme],
        ["Study level", profile.year],
        ["Class 12 score", profile.class12]
      ],
      [
        ["Bank account", "State Bank of India ending 2042"],
        ["Beneficiary name", "Aditi Sharma"],
        ["IFSC", "SBIN0004521"],
        ["Validation", "Verified"]
      ]
    ],
    []
  );

  if (submitted) {
    return (
      <div>
        <section className="rounded-lg border border-emerald-200 bg-emerald-50 p-8 shadow-soft state-pop">
          <CheckCircle2 className="text-emerald-700" size={34} />
          <h1 className="mt-4 text-3xl font-bold text-ink">Application submitted</h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-700">
            Your Central Sector Scholarship application is now with ABC College Scholarship Cell for institute verification.
          </p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-md bg-white p-3">
              <dt className="text-xs font-bold uppercase tracking-normal text-muted">Application ID</dt>
              <dd className="mt-1 font-semibold text-ink">{applicationId}</dd>
            </div>
            <div className="rounded-md bg-white p-3">
              <dt className="text-xs font-bold uppercase tracking-normal text-muted">Who acts next</dt>
              <dd className="mt-1 font-semibold text-ink">ABC College Scholarship Cell</dd>
            </div>
          </dl>
          <div className="mt-6">
            <PrimaryButton onClick={() => router.push("/applications/css-2026")}>Track verification</PrimaryButton>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div>
      <PageHeader title="Central Sector Scholarship application">
        Most details are filled from your saved profile. Review each section before submission.
      </PageHeader>

      <ApplicationProgress steps={steps} current={step} />

      <section className="mt-6 rounded-lg border border-slate-200 bg-white p-6 shadow-sm state-pop" key={step}>
        <h2 className="text-2xl font-bold text-ink">{steps[step]}</h2>
        <p className="mt-2 text-sm leading-6 text-muted">
          {step < 3 ? "Fields can be edited for this prototype. Saved values are marked as coming from your profile." : "Everything is ready for final submission."}
        </p>

        {step < 3 ? (
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {fields[step].map(([label, value]) => (
              <label key={label} className="block">
                <span className="mb-2 flex items-center justify-between gap-2 text-sm font-semibold text-ink">
                  {label}
                  <span className="text-xs font-semibold text-muted">From your profile</span>
                </span>
                <input
                  defaultValue={value}
                  className="h-11 w-full rounded-md border border-slate-300 bg-white px-3 text-sm text-ink focus:border-accent"
                />
              </label>
            ))}
          </div>
        ) : (
          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <RequirementChecklist
              items={[
                { label: "Personal details complete", state: "done" },
                { label: "Education complete", state: "done" },
                { label: "Bank details verified", state: "done" },
                { label: "Documents complete", state: "done" }
              ]}
            />
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
              <h3 className="text-lg font-bold text-ink">Ready for submission</h3>
              <p className="mt-2 text-sm leading-6 text-slate-700">
                After submission, edits close and the application moves to institute verification.
              </p>
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-wrap justify-between gap-3">
          <button
            type="button"
            onClick={() => setStep((value) => Math.max(value - 1, 0))}
            disabled={step === 0}
            className="min-h-11 rounded-md border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:text-slate-300"
          >
            Back
          </button>
          {step < steps.length - 1 ? (
            <PrimaryButton onClick={() => setStep((value) => value + 1)}>Save and continue</PrimaryButton>
          ) : (
            <button
              type="button"
              onClick={() => setSubmitted(true)}
              className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
            >
              <Send size={18} />
              Submit application
            </button>
          )}
        </div>
      </section>
    </div>
  );
}
