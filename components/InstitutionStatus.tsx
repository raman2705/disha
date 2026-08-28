import clsx from "clsx";
import { CheckCircle2, Circle, Clock3 } from "lucide-react";
import { institution } from "@/lib/data";

type Mode = "waiting" | "completed" | "compact";

export function InstitutionStatus({ mode = "waiting" }: { mode?: Mode }) {
  const completed = mode === "completed";

  return (
    <section
      className={clsx(
        "rounded-lg bg-white p-5 shadow-sm state-pop",
        completed ? "ring-1 ring-emerald-200" : "ring-1 ring-slate-200"
      )}
    >
      <p className="text-xs font-bold uppercase tracking-normal text-muted">Institution status</p>
      <h2 className="mt-2 text-xl font-bold text-ink">{institution.cell}</h2>
      <div className="mt-4 space-y-3 text-sm text-slate-700">
        <StatusLine done label="Enrolment confirmed" />
        <StatusLine done label="Required institute document uploaded" />
        <StatusLine
          active={!completed}
          done={completed}
          label={completed ? "Scholarship verification completed" : "Scholarship verification pending"}
        />
      </div>
      <div className={clsx("mt-5 rounded-md p-4", completed ? "bg-emerald-50" : "bg-slate-50")}>
        <h3 className="font-semibold text-ink">
          {completed ? "Your institute completed its action" : "Your institute needs to act next"}
        </h3>
        <p className="mt-2 text-sm leading-6 text-muted">
          {completed
            ? `${institution.name} uploaded the required confirmation on ${institution.completedDate}.`
            : `${institution.name} needs to verify your enrolment and submitted documents before your application can move forward.`}
        </p>
        <p className="mt-3 text-sm">
          <span className="font-semibold text-ink">You need to do anything?</span>{" "}
          {completed ? "No. Your application is now waiting for state verification." : "No action required right now."}
        </p>
      </div>
    </section>
  );
}

function StatusLine({ label, done, active }: { label: string; done?: boolean; active?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      {done ? (
        <CheckCircle2 className="text-emerald-700" size={18} />
      ) : active ? (
        <Clock3 className="text-primary" size={18} />
      ) : (
        <Circle className="text-slate-400" size={18} />
      )}
      <span className={clsx(active && "font-semibold text-ink")}>{label}</span>
    </div>
  );
}
