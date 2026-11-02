import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CatalogImageEditor } from '../components/catalog/CatalogImageEditor';
import { Skeleton } from '../components/ui/skeleton';
import { api, getApiErrorMessage } from '../lib/api';
import {
  type ArtistDetail,
  type CatalogArtist,
  formatRating,
} from '../lib/catalog';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; artist: ArtistDetail };

export function ArtistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

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
          <ul className="cadence-panel divide-y divide-[var(--cadence-border)] overflow-hidden">
            {artist.songs.map((song) => (
              <li key={song.id}>
                <Link
                  to={`/songs/${song.id}`}
                  className="flex items-center justify-between gap-3 px-3 py-3 transition-colors hover:bg-[var(--cadence-muted)]/55"
                >
                  <span className="min-w-0 truncate font-medium">
                    {song.name}
                    <span className="ml-2 font-normal text-[var(--cadence-fg-muted)]">
                      {song.releaseYear}
                      {song.album ? ` · ${song.album}` : ''}
                    </span>
                  </span>
                  <span className="shrink-0 tabular-nums text-sm">
                    {formatRating(song.averageRating)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
