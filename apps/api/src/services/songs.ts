import { prisma } from '../lib/prisma.js';
import { averageFromValues, compareByAverageThenName } from '../lib/ratings.js';

export type SongListItem = {
  id: string;
  name: string;
  releaseDate: string;
  coverUrl: string | null;
  averageRating: number | null;
  ratingCount: number;
  artists: { id: string; name: string }[];
  createdAt: string;
};

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function mapSong(song: {
  id: string;
  name: string;
  releaseDate: Date;
  coverUrl: string | null;
  createdAt: Date;
  artists: { artist: { id: string; name: string } }[];
  ratings: { value: { toString(): string } }[];
}): SongListItem {
  const { averageRating, ratingCount } = averageFromValues(song.ratings);
  return {
    id: song.id,
    name: song.name,
    releaseDate: toDateOnly(song.releaseDate),
    coverUrl: song.coverUrl,
    averageRating,
    ratingCount,
    artists: song.artists.map((link) => ({
      id: link.artist.id,
      name: link.artist.name,
    })),
    createdAt: song.createdAt.toISOString(),
  };
}

const songListInclude = {
  artists: {
    include: {
      artist: { select: { id: true, name: true } },
    },
  },
  ratings: { select: { value: true } },
} as const;

/** List all songs with artists and average rating (auth required at route). */
export async function listSongs(): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    include: songListInclude,
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });

  return songs.map(mapSong);
}

/** Top 10 songs by average rating (unrated last). */
export async function listTopSongs(limit = 10): Promise<SongListItem[]> {
  const songs = await listSongs();
  return [...songs].sort(compareByAverageThenName).slice(0, limit);
}
