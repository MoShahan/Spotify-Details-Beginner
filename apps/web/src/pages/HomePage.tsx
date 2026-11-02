import { useAuth } from '../contexts/auth';

/** Placeholder until Phase 2.3 Top 10 lists. */
export function HomePage() {
  const { user } = useAuth();

  return (
    <section className="flex flex-col gap-4">
      <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
        Home
      </h1>
      <p className="max-w-xl text-[var(--cadence-fg-muted)]">
        Welcome{user ? `, ${user.name}` : ''}. Top 10 songs and artists land in
        the next checklist items.
      </p>
    </section>
  );
}
