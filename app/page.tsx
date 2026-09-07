"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle2, Compass, FileSearch } from "lucide-react";
import { useAppState } from "@/components/AppContext";
import { brand } from "@/lib/data";

export default function LandingPage() {
  const router = useRouter();
  const { startGuidedDemo } = useAppState();

  const tryDemo = () => {
    startGuidedDemo();
    router.push("/demo");
  };

  return (
    <div className="relative left-1/2 -mt-12 w-screen -translate-x-1/2 bg-paper">
      <section className="mx-auto flex min-h-[calc(100vh-76px)] max-w-5xl flex-col justify-center px-5 py-16 sm:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-black uppercase tracking-[0.22em] text-[#9B6D55]">{brand.name}</p>
          <h1 className="mt-5 font-serif text-5xl font-black leading-[1.02] tracking-normal text-ink sm:text-6xl lg:text-7xl">
            Find the right opportunity.
            <br />
            Know how strong your application really is.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-slate-700">
            Disha helps you understand what an opportunity needs, what your evidence supports, what to improve before applying, and what happens next.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Link
              href="/assess"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary px-5 py-3 text-sm font-black text-white shadow-sm transition hover:bg-blue-700"
            >
              Assess an opportunity
              <ArrowRight size={18} />
            </Link>
            <button
              type="button"
              onClick={tryDemo}
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-black text-ink shadow-sm ring-1 ring-stone-200 transition hover:bg-[#FBF7F1]"
            >
              Try the demo
              <ArrowRight size={18} />
            </button>
          </div>
        </div>

        <div className="mt-14 grid gap-4 sm:grid-cols-3">
          {[
            { icon: Compass, title: "Discover", body: "Choose a real opportunity to assess." },
            { icon: FileSearch, title: "Assess", body: "See eligibility, fit and readiness separately." },
            { icon: CheckCircle2, title: "Improve", body: "Fix the evidence that matters most." }
          ].map((item) => {
            const Icon = item.icon;
            return (
              <article key={item.title} className="border-t border-stone-200 pt-5">
                <Icon className="text-primary" size={22} />
                <h2 className="mt-4 text-xl font-black text-ink">{item.title}</h2>
                <p className="mt-2 text-sm leading-6 text-muted">{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
