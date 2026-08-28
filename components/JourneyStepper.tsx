import clsx from "clsx";
import { journey, Stage } from "@/lib/data";

export function JourneyStepper({ current }: { current: Stage }) {
  const currentIndex = journey.indexOf(current);

  return (
    <div className="rounded-xl bg-white px-4 py-3 shadow-sm ring-1 ring-stone-200">
      <ol className="flex flex-wrap items-center gap-x-3 gap-y-2">
        {journey.map((stage, index) => {
          const complete = index < currentIndex;
          const active = index === currentIndex;
          return (
            <li
              key={stage}
              className={clsx(
                "inline-flex min-h-8 items-center gap-2 rounded-full px-2.5 py-1 text-xs font-semibold transition-colors",
                complete && "text-emerald-800",
                active && "bg-indigo-50 text-primary ring-1 ring-indigo-100",
                !complete && !active && "text-slate-500"
              )}
            >
              <div
                className={clsx(
                  "flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-bold",
                  complete && "bg-emerald-600 text-white",
                  active && "bg-primary text-white",
                  !complete && !active && "bg-slate-200 text-slate-500"
                )}
              >
                {complete ? "✓" : index + 1}
              </div>
              <span>{stage}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
