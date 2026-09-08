"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowRight, Compass, X } from "lucide-react";
import { useAppState } from "@/components/AppContext";
import { walkthroughLength, walkthroughStepForPath } from "@/lib/walkthrough";

/**
 * A single contextual hint, pinned to the corner of the page the visitor is already on.
 *
 * Not a modal: it never covers the thing it is describing, and the page stays fully usable behind
 * it. It advances by itself when the visitor reaches the next stage, so following the hint and
 * ignoring it lead to the same place.
 */
export function Walkthrough() {
  const pathname = usePathname();
  const { guidedDemoActive, walkthroughDismissed, dismissWalkthrough, stopGuidedDemo } = useAppState();
  const [collapsed, setCollapsed] = useState(false);
  const current = walkthroughStepForPath(pathname);

  // A new stage always reopens the hint, otherwise collapsing once would silence the rest.
  useEffect(() => setCollapsed(false), [current?.step.id]);

  if (!guidedDemoActive || walkthroughDismissed || !current) return null;

  const { step, index } = current;

  if (collapsed) {
    return (
      <div className="fixed bottom-20 left-4 z-40 sm:bottom-4 print:hidden">
        <button
          type="button"
          onClick={() => setCollapsed(false)}
          className="inline-flex items-center gap-2 rounded-full bg-ink px-4 py-2.5 text-xs font-bold text-white shadow-soft"
        >
          <Compass size={15} aria-hidden="true" />
          Step {index + 1} of {walkthroughLength}: {step.stage}
        </button>
      </div>
    );
  }

  // Stacked above the assistant launcher on narrow screens so the hint never covers it.
  return (
    <aside
      aria-label="Sample journey walkthrough"
      className="fixed bottom-20 left-4 right-4 z-40 mx-auto max-w-sm rounded-2xl bg-ink p-4 text-white shadow-soft sm:bottom-4 sm:right-auto sm:mx-0 print:hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[11px] font-black uppercase tracking-[0.14em] text-white/70">
          <Compass size={13} aria-hidden="true" />
          {step.stage} · step {index + 1} of {walkthroughLength}
        </p>
        <button
          type="button"
          onClick={() => setCollapsed(true)}
          aria-label="Collapse walkthrough hint"
          className="-mr-1 -mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X size={15} />
        </button>
      </div>

      <div className="mt-2 h-0.5 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-accent transition-all duration-500"
          style={{ width: `${Math.round(((index + 1) / walkthroughLength) * 100)}%` }}
        />
      </div>

      <h2 className="mt-3 text-base font-black leading-tight">{step.title}</h2>
      <p className="mt-1.5 text-sm leading-6 text-white/80">{step.body}</p>
      <p className="mt-3 rounded-lg bg-white/10 p-2.5 text-sm font-semibold leading-5">{step.action}</p>

      <div className="mt-3.5 flex flex-wrap items-center gap-x-4 gap-y-2">
        {step.href ? (
          <Link
            href={step.href}
            className="inline-flex min-h-9 items-center gap-1.5 rounded-full bg-white px-3.5 text-xs font-black text-ink transition hover:bg-white/90"
          >
            Next: {walkthroughStepForPath(step.href)?.step.stage ?? "Continue"}
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
        ) : null}
        <button type="button" onClick={dismissWalkthrough} className="text-xs font-bold text-white/70 underline underline-offset-2 hover:text-white">
          Skip walkthrough
        </button>
        <button type="button" onClick={stopGuidedDemo} className="text-xs font-bold text-white/70 underline underline-offset-2 hover:text-white">
          Exit sample
        </button>
      </div>
    </aside>
  );
}
