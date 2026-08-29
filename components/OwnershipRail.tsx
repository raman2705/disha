import clsx from "clsx";

export type OwnershipRailItem = {
  actor: string;
  state: "completed" | "current" | "waiting" | "blocked" | "student-action";
  detail?: string;
};

const stateStyles = {
  completed: {
    node: "h-4 w-4 bg-emerald-600 text-white",
    label: "text-ink",
    line: "bg-emerald-200",
    mark: "✓"
  },
  current: {
    node: "h-5 w-5 bg-[#3F5BD8] text-white ring-4 ring-[#3F5BD8]/15",
    label: "text-[#3F5BD8]",
    line: "bg-[#3F5BD8]",
    mark: ""
  },
  waiting: {
    node: "h-3.5 w-3.5 border-2 border-stone-300 bg-white text-transparent",
    label: "text-[#5F6C84]",
    line: "bg-stone-200",
    mark: ""
  },
  blocked: {
    node: "h-4 w-4 bg-red-600 text-transparent",
    label: "text-red-800",
    line: "bg-red-200",
    mark: ""
  },
  "student-action": {
    node: "h-4 w-4 bg-[#D97C68] text-transparent",
    label: "text-amber-900",
    line: "bg-amber-200",
    mark: ""
  }
};

function connectorTone(current: OwnershipRailItem, next: OwnershipRailItem) {
  if (current.state === "completed" && next.state === "completed") return "bg-emerald-200";
  if (current.state === "completed" && next.state === "current") return "bg-[#3F5BD8]";
  if (current.state === "current") return "bg-[#3F5BD8]/35";
  if (current.state === "student-action") return "bg-[#D97C68]/35";
  if (next.state === "blocked" || current.state === "blocked") return "bg-red-200";
  return "bg-stone-200";
}

export function OwnershipRail({
  items,
  evidence,
  className
}: {
  items: OwnershipRailItem[];
  evidence?: string;
  className?: string;
}) {
  return (
    <section className={clsx("rounded-xl bg-[#F5F6FF] px-4 py-4", className)}>
      <div className="overflow-x-auto pb-1">
        <ol className="grid min-w-[32rem] items-start" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
          {items.map((item, index) => {
            const styles = stateStyles[item.state];

            return (
              <li key={item.actor} className="relative">
                {index < items.length - 1 ? (
                  <span className={clsx("absolute left-[calc(50%+0.75rem)] right-[calc(-50%+0.75rem)] top-[9px] h-[2px]", connectorTone(item, items[index + 1]))} />
                ) : null}
                <div className="relative flex flex-col items-center text-center">
                  <span className={clsx("flex shrink-0 items-center justify-center rounded-full text-[10px] font-bold leading-none", styles.node)}>
                    {styles.mark}
                  </span>
                  <span className={clsx("mt-3 max-w-24 text-xs font-bold leading-4", styles.label)}>{item.actor}</span>
                  {item.detail ? <span className="mt-0.5 max-w-24 text-[11px] font-medium leading-4 text-muted">{item.detail}</span> : null}
                </div>
              </li>
            );
          })}
        </ol>
      </div>
      {evidence ? (
        <p className="mt-3 text-xs leading-5 text-muted">
          <span>Why this status?</span> {evidence}
        </p>
      ) : null}
    </section>
  );
}
