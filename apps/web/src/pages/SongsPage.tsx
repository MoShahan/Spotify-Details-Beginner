import { useEffect, useState } from 'react';

import { CatalogListSkeleton } from '../components/catalog/CatalogListSkeleton';
import { ListToolbar } from '../components/catalog/ListToolbar';
import { api, getApiErrorMessage } from '../lib/api';
import {
  type CatalogSong,
  formatRating,
  type SongSortBy,
  type SortOrder,
} from '../lib/catalog';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; songs: CatalogSong[] };

const SORT_OPTIONS = [
  { value: 'name', label: 'Name' },
  { value: 'rating', label: 'Rating' },
  { value: 'releaseYear', label: 'Release year' },
  { value: 'album', label: 'Album' },
];

export function SongsPage() {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState<SongSortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState({ status: 'loading' });
      try {
        const res = await api.get<{ songs: CatalogSong[] }>('/songs', {
          params: {
            q: search.trim() || undefined,
            sortBy,
            sortOrder,
          },
        });
        if (!cancelled) {
          setState({ status: 'ready', songs: res.data.songs });
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: getApiErrorMessage(error, 'Could not load songs'),
          });
        }
      }
    }

    const timer = window.setTimeout(() => {
      void load();
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [search, sortBy, sortOrder]);

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Songs
        </h1>
        <p className="text-sm text-[var(--cadence-fg-muted)]">
          Browse the catalog. Search and sort by name, rating, release year, or
          album.
        </p>
      </div>

      <ListToolbar
        search={search}
        onSearchChange={setSearch}
        sortBy={sortBy}
        sortByOptions={SORT_OPTIONS}
        onSortByChange={(value) => {
          setSortBy(value as SongSortBy);
        }}
        sortOrder={sortOrder}
        onSortOrderChange={setSortOrder}
        searchPlaceholder="Search title, artist, album, year..."
      />

      {state.status === 'loading' ? <CatalogListSkeleton /> : null}

      {state.status === 'error' ? (
        <div
          className="rounded-md border border-[var(--cadence-border)] bg-[var(--cadence-surface)] px-4 py-6 text-sm text-[var(--cadence-fg-muted)]"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      {state.status === 'ready' && state.songs.length === 0 ? (
        <p className="text-sm text-[var(--cadence-fg-muted)]">
          No songs match your search.
        </p>
      ) : null}

      {state.status === 'ready' && state.songs.length > 0 ? (
        <ul className="flex flex-col">
          {state.songs.map((song) => (
            <li
              key={song.id}
              className="flex flex-col gap-1 border-b border-[var(--cadence-border)] py-4 last:border-b-0 sm:flex-row sm:items-start sm:justify-between sm:gap-4"
            >
              <div className="min-w-0 flex-1">
                <p className="font-medium text-[var(--cadence-fg)]">
                  {song.name}
                </p>
                <p className="truncate text-sm text-[var(--cadence-fg-muted)]">
                  {song.artists.map((a) => a.name).join(', ') ||
                    'Unknown artist'}
                </p>
                <p className="mt-1 text-xs text-[var(--cadence-fg-muted)]">
                  {song.releaseYear}
                  {song.album ? ` · ${song.album}` : ''}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums">
                {formatRating(song.averageRating)}
              </span>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
