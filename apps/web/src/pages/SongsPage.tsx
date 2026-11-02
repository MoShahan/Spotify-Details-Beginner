import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { CatalogSearch } from '../components/catalog/CatalogSearch';
import { SortableTh } from '../components/catalog/SortableTh';
import { TableBodySkeleton } from '../components/catalog/TableBodySkeleton';
import { api, getApiErrorMessage } from '../lib/api';
import {
  type CatalogSong,
  formatRating,
  type SongSortBy,
  type SortOrder,
} from '../lib/catalog';
import { nextSortState } from '../lib/sort';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; songs: CatalogSong[] };

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

  function handleSort(column: SongSortBy) {
    const next = nextSortState(sortBy, sortOrder, column);
    setSortBy(next.sortBy);
    setSortOrder(next.sortOrder);
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Songs
        </h1>
        <p className="text-sm text-[var(--cadence-fg-muted)]">
          Browse the catalog. Search, then click a column header to sort.
        </p>
      </div>

      <CatalogSearch
        search={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search title, artist, album, year..."
      />

      <div className="overflow-x-auto rounded-md border border-[var(--cadence-border)]">
        <table className="w-full min-w-[40rem] border-collapse text-sm">
          <thead className="bg-[var(--cadence-surface)]">
            <tr>
              <SortableTh
                label="Name"
                column="name"
                activeColumn={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <th
                scope="col"
                className="border-b border-[var(--cadence-border)] px-3 py-3 text-left text-xs font-semibold tracking-wide text-[var(--cadence-fg-muted)] uppercase"
              >
                Artists
              </th>
              <SortableTh
                label="Album"
                column="album"
                activeColumn={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTh
                label="Year"
                column="releaseYear"
                activeColumn={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
              />
              <SortableTh
                label="Rating"
                column="rating"
                activeColumn={sortBy}
                sortOrder={sortOrder}
                onSort={handleSort}
                align="right"
              />
            </tr>
          </thead>
          <tbody>
            {state.status === 'loading' ? (
              <TableBodySkeleton columns={5} />
            ) : null}

            {state.status === 'error' ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-sm text-[var(--cadence-fg-muted)]"
                  role="alert"
                >
                  {state.message}
                </td>
              </tr>
            ) : null}

            {state.status === 'ready' && state.songs.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="px-3 py-6 text-sm text-[var(--cadence-fg-muted)]"
                >
                  No songs match your search.
                </td>
              </tr>
            ) : null}

            {state.status === 'ready'
              ? state.songs.map((song) => (
                  <tr
                    key={song.id}
                    className="odd:bg-transparent even:bg-[var(--cadence-surface)]/50"
                  >
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 font-medium text-[var(--cadence-fg)]">
                      <Link
                        to={`/songs/${song.id}`}
                        className="underline-offset-4 hover:underline"
                      >
                        {song.name}
                      </Link>
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-[var(--cadence-fg-muted)]">
                      {song.artists.length === 0
                        ? '-'
                        : song.artists.map((a, index) => (
                            <span key={a.id}>
                              {index > 0 ? ', ' : null}
                              <Link
                                to={`/artists/${a.id}`}
                                className="underline-offset-4 hover:underline"
                              >
                                {a.name}
                              </Link>
                            </span>
                          ))}
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-[var(--cadence-fg-muted)]">
                      {song.album ?? '-'}
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 tabular-nums text-[var(--cadence-fg-muted)]">
                      {song.releaseYear}
                    </td>
                    <td className="border-b border-[var(--cadence-border)] px-3 py-3 text-right font-medium tabular-nums text-[var(--cadence-fg)]">
                      {formatRating(song.averageRating)}
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}
