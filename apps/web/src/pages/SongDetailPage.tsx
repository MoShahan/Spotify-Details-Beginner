import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { CatalogImageEditor } from '../components/catalog/CatalogImageEditor';
import { Skeleton } from '../components/ui/skeleton';
import { api, getApiErrorMessage } from '../lib/api';
import { type CatalogSong, formatRating } from '../lib/catalog';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; song: CatalogSong };

export function SongDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    if (!id) {
      setState({ status: 'error', message: 'Missing song id' });
      return;
    }

    let cancelled = false;

    async function load() {
      setState({ status: 'loading' });
      try {
        const res = await api.get<{ song: CatalogSong }>(`/songs/${id}`);
        if (!cancelled) {
          setState({ status: 'ready', song: res.data.song });
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: getApiErrorMessage(error, 'Could not load song'),
          });
        }
      }
    }

    void load();
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function saveCover(coverUrl: string | null) {
    if (!id) {
      throw new Error('Missing song id');
    }
    const res = await api.patch<{ song: CatalogSong }>(`/songs/${id}/cover`, {
      coverUrl,
    });
    setState({ status: 'ready', song: res.data.song });
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
          to="/songs"
          className="text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
        >
          Back to songs
        </Link>
        <p className="text-sm text-[var(--cadence-fg-muted)]" role="alert">
          {state.message}
        </p>
      </div>
    );
  }

  const { song } = state;

  return (
    <section className="flex flex-col gap-8">
      <div>
        <Link
          to="/songs"
          className="text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
        >
          Back to songs
        </Link>
      </div>

      <div className="grid gap-8 md:grid-cols-[minmax(0,16rem)_1fr]">
        <CatalogImageEditor
          label="Cover"
          alt={`${song.name} cover`}
          emptyLabel="No cover"
          currentUrl={song.coverUrl}
          folder="songs"
          onSave={saveCover}
        />

        <div className="flex flex-col gap-4">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            {song.name}
          </h1>
          <dl className="grid gap-3 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--cadence-fg-muted)]">Artists</dt>
              <dd className="mt-1 font-medium">
                {song.artists.length === 0
                  ? '-'
                  : song.artists.map((artist, index) => (
                      <span key={artist.id}>
                        {index > 0 ? ', ' : null}
                        <Link
                          to={`/artists/${artist.id}`}
                          className="underline underline-offset-4"
                        >
                          {artist.name}
                        </Link>
                      </span>
                    ))}
              </dd>
            </div>
            <div>
              <dt className="text-[var(--cadence-fg-muted)]">Album</dt>
              <dd className="mt-1 font-medium">{song.album ?? '-'}</dd>
            </div>
            <div>
              <dt className="text-[var(--cadence-fg-muted)]">Release date</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {song.releaseDate} ({song.releaseYear})
              </dd>
            </div>
            <div>
              <dt className="text-[var(--cadence-fg-muted)]">Average rating</dt>
              <dd className="mt-1 font-medium tabular-nums">
                {formatRating(song.averageRating)}
                <span className="ml-1 font-normal text-[var(--cadence-fg-muted)]">
                  ({song.ratingCount}{' '}
                  {song.ratingCount === 1 ? 'rating' : 'ratings'})
                </span>
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <section
        className="cadence-panel p-4 sm:p-5"
        aria-labelledby="song-lyrics-heading"
      >
        <h2
          id="song-lyrics-heading"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight"
        >
          Lyrics
        </h2>
        <p className="mt-2 text-sm text-[var(--cadence-fg-muted)]">
          Coming soon
        </p>
      </section>
    </section>
  );
}
