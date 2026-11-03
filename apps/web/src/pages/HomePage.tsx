import { useEffect, useState } from 'react';

import { ArtistLinkList } from '../components/catalog/ArtistLinkList';
import { RankRow } from '../components/home/RankRow';
import { TopListsSkeleton } from '../components/home/TopListsSkeleton';
import { PageHeader } from '../components/layout/PageHeader';
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
      <PageHeader
        title="Home"
        subtitle={`Welcome${user ? `, ${user.name}` : ''}. Top 10 by average rating.`}
      />

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
        <div className="grid gap-8 lg:grid-cols-2 lg:gap-10">
          <TopSongsList songs={state.songs} />
          <TopArtistsList artists={state.artists} />
        </div>
      ) : null}
    </section>
  );
}

function TopSongsList({ songs }: { songs: TopSong[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--cadence-fg-muted)]">
        Top 10 Songs
      </h2>
      <div className="cadence-panel px-3 py-2 sm:px-4">
        {songs.length === 0 ? (
          <p className="px-1 py-4 text-sm text-[var(--cadence-fg-muted)]">
            No songs yet.
          </p>
        ) : (
          <ol className="flex flex-col divide-y divide-[var(--cadence-border)]">
            {songs.map((song, index) => (
              <RankRow
                key={song.id}
                rank={index + 1}
                to={`/songs/${song.id}`}
                title={song.name}
                meta={
                  <ArtistLinkList
                    artists={song.artists}
                    empty="Unknown artist"
                  />
                }
                rating={formatRating(song.averageRating)}
                imageSrc={song.coverUrl}
                imageAlt={`${song.name} cover`}
              />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function TopArtistsList({ artists }: { artists: TopArtist[] }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-[var(--cadence-fg-muted)]">
        Top 10 Artists
      </h2>
      <div className="cadence-panel px-3 py-2 sm:px-4">
        {artists.length === 0 ? (
          <p className="px-1 py-4 text-sm text-[var(--cadence-fg-muted)]">
            No artists yet.
          </p>
        ) : (
          <ol className="flex flex-col divide-y divide-[var(--cadence-border)]">
            {artists.map((artist, index) => (
              <RankRow
                key={artist.id}
                rank={index + 1}
                to={`/artists/${artist.id}`}
                title={artist.name}
                meta={`${artist.ratingCount} ${artist.ratingCount === 1 ? 'rating' : 'ratings'}`}
                rating={formatRating(artist.averageRating)}
                imageSrc={artist.imageUrl}
                imageAlt={artist.name}
              />
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}
