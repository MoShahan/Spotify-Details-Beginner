import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { toast } from 'sonner';

import { ArtistLinkList } from '../components/catalog/ArtistLinkList';
import { CatalogImageEditor } from '../components/catalog/CatalogImageEditor';
import { SongRatingControl } from '../components/catalog/SongRatingControl';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { api, getApiErrorMessage } from '../lib/api';
import { formatRating, type SongDetail } from '../lib/catalog';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; song: SongDetail };

export function SongDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [state, setState] = useState<LoadState>({ status: 'loading' });
  const [editingRating, setEditingRating] = useState(false);

  useEffect(() => {
    if (!id) {
      setState({ status: 'error', message: 'Missing song id' });
      return;
    }

    let cancelled = false;

    async function load() {
      setState({ status: 'loading' });
      try {
        const res = await api.get<{ song: SongDetail }>(`/songs/${id}`);
        if (!cancelled) {
          setState({ status: 'ready', song: res.data.song });
          setEditingRating(false);
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

  async function reloadSong() {
    if (!id) {
      return;
    }
    try {
      const res = await api.get<{ song: SongDetail }>(`/songs/${id}`);
      setState({ status: 'ready', song: res.data.song });
      setEditingRating(false);
    } catch (error: unknown) {
      toast.error(getApiErrorMessage(error, 'Could not refresh song'));
    }
  }

  async function saveCover(coverUrl: string | null) {
    if (!id) {
      throw new Error('Missing song id');
    }
    const res = await api.patch<{ song: SongDetail }>(`/songs/${id}/cover`, {
      coverUrl,
    });
    setState({ status: 'ready', song: res.data.song });
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
  const showRatingEditor = song.myRating === null || editingRating;

  return (
    <section className="flex flex-col gap-8">
      <Link
        to="/songs"
        className="w-fit text-sm text-[var(--cadence-fg-muted)] underline underline-offset-4"
      >
        Back to songs
      </Link>

      <div className="grid gap-8 md:grid-cols-[minmax(0,18rem)_1fr]">
        <CatalogImageEditor
          label="Cover"
          alt={`${song.name} cover`}
          emptyLabel="No cover"
          currentUrl={song.coverUrl}
          folder="songs"
          onSave={saveCover}
        />

        <div className="flex flex-col gap-5">
          <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
            {song.name}
          </h1>
          <dl className="grid gap-4 text-sm sm:grid-cols-2">
            <div>
              <dt className="text-[var(--cadence-fg-muted)]">Artists</dt>
              <dd className="mt-1 font-medium">
                <ArtistLinkList artists={song.artists} underline />
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

          <div className="flex flex-col gap-2 border-t border-[var(--cadence-border)] pt-4">
            <h2 className="text-sm font-medium text-[var(--cadence-fg-muted)]">
              Your rating
            </h2>
            {showRatingEditor ? (
              <SongRatingControl
                songId={song.id}
                initialValue={song.myRating}
                showCancel={song.myRating !== null}
                onCancel={() => {
                  setEditingRating(false);
                }}
                onRated={() => {
                  void reloadSong();
                }}
              />
            ) : (
              <div className="flex flex-wrap items-center gap-3">
                <p className="text-sm font-medium tabular-nums">
                  {formatRating(song.myRating)}
                </p>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    setEditingRating(true);
                  }}
                >
                  Edit rating
                </Button>
              </div>
            )}
          </div>

          <p className="text-sm text-[var(--cadence-fg-muted)]">
            Lyrics - coming soon
          </p>
        </div>
      </div>
    </section>
  );
}
