import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { ArtistLinkList } from '../components/catalog/ArtistLinkList';
import { TopListsSkeleton } from '../components/home/TopListsSkeleton';
import { useAuth } from '../contexts/auth';
import { api, getApiErrorMessage } from '../lib/api';
import { formatRating, type TopArtist, type TopSong } from '../lib/catalog';

type LoadState =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; songs: TopSong[]; artists: TopArtist[] };

export function HomePage() {
  const { user } = useAuth();
  const [state, setState] = useState<LoadState>({ status: 'loading' });

  useEffect(() => {
    let cancelled = false;

    async function loadTop() {
      setState({ status: 'loading' });
      try {
        const [songsRes, artistsRes] = await Promise.all([
          api.get<{ songs: TopSong[] }>('/songs/top'),
          api.get<{ artists: TopArtist[] }>('/artists/top'),
        ]);
        if (!cancelled) {
          setState({
            status: 'ready',
            songs: songsRes.data.songs,
            artists: artistsRes.data.artists,
          });
        }
      } catch (error: unknown) {
        if (!cancelled) {
          setState({
            status: 'error',
            message: getApiErrorMessage(error, 'Could not load Top 10'),
          });
        }
      }
    }

    void loadTop();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <h1 className="font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl">
          Home
        </h1>
        <p className="max-w-xl text-[var(--cadence-fg-muted)]">
          Welcome{user ? `, ${user.name}` : ''}. Top 10 by average rating.
        </p>
      </div>

      {state.status === 'loading' ? <TopListsSkeleton /> : null}

      {state.status === 'error' ? (
        <div
          className="cadence-panel px-4 py-6 text-sm text-[var(--cadence-fg-muted)]"
          role="alert"
        >
          {state.message}
        </div>
      ) : null}

      {state.status === 'ready' ? (
        <div className="grid gap-10 lg:grid-cols-2">
          <TopSongsList songs={state.songs} />
          <TopArtistsList artists={state.artists} />
        </div>
      ) : null}
    </section>
  );
}

function TopSongsList({ songs }: { songs: TopSong[] }) {
  return (
    <div className="cadence-panel flex flex-col gap-4 p-4 sm:p-5">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
        Top 10 Songs
      </h2>
      {songs.length === 0 ? (
        <p className="text-sm text-[var(--cadence-fg-muted)]">No songs yet.</p>
      ) : (
        <ol className="flex flex-col">
          {songs.map((song, index) => (
            <li
              key={song.id}
              className="flex items-start gap-3 border-b border-[var(--cadence-border)] py-3 last:border-b-0"
            >
              <span className="w-6 shrink-0 text-sm font-medium text-[var(--cadence-fg-muted)]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--cadence-fg)]">
                  <Link
                    to={`/songs/${song.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {song.name}
                  </Link>
                </p>
                <p className="truncate text-sm text-[var(--cadence-fg-muted)]">
                  <ArtistLinkList
                    artists={song.artists}
                    empty="Unknown artist"
                  />
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums text-[var(--cadence-fg)]">
                {formatRating(song.averageRating)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}

function TopArtistsList({ artists }: { artists: TopArtist[] }) {
  return (
    <div className="cadence-panel flex flex-col gap-4 p-4 sm:p-5">
      <h2 className="font-[family-name:var(--font-display)] text-xl font-semibold tracking-tight">
        Top 10 Artists
      </h2>
      {artists.length === 0 ? (
        <p className="text-sm text-[var(--cadence-fg-muted)]">
          No artists yet.
        </p>
      ) : (
        <ol className="flex flex-col">
          {artists.map((artist, index) => (
            <li
              key={artist.id}
              className="flex items-start gap-3 border-b border-[var(--cadence-border)] py-3 last:border-b-0"
            >
              <span className="w-6 shrink-0 text-sm font-medium text-[var(--cadence-fg-muted)]">
                {index + 1}
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-[var(--cadence-fg)]">
                  <Link
                    to={`/artists/${artist.id}`}
                    className="underline-offset-4 hover:underline"
                  >
                    {artist.name}
                  </Link>
                </p>
                <p className="text-sm text-[var(--cadence-fg-muted)]">
                  {artist.ratingCount}{' '}
                  {artist.ratingCount === 1 ? 'rating' : 'ratings'}
                </p>
              </div>
              <span className="shrink-0 text-sm font-medium tabular-nums text-[var(--cadence-fg)]">
                {formatRating(artist.averageRating)}
              </span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
