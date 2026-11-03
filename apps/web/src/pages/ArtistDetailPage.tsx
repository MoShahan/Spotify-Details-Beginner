import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CatalogImageEditor } from '../components/catalog/CatalogImageEditor';
import { SongCatalogTable } from '../components/catalog/SongCatalogTable';
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
      <div className="flex flex-col gap-6">
        <Skeleton className="h-4 w-28" />
        <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
          <Skeleton className="aspect-square w-full max-w-[18rem]" />
          <div className="flex flex-col gap-3">
            <Skeleton className="h-10 w-56" />
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
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
      <Link
        to="/artists"
        className="w-fit text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
      >
        Back to artists
      </Link>

      <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
        <CatalogImageEditor
          label="Artist image"
          alt={artist.name}
          emptyLabel="No image"
          currentUrl={artist.imageUrl}
          folder="artists"
          onSave={saveImage}
        />

        <div className="flex flex-col gap-5">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            {artist.name}
          </h1>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
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
        <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--cadence-fg-muted)]">
          Songs
        </h2>
        {artist.songs.length === 0 ? (
          <p className="text-sm text-[var(--cadence-fg-muted)]">
            No songs linked yet.
          </p>
        ) : (
          <SongCatalogTable
            songs={sortedSongs}
            sortBy={sortBy}
            sortOrder={sortOrder}
            onSort={handleSort}
          />
        )}
      </div>
    </section>
  );
}
