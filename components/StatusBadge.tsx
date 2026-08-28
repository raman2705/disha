import clsx from "clsx";

type Tone = "success" | "warning" | "danger" | "active" | "neutral";

const tones: Record<Tone, string> = {
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  danger: "border-red-200 bg-red-50 text-red-800",
  active: "border-blue-200 bg-blue-50 text-blue-800",
  neutral: "border-slate-200 bg-slate-100 text-slate-700"
};

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
