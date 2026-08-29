"use client";

import { useState } from "react";
import { FileUp } from "lucide-react";
import { OwnershipRail } from "@/components/OwnershipRail";
import { PageHeader } from "@/components/PageHeader";
import { PrimaryButton, PrimaryLink } from "@/components/PrimaryButton";
import { RequirementChecklist } from "@/components/RequirementChecklist";
import { StatusBadge } from "@/components/StatusBadge";

type RenewalState = "needsMarksheet" | "readyToSubmit" | "submitted";

export default function RenewalPage() {
  const [renewalState, setRenewalState] = useState<RenewalState>("needsMarksheet");
  const marksheetAdded = renewalState !== "needsMarksheet";
  const submitted = renewalState === "submitted";
  const renewalRail = submitted
    ? [
        { actor: "You", state: "completed" as const, detail: "Done" },
        { actor: "ABC College", state: "current" as const, detail: "Reviewing" },
        { actor: "Scheme", state: "waiting" as const, detail: "Waiting" },
        { actor: "Payment", state: "waiting" as const, detail: "Not started" }
      ]
    : [
        { actor: "You", state: marksheetAdded ? "current" as const : "student-action" as const, detail: marksheetAdded ? "Submit" : "Action needed" },
        { actor: "ABC College", state: "waiting" as const, detail: "Waiting" },
        { actor: "Scheme", state: "waiting" as const, detail: "Waiting" },
        { actor: "Payment", state: "waiting" as const, detail: "Not started" }
      ];
  const currentStatus = submitted ? "Waiting on ABC College" : marksheetAdded ? "Ready to submit renewal" : "Renewal preparation incomplete";

  return (
    <div className="space-y-7">
      <PageHeader title="Central Sector Scholarship">
        Renewal · 2027-28. Keep your scholarship active across academic years with the latest scheme-specific requirement.
      </PageHeader>

      <section className="overflow-hidden rounded-[1.1rem] bg-white p-7 shadow-soft sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_0.58fr] lg:items-center">
          <div>
            <StatusBadge tone={submitted ? "active" : "warning"}>
              {submitted ? "Waiting on ABC College" : marksheetAdded ? "Ready to submit" : "Latest marksheet required"}
            </StatusBadge>
            <p className="mt-5 text-sm font-bold uppercase tracking-normal text-muted">Current status</p>
            <h2 className="mt-2 max-w-md text-4xl font-bold leading-tight text-ink">
              {currentStatus}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-muted">
              {submitted
                ? "Your renewal is now with ABC College for institution verification."
                : marksheetAdded
                  ? "Your marksheet is added. Submit the renewal application to hand it to your institution."
                  : "Your marksheet is required before the renewal application can be submitted."}
            </p>
            {renewalState === "needsMarksheet" ? (
              <div className="mt-6">
                <PrimaryButton onClick={() => setRenewalState("readyToSubmit")}>Add marksheet</PrimaryButton>
              </div>
            ) : renewalState === "readyToSubmit" ? (
              <div className="mt-6">
                <PrimaryButton onClick={() => setRenewalState("submitted")}>Submit renewal</PrimaryButton>
              </div>
            ) : (
              <p className="mt-5 text-lg font-bold text-ink">Your part is complete.</p>
            )}
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Current owner</p>
              <h3 className="mt-2 text-2xl font-bold text-ink">{submitted ? "ABC College Scholarship Cell" : "You"}</h3>
              <p className={submitted ? "mt-1 text-sm font-semibold text-primary" : "mt-1 text-sm font-semibold text-amber-900"}>
                {submitted ? "Renewal verification" : marksheetAdded ? "Submit renewal application" : "Upload latest marksheet"}
              </p>
            </div>
            <OwnershipRail
              items={renewalRail}
              evidence={
                submitted
                  ? "Renewal submitted · institution verification pending with ABC College"
                  : marksheetAdded
                    ? "Latest marksheet added · renewal application ready to submit"
                    : "Latest marksheet missing · student owns the next action"
              }
              className={submitted ? "bg-[#F5F6FF]" : "bg-[#FFF3DD]"}
            />
          </div>
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1fr_0.82fr]">
        <article className="rounded-[1rem] bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-ink">Renewal ownership</h2>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <OwnerBlock
              title="Your renewal"
              items={[
                { label: submitted ? "Renewal application submitted" : marksheetAdded ? "Renewal ready to submit" : "Submission blocked until marksheet", state: submitted ? "done" : marksheetAdded ? "pending" : "warning" },
                { label: marksheetAdded ? "Latest marksheet submitted" : "Latest marksheet required", state: marksheetAdded ? "done" : "warning" }
              ]}
            />
            <OwnerBlock
              title="Your institution"
              items={[
                { label: "ABC College renewal verification", state: "pending" },
                { label: "Scheme authority waiting", state: "pending" }
              ]}
            />
            <OwnerBlock
              title="Scheme / verification authority"
              items={[{ label: "Waiting for institution verification", state: "pending" }]}
            />
            <OwnerBlock
              title="Payment"
              items={[{ label: "Renewal payment not started", state: "pending" }]}
            />
          </div>
        </article>

        <article className={marksheetAdded ? "rounded-[1rem] bg-[#E8F3EC] p-6 shadow-sm" : "rounded-[1rem] bg-[#FFF3DD] p-6 shadow-sm"}>
          <div className="flex gap-3">
            <FileUp className={marksheetAdded ? "mt-1 text-emerald-800" : "mt-1 text-amber-800"} size={22} />
            <div>
              <h2 className="text-2xl font-bold text-ink">{submitted ? "Waiting on ABC College" : marksheetAdded ? "Ready to submit renewal" : "Upload latest marksheet"}</h2>
              <p className="mt-3 text-sm leading-6 text-muted">
                {submitted
                  ? "The student-owned requirement cleared. The next movement depends on institution renewal verification."
                  : marksheetAdded
                    ? "Your latest marksheet is attached. Submit the renewal application when ready."
                    : "Central Sector Scholarship renewal needs the latest academic result before ABC College can verify continuity."}
              </p>
              {renewalState === "needsMarksheet" ? (
                <p className="mt-5 text-sm font-bold text-amber-900">You own this action.</p>
              ) : renewalState === "readyToSubmit" ? (
                <div className="mt-6">
                  <PrimaryButton onClick={() => setRenewalState("submitted")}>Submit renewal</PrimaryButton>
                </div>
              ) : (
                <div className="mt-6">
                  <PrimaryLink href="/dashboard">Return to dashboard</PrimaryLink>
                </div>
              )}
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

function OwnerBlock({ title, items }: { title: string; items: { label: string; state: "done" | "warning" | "missing" | "pending" }[] }) {
  return (
    <section>
      <h3 className="text-base font-bold text-ink">{title}</h3>
      <div className="mt-3">
        <RequirementChecklist items={items} />
      </div>
    </section>
  );
}
