import { Link } from 'react-router-dom';

export function AboutPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-6">
      <div>
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          About Cadence
        </h1>
        <p className="mt-3 text-[var(--cadence-fg-muted)]">
          Cadence is a personal music catalog - rate songs, rank artists, and
          keep covers in one place.
        </p>
      </div>

      <div className="cadence-panel flex flex-col gap-3 p-5 text-sm leading-relaxed text-[var(--cadence-fg-muted)]">
        <p>
          Browse Top 10 lists on Home, manage the full songs and artists
          catalog, and add new entries with ImageKit covers when you want them.
        </p>
        <p>
          Built as a TypeScript monorepo with Vite + React on the web and
          Express + Prisma (MySQL / TiDB) on the API.
        </p>
      </div>

      <p className="text-sm">
        <Link
          to="/"
          className="font-medium text-[var(--cadence-fg)] underline underline-offset-4"
        >
          Back to home
        </Link>
      </p>
    </section>
  );
}
