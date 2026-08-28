"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Bell, CheckCircle2, CreditCard, FileText, GraduationCap, Home, Search, UserRound } from "lucide-react";
import { brand, demoStates, institution, profile } from "@/lib/data";
import { useAppState } from "@/components/AppContext";

const nav = [
  { href: "/dashboard", label: "Home", icon: Home },
  { href: "/scholarships", label: "Explore", icon: Search },
  { href: "/applications/css-2026", label: "My applications", icon: FileText },
  { href: "/payments/css-2026", label: "Payments", icon: CreditCard },
  { href: "/renewal", label: "Renewal", icon: GraduationCap }
];

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const { demoState, setDemoState } = useAppState();
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const publicHome = pathname === "/";

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-[#fbfaf7]/95 backdrop-blur">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${brand.name} home`}>
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-sm font-bold text-white">D</div>
          <span className="text-base font-bold text-ink">{brand.name}</span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-1 md:flex">
          {(publicHome ? [] : nav).map((item) => {
            const Icon = item.icon;
            const active = item.href === "/dashboard" ? pathname === "/dashboard" : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "inline-flex min-h-10 shrink-0 items-center gap-2 rounded-md px-3 py-2 text-sm font-semibold transition",
                  active ? "bg-white text-primary shadow-sm" : "text-slate-600 hover:bg-white/70 hover:text-ink"
                )}
              >
                <Icon size={17} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {publicHome ? (
          <div className="flex items-center gap-2">
            <Link href="/scholarships" className="hidden text-sm font-semibold text-slate-700 hover:text-primary sm:inline">
              Explore scholarships
            </Link>
            <Link href="/dashboard" className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-primary shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-50">
              Try sample profile
            </Link>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <div className="relative hidden sm:block">
              <button
                type="button"
                aria-label="Notifications"
                onClick={() => setNoticeOpen((value) => !value)}
                className="flex h-10 w-10 items-center justify-center rounded-md border border-slate-200 text-slate-600 transition hover:bg-slate-50"
              >
                <Bell size={18} />
              </button>
              {noticeOpen ? (
                <div className="absolute right-0 top-12 w-72 rounded-lg border border-slate-200 bg-white p-4 text-sm shadow-soft state-pop">
                  <p className="font-bold text-ink">1 application needs attention</p>
                  <p className="mt-1 leading-6 text-muted">Institute enrolment proof is still required before submission.</p>
                  <Link href="/preflight" className="mt-3 inline-flex font-semibold text-primary" onClick={() => setNoticeOpen(false)}>
                    Fix now
                  </Link>
                </div>
              ) : null}
            </div>
            <div className="relative">
              <button
                type="button"
                aria-label="Open profile menu"
                onClick={() => setProfileOpen((value) => !value)}
                className="flex items-center gap-2 rounded-md bg-white px-2 py-1.5 shadow-sm ring-1 ring-stone-200 transition hover:bg-stone-50"
              >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-primary">
                {profile.initials}
              </div>
              <span className="hidden text-sm font-semibold text-ink sm:inline">{profile.name}</span>
              <UserRound size={16} className="text-muted" />
              </button>
              {profileOpen ? (
                <div className="absolute right-0 top-12 w-[22rem] max-w-[calc(100vw-2rem)] rounded-lg bg-white p-5 text-sm shadow-soft ring-1 ring-stone-200 state-pop">
                  <p className="font-bold text-ink">{profile.name}</p>
                  <p className="mt-1 text-muted">{profile.programme}, {profile.college}</p>

                  <div className="mt-5 border-t border-stone-200 pt-4">
                    <h2 className="font-bold text-ink">Institution & scholarship support</h2>
                    <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <dt className="font-semibold text-muted">Institute linked</dt>
                        <dd className="mt-1 text-ink">{institution.linked}</dd>
                      </div>
                      <div>
                        <dt className="font-semibold text-muted">Enrolment confirmed</dt>
                        <dd className="mt-1 text-ink">{institution.enrolmentConfirmed}</dd>
                      </div>
                      <div className="col-span-2">
                        <dt className="font-semibold text-muted">Scholarship Cell</dt>
                        <dd className="mt-1 text-ink">{institution.cell}</dd>
                      </div>
                    </dl>
                    <ul className="mt-3 space-y-2 text-xs text-slate-700">
                      <li className="flex gap-2"><CheckCircle2 size={15} className="text-emerald-700" /> Enrolment confirmation</li>
                      <li className="flex gap-2"><CheckCircle2 size={15} className="text-emerald-700" /> Required document uploaded</li>
                      <li className="flex gap-2"><span className="mt-1 h-2 w-2 rounded-full bg-primary" /> Scholarship verification pending</li>
                    </ul>
                  </div>

                  <div className="mt-5 border-t border-stone-200 pt-4">
                    <label className="text-xs font-bold uppercase tracking-normal text-muted" htmlFor="scenario-select">
                      Prototype scenarios
                    </label>
                    <select
                      id="scenario-select"
                      value={demoState}
                      onChange={(event) => {
                        const value = event.target.value as keyof typeof demoStates;
                        setDemoState(value);
                        setProfileOpen(false);
                        router.push(demoStates[value].href);
                      }}
                      className="mt-2 h-10 w-full rounded-md border border-stone-300 bg-white px-3 font-semibold text-ink"
                    >
                      {Object.entries(demoStates).map(([value, state]) => (
                        <option key={value} value={value}>
                          {state.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
