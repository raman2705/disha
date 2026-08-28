"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton, PrimaryLink } from "@/components/PrimaryButton";
import { RequirementChecklist } from "@/components/RequirementChecklist";
import { StatusBadge } from "@/components/StatusBadge";

export default function RenewalPage() {
  const [marksheetAdded, setMarksheetAdded] = useState(false);

  return (
    <div>
      <PageHeader title="Renew your scholarship">
        Keep your Central Sector Scholarship active by confirming this year’s academic details.
      </PageHeader>

      <section className="mb-8 rounded-2xl bg-white p-7 shadow-soft ring-1 ring-stone-200">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <StatusBadge tone={marksheetAdded ? "success" : "warning"}>
              {marksheetAdded ? "Ready to renew ✓" : "Eligible for renewal"}
            </StatusBadge>
            <h2 className="mt-4 text-3xl font-bold text-ink">Central Sector Scholarship</h2>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">
              {marksheetAdded
                ? "Your latest marksheet has been added. Renewal can now begin."
                : "One document is required before you can begin renewal."}
            </p>
          </div>
          {marksheetAdded ? <PrimaryLink href="/apply">Start renewal</PrimaryLink> : <PrimaryButton onClick={() => setMarksheetAdded(true)}>Add marksheet</PrimaryButton>}
        </div>
        <dl className="mt-7 grid gap-5 border-t border-stone-100 pt-6 text-sm sm:grid-cols-3">
          <div>
            <dt className="font-semibold text-muted">Previous scholarship</dt>
            <dd className="mt-1 font-bold text-ink">Central Sector Scholarship</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Renewal status</dt>
            <dd className="mt-1 font-bold text-ink">{marksheetAdded ? "Ready to start" : "Eligible to renew"}</dd>
          </div>
          <div>
            <dt className="font-semibold text-muted">Deadline</dt>
            <dd className="mt-1 font-bold text-ink">30 September 2027</dd>
          </div>
        </dl>
      </section>

      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <h2 className="text-xl font-bold text-ink">Requirements</h2>
          <div className="mt-5">
            <RequirementChecklist
              items={[
                { label: "Previous scholarship received", state: "done" },
                { label: "Minimum marks met", state: "done" },
                { label: marksheetAdded ? "Latest marksheet uploaded" : "Latest marksheet required", state: marksheetAdded ? "done" : "warning" },
                { label: "Bank details unchanged", state: "done" }
              ]}
            />
          </div>
        </section>

        <section className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200 state-pop">
          <div className="flex gap-3">
            <FileUp className={marksheetAdded ? "mt-1 text-emerald-700" : "mt-1 text-amber-700"} size={22} />
            <div>
              <h2 className="text-xl font-bold text-ink">{marksheetAdded ? "Ready to renew" : "Latest marksheet required"}</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                {marksheetAdded
                  ? "The missing-document warning cleared and the renewal action is available."
                  : "Your latest semester result must be added before renewal."}
              </p>
              {!marksheetAdded ? (
                <div className="mt-5">
                  <PrimaryButton onClick={() => setMarksheetAdded(true)}>Add marksheet</PrimaryButton>
                </div>
              ) : (
                <div className="mt-5">
                  <PrimaryLink href="/apply">Start renewal</PrimaryLink>
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
