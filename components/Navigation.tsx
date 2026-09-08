"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import clsx from "clsx";
import { Bell, CheckCircle2, ChevronDown, ChevronUp, FileText, Map, Search, Sparkles, UserRound } from "lucide-react";
import { DishaWordmark } from "@/components/DishaMark";
import { useAppState } from "@/components/AppContext";
import {
  brand,
  canonicalGuidedDemoOpportunityId,
  getGuidedDemoApplication,
  getGuidedDemoPaymentApplication,
  getGuidedDemoRenewalApplication,
  institution,
  profile
} from "@/lib/data";
import { Language, languageLabels, translations } from "@/lib/i18n";

const nav = [
  { href: "/opportunities", labelKey: "opportunities", icon: Search },
  { href: "/applications", labelKey: "applications", icon: FileText },
  { href: "/path", labelKey: "path", icon: Map },
  { href: "/resources", labelKey: "resources", icon: Sparkles }
] as const;

export function Navigation() {
  const pathname = usePathname();
  const router = useRouter();
  const {
    guidedDemoActive,
    guidedDemoCollapsed,
    guidedDemoOpportunityId,
    setGuidedDemoCollapsed,
    setAssistantOpen,
    stopGuidedDemo,
    language,
    setLanguage
  } = useAppState();
  const [noticeOpen, setNoticeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const t = translations[language];
  const displayName = guidedDemoActive ? profile.name : "Your profile";
  const displayInitials = guidedDemoActive ? profile.initials : "YO";
  const guidedApplication = getGuidedDemoApplication(guidedDemoOpportunityId);
  const guidedPayment = getGuidedDemoPaymentApplication(guidedDemoOpportunityId);
  const guidedRenewal = getGuidedDemoRenewalApplication(guidedDemoOpportunityId);

  // The landing page gets a deliberately quiet header so the hero dominates. The guided demo keeps
  // the full header wherever it runs, so its step strip and exit control are never stranded.
  if (pathname === "/" && !guidedDemoActive) {
    return <LandingHeader />;
  }

  const demoSteps = buildDemoSteps(
    guidedApplication?.opportunityId ?? canonicalGuidedDemoOpportunityId,
    guidedApplication?.id ?? "pragati-readiness-2026",
    guidedPayment?.id ?? "pragati-payment-2026",
    guidedRenewal?.href ?? "/renewal"
  );

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-paper/95 backdrop-blur">
      <div className="mx-auto flex min-h-[76px] max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="flex shrink-0 items-center gap-3" aria-label={`${brand.name} home`}>
          <div className="leading-none">
            <div className="text-2xl font-black tracking-normal text-ink">दिशा</div>
            <div className="-mt-1 text-sm font-bold text-ink">{brand.name}</div>
          </div>
          <span className="hidden border-l border-stone-300 pl-3 text-xs font-semibold leading-4 text-muted sm:inline">
            Opportunities<br />for a brighter you
          </span>
        </Link>

        <nav className="hidden flex-1 justify-center gap-1 md:flex">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.href === "/opportunities" ? pathname.startsWith("/opportunities") || pathname.startsWith("/scholarships") : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "inline-flex min-h-10 shrink-0 items-center gap-2 border-b-2 px-3 py-2 text-sm font-semibold transition",
                  active ? "border-accent text-ink" : "border-transparent text-slate-600 hover:text-ink"
                )}
              >
                <Icon size={17} />
                {t.nav[item.labelKey]}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/opportunities"
            aria-label={t.nav.search}
            className="hidden h-10 w-10 items-center justify-center rounded-md text-slate-700 transition hover:bg-white sm:flex"
          >
            <Search size={18} />
          </Link>
          <label className="sr-only" htmlFor="language-select">Language</label>
          <select
            id="language-select"
            value={language}
            onChange={(event) => setLanguage(event.target.value as Language)}
            className="h-10 rounded-md border border-stone-200 bg-white px-2 text-sm font-semibold text-ink shadow-sm"
            aria-label="Language"
          >
            {Object.entries(languageLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setAssistantOpen(true)}
            className="inline-flex h-10 items-center gap-2 rounded-md bg-white px-3 text-sm font-semibold text-primary shadow-sm ring-1 ring-stone-200 transition hover:bg-[#EEF2FF]"
            aria-label={t.nav.assistant}
          >
            <Sparkles size={16} />
            <span className="hidden lg:inline">{t.nav.assistant}</span>
          </button>

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
                {guidedDemoActive ? (
                  <>
                    <p className="font-bold text-ink">1 application needs attention</p>
                    <p className="mt-1 leading-6 text-muted">Current income proof should be refreshed before submission.</p>
                    <Link href="/preflight" className="mt-3 inline-flex font-semibold text-primary" onClick={() => setNoticeOpen(false)}>
                      Fix now
                    </Link>
                  </>
                ) : (
                  <>
                    <p className="font-bold text-ink">No active application yet</p>
                    <p className="mt-1 leading-6 text-muted">Start an assessment to see what Disha can track for you.</p>
                    <Link href="/assess" className="mt-3 inline-flex font-semibold text-primary" onClick={() => setNoticeOpen(false)}>
                      Get started
                    </Link>
                  </>
                )}
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
                {displayInitials}
              </div>
              <span className="hidden text-sm font-semibold text-ink sm:inline">{displayName}</span>
              <UserRound size={16} className="text-muted" />
            </button>
            {profileOpen ? (
              <div className="absolute right-0 top-12 w-[22rem] max-w-[calc(100vw-2rem)] rounded-lg bg-white p-5 text-sm shadow-soft ring-1 ring-stone-200 state-pop">
                <p className="font-bold text-ink">{displayName}</p>
                <p className="mt-1 text-muted">
                  {guidedDemoActive ? `${profile.programme}, ${profile.college}` : "Add your details when you assess an opportunity."}
                </p>

                {guidedDemoActive ? (
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
                ) : (
                  <Link href="/assess" className="mt-5 inline-flex min-h-10 items-center rounded-md bg-primary px-4 py-2 text-sm font-bold text-white" onClick={() => setProfileOpen(false)}>
                    Start assessment
                  </Link>
                )}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      {guidedDemoActive ? (
        <GuidedDemoStrip
          pathname={pathname}
          steps={demoSteps}
          collapsed={guidedDemoCollapsed}
          onCollapsedChange={setGuidedDemoCollapsed}
          onExit={() => {
            stopGuidedDemo();
            router.push("/");
          }}
        />
      ) : null}
    </header>
  );
}

const landingNav = [
  { href: "/opportunities", label: "Explore" },
  { href: "/assess", label: "Assess" },
  { href: "/#how-it-works", label: "How it works" },
  { href: "/#about", label: "About Disha" }
];

function LandingHeader() {
  return (
    <header className="border-b border-stone-200/70 bg-paper">
      <div className="mx-auto flex min-h-[76px] max-w-5xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-5 py-3 sm:px-8">
        <Link href="/" aria-label={`${brand.name} home`} className="shrink-0">
          <DishaWordmark size="sm" />
        </Link>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <nav aria-label="Primary" className="hidden items-center gap-1 md:flex">
            {landingNav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="rounded-md px-3 py-2 text-sm font-semibold text-slate-600 transition hover:text-ink"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/opportunities"
            className="inline-flex min-h-10 items-center rounded-full bg-primary px-4 text-sm font-bold text-white transition hover:bg-blue-700"
          >
            Explore opportunities
          </Link>
        </div>
      </div>
    </header>
  );
}

function buildDemoSteps(opportunityId: string, applicationId: string, paymentId: string, renewalHref: string) {
  return [
    { label: "Discover", href: "/demo" },
    { label: "Assess", href: `/opportunities/${opportunityId}/assess` },
    { label: "Prepare", href: "/preflight" },
    { label: "Apply", href: "/apply" },
    { label: "Verification", href: `/applications/${applicationId}` },
    { label: "Payment", href: `/payments/${paymentId}` },
    { label: "Renewal", href: renewalHref }
  ];
}

function GuidedDemoStrip({
  pathname,
  steps,
  collapsed,
  onCollapsedChange,
  onExit
}: {
  pathname: string;
  steps: ReturnType<typeof buildDemoSteps>;
  collapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  onExit: () => void;
}) {
  const currentIndex = currentDemoStep(pathname);
  const currentStep = steps[currentIndex];

  if (collapsed) {
    return (
      <div className="border-t border-stone-200 bg-white/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-2 sm:px-6 lg:px-8">
          <p className="min-w-0 truncate text-xs font-bold text-ink">
            Demo with {profile.name} · {currentStep.label} {currentIndex + 1}/{steps.length}
          </p>
          <button
            type="button"
            onClick={() => onCollapsedChange(false)}
            aria-label="Expand demo navigation"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-stone-100 hover:text-ink"
          >
            <ChevronDown size={17} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="border-t border-stone-200 bg-white/90">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-2.5 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
        <div className="flex min-w-0 flex-col gap-0.5 text-xs">
          <span className="font-bold text-ink">Demo with {profile.name}</span>
          <span className="font-semibold text-muted">{profile.role}</span>
        </div>
        <div className="flex items-center gap-2 overflow-x-auto">
          <ol className="flex min-w-max items-center gap-1">
            {steps.map((step, index) => {
              const active = index === currentIndex;
              const done = index < currentIndex;
              return (
                <li key={step.label} className="flex items-center gap-1">
                  <Link
                    href={step.href}
                    aria-current={active ? "step" : undefined}
                    className={clsx(
                      "rounded-full px-2.5 py-1 text-xs font-bold transition",
                      active && "bg-primary text-white",
                      done && "bg-emerald-50 text-emerald-800",
                      !active && !done && "bg-stone-100 text-slate-600 hover:bg-stone-200"
                    )}
                  >
                    {step.label}
                  </Link>
                  {index < steps.length - 1 ? <span className="text-stone-300">→</span> : null}
                </li>
              );
            })}
          </ol>
          <button
            type="button"
            onClick={() => onCollapsedChange(true)}
            aria-label="Collapse demo navigation"
            className="ml-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-slate-600 transition hover:bg-stone-100 hover:text-ink"
          >
            <ChevronUp size={17} />
          </button>
          <button
            type="button"
            onClick={onExit}
            className="ml-1 shrink-0 rounded-full px-3 py-1 text-xs font-bold text-slate-500 transition hover:bg-stone-100 hover:text-ink"
          >
            Exit demo
          </button>
        </div>
      </div>
    </div>
  );
}

function currentDemoStep(pathname: string) {
  if (pathname.startsWith("/demo")) return 0;
  if (pathname.startsWith("/opportunities") && pathname.endsWith("/assess")) return 1;
  if (pathname.startsWith("/preflight")) return 2;
  if (pathname.startsWith("/apply")) return 3;
  if (pathname.startsWith("/applications")) return 4;
  if (pathname.startsWith("/payments")) return 5;
  if (pathname.startsWith("/renewal")) return 6;
  return 0;
}
