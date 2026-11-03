import { Link } from 'react-router-dom';

import { PageHeader } from '../components/layout/PageHeader';

const FEATURES = [
  {
    title: 'Home',
    body: 'Top 10 songs and artists by average rating, with covers front and center.',
  },
  {
    title: 'Catalog',
    body: 'Search and sort the full songs and artists lists, then open detail pages.',
  },
  {
    title: 'Covers',
    body: 'Add or update artwork with ImageKit uploads or a direct URL.',
  },
] as const;

const UPCOMING = [
  {
    title: 'Playlists',
    body: 'Create your own playlists and add songs to them.',
  },
  {
    title: 'Reset / forgot password',
    body: 'Request a password reset and choose a new password.',
  },
  {
    title: 'Song links',
    body: 'YouTube, Deezer, and Spotify links on each song.',
  },
  {
    title: 'Lyrics',
    body: 'Full lyrics on song detail (placeholder is live today).',
  },
  {
    title: 'Home search',
    body: 'Search from Home without jumping into the full catalog first.',
  },
  {
    title: 'Artist identity',
    body: 'Richer artist identity, such as name with DOB and nationality.',
  },
  {
    title: 'Audio player',
    body: 'Spotify integration or a full in-app audio player.',
  },
] as const;

export function AboutPage() {
  return (
    <section className="mx-auto flex w-full max-w-2xl flex-col gap-8">
      <PageHeader
        title="About Cadence"
        subtitle="Cadence is a personal music catalog - rate songs, rank artists, and keep covers in one place."
      />

      <ul className="flex flex-col divide-y divide-[var(--cadence-border)] border-y border-[var(--cadence-border)]">
        {FEATURES.map((feature) => (
          <li key={feature.title} className="flex flex-col gap-1 py-4">
            <p className="font-medium text-[var(--cadence-fg)]">
              {feature.title}
            </p>
            <p className="text-sm leading-relaxed text-[var(--cadence-fg-muted)]">
              {feature.body}
            </p>
          </li>
        ))}
      </ul>

      <div className="flex flex-col gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--cadence-fg-muted)]">
          Coming soon
        </h2>
        <ul className="flex flex-col divide-y divide-[var(--cadence-border)] border-y border-[var(--cadence-border)]">
          {UPCOMING.map((item) => (
            <li key={item.title} className="flex flex-col gap-1 py-3">
              <p className="text-sm font-medium text-[var(--cadence-fg)]">
                {item.title}
              </p>
              <p className="text-sm leading-relaxed text-[var(--cadence-fg-muted)]">
                {item.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      <p className="text-sm leading-relaxed text-[var(--cadence-fg-muted)]">
        Built as a TypeScript monorepo with Vite + React on the web and Express
        + Prisma (MySQL / TiDB) on the API.
      </p>

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
