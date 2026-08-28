export function DeadlineIndicator({ label, date }: { label?: string; date: string }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
      <span className="font-semibold">{label ?? "Deadline"}:</span>
      <span>{date}</span>
    </div>
  );
}
