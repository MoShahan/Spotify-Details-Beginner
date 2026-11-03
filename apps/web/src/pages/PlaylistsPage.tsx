import { PageHeader } from '../components/layout/PageHeader';

export function PlaylistsPage() {
  return (
    <section className="flex flex-col gap-6">
      <PageHeader
        title="Playlists"
        subtitle="Create your own playlists and add songs to them."
      />

      <div className="cadence-panel flex max-w-xl flex-col gap-2 px-4 py-6 sm:px-6">
        <p className="font-medium text-[var(--cadence-fg)]">Coming soon</p>
        <p className="text-sm leading-relaxed text-[var(--cadence-fg-muted)]">
          Playlists are not available yet. When they ship, you will be able to
          create your own playlists and add songs to each one.
        </p>
      </div>
    </section>
  );
}
