import clsx from "clsx";

export function ApplicationProgress({ steps, current }: { steps: string[]; current: number }) {
  return (
    <ol className="grid gap-2 sm:grid-cols-4">
      {steps.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li
            key={step}
            className={clsx(
              "rounded-md border p-3 text-sm",
              done && "border-emerald-200 bg-emerald-50 text-emerald-950",
              active && "border-blue-300 bg-blue-50 text-blue-950 ring-2 ring-blue-100",
              !done && !active && "border-slate-200 bg-slate-50 text-slate-600"
            )}
          >
            <span className="font-bold">{done ? "✓" : index + 1}</span>
            <span className="ml-2 font-semibold">{step}</span>
          </li>
        );
      })}
    </ol>
  );
}
