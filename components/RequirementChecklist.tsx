import clsx from "clsx";

export type Requirement = {
  label: string;
  state: "done" | "warning" | "missing" | "pending";
};

export function RequirementChecklist({ items }: { items: Requirement[] }) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li
          key={item.label}
          className={clsx(
            "flex items-start gap-3 rounded-md px-2 py-2 text-sm",
            item.state === "done" && "text-emerald-900",
            item.state === "warning" && "bg-amber-50 text-amber-950",
            item.state === "missing" && "bg-red-50 text-red-950",
            item.state === "pending" && "text-slate-700"
          )}
        >
          <span className="mt-0.5 font-bold">
            {item.state === "done" ? "✓" : item.state === "warning" ? "!" : item.state === "missing" ? "×" : "○"}
          </span>
          <span>{item.label}</span>
        </li>
      ))}
    </ul>
  );
}
