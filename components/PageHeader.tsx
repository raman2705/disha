export function PageHeader({
  eyebrow,
  title,
  children
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-8">
      {eyebrow ? <p className="mb-2 text-sm font-semibold text-accent">{eyebrow}</p> : null}
      <h1 className="max-w-3xl text-3xl font-bold tracking-normal text-ink sm:text-4xl">{title}</h1>
      {children ? <div className="mt-3 max-w-3xl text-base leading-7 text-muted">{children}</div> : null}
    </header>
  );
}
