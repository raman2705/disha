import clsx from "clsx";

type Tone = "success" | "warning" | "danger" | "active" | "neutral";

const tones: Record<Tone, string> = {
  success: "border-emerald-200 bg-[#E8F3EC] text-emerald-800",
  warning: "border-amber-200 bg-[#FFF3DD] text-amber-900",
  danger: "border-red-200 bg-[#FDEBEC] text-red-800",
  active: "border-indigo-200 bg-[#EEF2FF] text-primary",
  neutral: "border-slate-200 bg-slate-100 text-slate-700"
};

export function StatusBadge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={clsx("inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold", tones[tone])}>
      {children}
    </span>
  );
}
