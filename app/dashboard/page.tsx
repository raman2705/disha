"use client";

import Link from "next/link";
import { ArrowRight, Clock, FileWarning, Hourglass } from "lucide-react";
import { DeadlineIndicator } from "@/components/DeadlineIndicator";
import { JourneyStepper } from "@/components/JourneyStepper";
import { PrimaryLink } from "@/components/PrimaryButton";
import { StatusBadge } from "@/components/StatusBadge";
import { demoStates, institution, scholarships } from "@/lib/data";
import { useAppState } from "@/components/AppContext";

export default function Dashboard() {
  const { demoState } = useAppState();
  const state = demoStates[demoState];

  return (
    <div className="space-y-10">
      <section className="max-w-3xl">
        <p className="text-sm font-semibold text-accent">Good afternoon, Aditi</p>
        <h1 className="mt-2 text-3xl font-bold tracking-normal text-ink sm:text-5xl">Here’s what’s happening with your scholarships.</h1>
        <p className="mt-4 text-base leading-7 text-muted">
          See what you can control, what someone else is doing, what is blocking progress and what can happen next.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <article className="rounded-xl bg-white p-6 shadow-soft ring-1 ring-stone-200">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-50 text-amber-800">
              <FileWarning size={21} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Needs your attention</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">Income certificate expires soon</h2>
              <p className="mt-2 text-sm leading-6 text-muted">
                Replacing it now can prevent a return request if verification happens after the deadline.
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <PrimaryLink href="/preflight">Replace certificate</PrimaryLink>
                <span className="text-sm font-semibold text-muted">Student action</span>
              </div>
            </div>
          </div>
        </article>

        <article className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-stone-200">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-primary">
              <Hourglass size={21} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-normal text-muted">Waiting on others</p>
              <h2 className="mt-2 text-2xl font-bold text-ink">{institution.cell}</h2>
              <p className="mt-2 font-semibold text-primary">Scholarship verification pending</p>
              <p className="mt-2 text-sm leading-6 text-muted">Waiting for 3 days. You don’t need to do anything right now.</p>
              <div className="mt-5">
                <PrimaryLink href="/applications/css-2026">Track verification</PrimaryLink>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section>
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-2xl font-bold text-ink">Your scholarships</h2>
            <p className="mt-1 text-sm text-muted">Compact status by next owner and blocker.</p>
          </div>
          <Link href="/scholarships" className="inline-flex items-center gap-1 text-sm font-semibold text-primary">
            Explore matches <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-stone-200">
          {[
            { title: "Central Sector Scholarship", amount: "₹12,000/year", status: "Preparing application", owner: "You", blocker: "Income certificate risk", href: "/preflight" },
            { title: "Central Sector Scholarship", amount: "₹12,000", status: "Verification waiting", owner: institution.cell, blocker: "No student action", href: "/applications/css-2026" },
            { title: "Central Sector Scholarship", amount: "₹12,000", status: "Payment issue", owner: "You", blocker: "Beneficiary name mismatch", href: "/payments/css-2026" }
          ].map((row, index) => (
            <Link key={`${row.status}-${index}`} href={row.href} className="grid gap-3 border-b border-stone-100 p-5 transition last:border-b-0 hover:bg-stone-50 md:grid-cols-[1fr_0.8fr_0.8fr_auto] md:items-center">
              <div>
                <p className="font-bold text-ink">{row.title}</p>
                <p className="mt-1 text-sm text-muted">{row.amount}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-muted">Current status</p>
                <p className="mt-1 text-sm font-semibold text-ink">{row.status}</p>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-normal text-muted">Next owner</p>
                <p className="mt-1 text-sm font-semibold text-ink">{row.owner}</p>
              </div>
              <StatusBadge tone={row.owner === "You" ? "warning" : "active"}>{row.blocker}</StatusBadge>
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-[0.7fr_1.3fr]">
        <div className="rounded-xl bg-white p-5 shadow-sm ring-1 ring-stone-200">
          <div className="flex items-start gap-3">
            <Clock className="mt-1 text-amber-700" size={20} />
            <div>
              <h2 className="text-lg font-bold text-ink">Upcoming deadlines</h2>
              <p className="mt-2 text-sm leading-6 text-muted">Your document replacement should be completed before the application deadline.</p>
              <div className="mt-3">
                <DeadlineIndicator label="Your deadline" date="31 October" />
              </div>
            </div>
          </div>
        </div>

        <div className="opacity-80">
          <p className="mb-3 text-xs font-bold uppercase tracking-normal text-muted">Macro orientation</p>
          <JourneyStepper current={state.stage} />
        </div>
      </section>
    </div>
  );
}
