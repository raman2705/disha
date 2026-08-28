import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function ActionRequired({
  title,
  body,
  actor,
  deadline,
  href,
  cta
}: {
  title: string;
  body: string;
  actor: string;
  deadline: string;
  href: string;
  cta: string;
}) {
  return (
    <section className="rounded-lg border border-amber-200 bg-amber-50 p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-sm font-bold uppercase tracking-normal text-amber-800">Action required</p>
          <h2 className="mt-1 text-xl font-bold text-ink">{title}</h2>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-700">{body}</p>
          <div className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
            <p>
              <span className="font-semibold text-ink">Who needs to act:</span> {actor}
            </p>
            <p>
              <span className="font-semibold text-ink">Deadline:</span> {deadline}
            </p>
          </div>
        </div>
        <Link
          href={href}
          className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-900"
        >
          {cta}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      </div>
    </section>
  );
}
