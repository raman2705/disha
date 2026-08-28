import clsx from "clsx";

type TimelineItem = {
  label: string;
  state: "done" | "active" | "blocked" | "pending";
  detail?: string;
};

const marker = {
  done: "bg-emerald-600 text-white",
  active: "bg-primary text-white",
  blocked: "bg-red-600 text-white",
  pending: "bg-slate-200 text-slate-500"
};

export function VerificationTimeline({ items }: { items: TimelineItem[] }) {
  return <Timeline items={items} />;
}

export function PaymentTimeline({ items }: { items: TimelineItem[] }) {
  return <Timeline items={items} />;
}

function Timeline({ items }: { items: TimelineItem[] }) {
  return (
    <ol className="grid gap-3 md:grid-cols-4">
      {items.map((item, index) => (
        <li
          key={item.label}
          className={clsx(
            "rounded-md border bg-white p-4",
            item.state === "active" && "border-blue-300 ring-2 ring-blue-100",
            item.state === "blocked" && "border-red-300 bg-red-50 ring-2 ring-red-100",
            item.state === "done" && "border-emerald-200",
            item.state === "pending" && "border-slate-200"
          )}
        >
          <div className={clsx("mb-3 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold", marker[item.state])}>
            {item.state === "done" ? "✓" : item.state === "blocked" ? "!" : index + 1}
          </div>
          <p className="font-semibold text-ink">{item.label}</p>
          {item.detail ? <p className="mt-1 text-sm text-muted">{item.detail}</p> : null}
        </li>
      ))}
    </ol>
  );
}
