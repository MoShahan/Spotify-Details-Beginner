import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CatalogImageEditor } from '../components/catalog/CatalogImageEditor';
import { CatalogThumb } from '../components/catalog/CatalogThumb';
import { SortableTh } from '../components/catalog/SortableTh';
import { Skeleton } from '../components/ui/skeleton';
import { api, getApiErrorMessage } from '../lib/api';
import {
  type ArtistDetail,
  type ArtistDetailSong,
  type CatalogArtist,
  formatRating,
  type SongSortBy,
  type SortOrder,
} from '../lib/catalog';
import { nextSortState } from '../lib/sort';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; artist: ArtistDetail };

const EMPTY_SONGS: ArtistDetailSong[] = [];

function compareNullableNumber(
  a: number | null,
  b: number | null,
  order: SortOrder,
  tieBreak: number,
): number {
  if (a === null && b === null) {
    return tieBreak;
  }
  if (a === null) {
    return 1;
  }
  if (b === null) {
    return -1;
  }
  if (a !== b) {
    return order === 'asc' ? a - b : b - a;
  }
  return tieBreak;
}

function compareNullableString(
  a: string | null,
  b: string | null,
  order: SortOrder,
  tieBreak: number,
): number {
  const left = a?.trim() ? a : null;
  const right = b?.trim() ? b : null;
  if (left === null && right === null) {
    return tieBreak;
  }
  if (left === null) {
    return 1;
  }
  if (right === null) {
    return -1;
  }
  const cmp = left.localeCompare(right);
  return cmp === 0 ? tieBreak : order === 'asc' ? cmp : -cmp;
}

function sortArtistSongs(
  songs: ArtistDetailSong[],
  sortBy: SongSortBy,
  sortOrder: SortOrder,
): ArtistDetailSong[] {
  const sorted = [...songs];
  sorted.sort((a, b) => {
    const nameTie = a.name.localeCompare(b.name);
    switch (sortBy) {
      case 'rating':
        return compareNullableNumber(
          a.averageRating,
          b.averageRating,
          sortOrder,
          nameTie,
        );
      case 'releaseYear':
        return compareNullableNumber(
          a.releaseYear,
          b.releaseYear,
          sortOrder,
          nameTie,
        );
      case 'album':
        return compareNullableString(a.album, b.album, sortOrder, nameTie);
      case 'name':
      default: {
        const cmp = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
    }
  });
  return sorted;
}

export function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [sortBy, setSortBy] = useState<SongSortBy>('name');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  useEffect(() => {
    if (!id) {
      setState({ status: 'error', message: 'Missing artist id' });
      return;
    }

    let cancelled = false;

    async function load() {
      setState({ status: 'loading' });
      try {
        const res = await api.get<{ artist: ArtistDetail }>(`/artists/${id}`);
        if (!cancelled) {
          setState({ status: 'ready', artist: res.data.artist });
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: getApiErrorMessage(error, 'Could not load artist'),
          });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function saveImage(imageUrl: string | null) {
    if (!id) {
      throw new Error('Missing artist id');
    }
    const res = await api.patch<{ artist: CatalogArtist }>(
      `/artists/${id}/image`,
      { imageUrl },
    );
    setState((prev) => {
      if (prev.status !== 'ready') {
        return prev;
      }
      return {
        status: 'ready',
        artist: {
          ...prev.artist,
          imageUrl: res.data.artist.imageUrl,
        },
      };
    });
  }

  const songsForSort =
    state.status === 'ready' ? state.artist.songs : EMPTY_SONGS;

  const sortedSongs = useMemo(
    () => sortArtistSongs(songsForSort, sortBy, sortOrder),
    [songsForSort, sortBy, sortOrder],
  );

  function handleSort(column: SongSortBy) {
    const next = nextSortState(sortBy, sortOrder, column);
    setSortBy(next.sortBy);
    setSortOrder(next.sortOrder);
  }

  if (state.status === 'loading') {
    return (
      <div className="flex flex-col gap-4">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-48 w-full max-w-sm" />
        <Skeleton className="h-4 w-64" />
      </div>
    );
  }

  if (state.status === 'error') {
    return (
      <div className="flex flex-col gap-4">
        <Link
          to="/artists"
          className="text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
        >
          Back to artists
        </Link>
        <p className="text-sm text-[var(--cadence-fg-muted)]" role="alert">
          {state.message}
        </p>
      </div>
    );
  }

  const { artist } = state;

  return (
    <section className="flex flex-col gap-8">
      <div>
        <Link
          to="/artists"
          className="text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
        >
          Back to artists
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_1fr]">
        <CatalogImageEditor
          label="Artist image"
          alt={artist.name}
          emptyLabel="No image"
          currentUrl={artist.imageUrl}
          folder="artists"
          onSave={saveImage}
        />

        <div className="flex flex-col gap-4">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            {artist.name}
          </h1>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--cadence-fg-muted)]">Date of birth</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {artist.dob ?? '-'}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--cadence-fg-muted)]">Average rating</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {formatRating(artist.averageRating)}
                <span className="ml-1 font-normal text-[var(--cadence-fg-muted)]">
                  ({artist.ratingCount}{' '}
                  {artist.ratingCount === 1 ? 'rating' : 'ratings'})
                </span>
              </dd>
            </div>
          </dl>
          {artist.bio ? (
            <p className="max-w-2xl text-sm leading-relaxed text-[var(--cadence-fg-muted)]">
              {artist.bio}
            </p>
          ) : null}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
          Songs
        </h2>
        {artist.songs.length === 0 ? (
          <p className="text-sm text-[var(--cadence-fg-muted)]">
            No songs linked yet.
          </p>
        ) : (
          <div className="cadence-panel overflow-x-auto">
            <table className="w-full min-w-[40rem] border-collapse text-sm">
              <thead className="bg-[var(--cadence-muted)]/45">
                <tr>
                  <th
                    scope="col"
                    className="w-14 border-b border-[var(--cadence-border)] px-3 py-3 text-left text-xs font-semibold tracking-wide text-[var(--cadence-fg-muted)] uppercase"
                  >
                    <span className="sr-only">Cover</span>
                  </th>
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
                {sortedSongs.map((song) => (
                  <tr
                    key={song.id}
                    className="transition-colors odd:bg-transparent even:bg-[var(--cadence-muted)]/25 hover:bg-[var(--cadence-muted)]/55"
                  >
                    <td className="border-b border-[var(--cadence-border)] px-3 py-2">
                      <Link to={`/songs/${song.id}`} tabIndex={-1}>
                        <CatalogThumb
                          src={song.coverUrl}
                          alt={`${song.name} cover`}
                        />
                      </Link>
                    </td>
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
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
