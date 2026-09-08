"use client";

import { usePathname } from "next/navigation";
import { Sparkles } from "lucide-react";
import { useAppState } from "@/components/AppContext";

/**
 * A persistent way into the assistant on every product page.
 *
 * It opens the existing drawer rather than navigating anywhere, so the assistant always answers
 * against the page the visitor is actually looking at. The landing page carries its own nav entry
 * and is left alone so the hero stays quiet.
 */
export function AssistantLauncher() {
  const pathname = usePathname();
  const { assistantOpen, setAssistantOpen } = useAppState();

  if (pathname === "/" || assistantOpen) return null;

  return (
    <button
      type="button"
      onClick={() => setAssistantOpen(true)}
      aria-label="Open Disha Assistant"
      className="fixed bottom-4 right-4 z-50 sm:bottom-[10rem] inline-flex min-h-12 items-center gap-2 rounded-full bg-primary px-4 text-sm font-black text-white shadow-soft transition hover:bg-blue-700 print:hidden"
    >
      <Sparkles size={17} aria-hidden="true" />
      Ask Disha
    </button>
  );
}
