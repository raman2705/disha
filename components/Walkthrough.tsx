"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, X } from "lucide-react";
import { useAppState } from "@/components/AppContext";
import { localiseStep, walkthroughLength, walkthroughStepForPath } from "@/lib/walkthrough";
import { translations } from "@/lib/i18n";

/**
 * A single contextual hint, pinned to the corner of the page the visitor is already on.
 *
 * Not a modal: it never covers the thing it is describing, and the page stays fully usable behind
 * it. It advances by itself when the visitor reaches the next stage, so following the hint and
 * ignoring it lead to the same place.
 */
export function Walkthrough() {
  const pathname = usePathname();
  const { guidedDemoActive, walkthroughDismissed, dismissWalkthrough, stopGuidedDemo, language } = useAppState();
  const [collapsed, setCollapsed] = useState(false);
  const current = walkthroughStepForPath(pathname);

  // A new stage always reopens the hint, otherwise collapsing once would silence the rest.
  useEffect(() => setCollapsed(false), [current?.step.id]);

  if (!guidedDemoActive || walkthroughDismissed || !current) return null;

  const { step, index } = current;
  const copy = localiseStep(step, language);
  const t = translations[language].walkthrough;

  if (collapsed) {
    return (
      <div className="fixed bottom-20 left-4 z-40 sm:bottom-4 print:hidden">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white shadow-soft"
        >
          <Compass size={15} aria-hidden="true" />
          {t.step} {index + 1} {t.of} {walkthroughLength}: {copy.stage}
        </button>
      </div>
    );
  }

  // Stacked above the assistant launcher on narrow screens so the hint never covers it.
  return (
    <aside
      aria-label="Sample journey walkthrough"
      className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl bg-ink p-4 text-white shadow-soft sm:bottom-0 sm:left-0 sm:right-0 sm:mx-0 sm:max-w-none sm:rounded-b-none sm:rounded-t-2xl sm:px-6 sm:py-2.5 print:hidden"
    >
      <div className="mx-auto flex max-w-7xl items-start justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/70">
          <Compass size={13} aria-hidden="true" />
          {copy.stage} · {t.step} {index + 1} {t.of} {walkthroughLength}
        </p>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label={t.collapse}
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mx-auto mt-2 h-0.5 w-full max-w-7xl overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${Math.round(((index + 1) / walkthroughLength) * 100)}%` }}
        />
      </div>

      <div className="mx-auto mt-3 max-w-7xl sm:mt-1.5 sm:flex sm:items-center sm:gap-5">
        <div className="min-w-0 sm:flex-1">
          <h2 className="text-base font-black leading-tight sm:text-sm">{copy.title}</h2>
          <p className="mt-1.5 text-sm leading-6 text-white/80 sm:hidden">{copy.body}</p>
        </div>
        <p className="mt-3 shrink-0 rounded-lg bg-white/10 p-2.5 text-sm font-semibold leading-5 sm:mt-0 sm:max-w-md sm:py-1.5 sm:text-xs">{copy.action}</p>
      </div>

      <div className="mx-auto mt-3.5 flex max-w-7xl flex-wrap items-center gap-x-4 gap-y-2 sm:mt-1.5">
        {step.href ? (
          <Link
            href={step.href}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-black text-ink transition hover:bg-white/90"
          >
            {t.next}: {nextStage(step.href, language)}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ) : null}
        <button type="button" onClick={dismissWalkthrough} className="text-xs font-bold text-white/70 underline underline-offset-2 hover:text-white">
          {t.skip}
        </button>
        <button type="button" onClick={stopGuidedDemo} className="text-xs font-bold text-white/70 underline underline-offset-2 hover:text-white">
          {t.exit}
        </button>
      </div>
    </aside>
  );
}

function nextStage(href: string, language: "en" | "hi") {
  const target = walkthroughStepForPath(href);
  return target ? localiseStep(target.step, language).stage : "";
}
