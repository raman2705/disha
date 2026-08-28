export function StatusExplanation({
  title,
  body,
  details
}: {
  title: string;
  body: string;
  details: { label: string; value: string }[];
}) {
  return (
    <section className="rounded-lg border border-blue-200 bg-blue-50 p-5">
      <h2 className="text-xl font-bold text-ink">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-700">{body}</p>
      <dl className="mt-5 grid gap-3 sm:grid-cols-2">
        {details.map((item) => (
          <div key={item.label} className="rounded-md bg-white p-3">
            <dt className="text-xs font-bold uppercase tracking-normal text-muted">{item.label}</dt>
            <dd className="mt-1 text-sm font-semibold text-ink">{item.value}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
