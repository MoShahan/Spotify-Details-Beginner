import { prisma } from '../lib/prisma.js';

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

function averageRating(values: { value: { toString(): string } }[]): {
  averageRating: number | null;
  ratingCount: number;
} {
  if (values.length === 0) {
    return { averageRating: null, ratingCount: 0 };
  }
  const sum = values.reduce(
    (acc, row) => acc + Number(row.value.toString()),
    0,
  );
  const average = sum / values.length;
  return {
    averageRating: Math.round(average * 10) / 10,
    ratingCount: values.length,
  };
}

/** List all songs with artists and average rating (auth required at route). */
export async function listSongs(): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    include: {
      artists: {
        include: {
          artist: { select: { id: true, name: true } },
        },
      },
      ratings: { select: { value: true } },
    },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });

  return songs.map((song) => {
    const { averageRating: avg, ratingCount } = averageRating(song.ratings);
    return {
      id: song.id,
      name: song.name,
      releaseDate: toDateOnly(song.releaseDate),
      coverUrl: song.coverUrl,
      averageRating: avg,
      ratingCount,
      artists: song.artists.map((link) => ({
        id: link.artist.id,
        name: link.artist.name,
      })),
      createdAt: song.createdAt.toISOString(),
    };
  });
}
