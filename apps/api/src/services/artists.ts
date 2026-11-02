import { prisma } from '../lib/prisma.js';
import { averageFromValues, compareByAverageThenName } from '../lib/ratings.js';

export type ArtistListItem = {
  id: string;
  name: string;
  dob: string | null;
  bio: string | null;
};

export type ArtistTopItem = ArtistListItem & {
  averageRating: number | null;
  ratingCount: number;
};

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

/** All artists for dropdowns (auth required at route). Ordered by name. */
export async function listArtists(): Promise<ArtistListItem[]> {
  const artists = await prisma.artist.findMany({
    select: {
      id: true,
      name: true,
      dob: true,
      bio: true,
    },
    orderBy: [{ name: 'asc' }, { id: 'asc' }],
  });

  return artists.map((artist) => ({
    id: artist.id,
    name: artist.name,
    dob: artist.dob ? toDateOnly(artist.dob) : null,
    bio: artist.bio,
  }));
}

/**
 * Top artists by average of all ratings on their songs
 * (not nested avg-of-song-avgs).
 */
export async function listTopArtists(limit = 10): Promise<ArtistTopItem[]> {
  const artists = await prisma.artist.findMany({
    select: {
      id: true,
      name: true,
      dob: true,
      bio: true,
      songs: {
        select: {
          song: {
            select: {
              ratings: { select: { value: true } },
            },
          },
        },
      },
    },
  });

  const ranked: ArtistTopItem[] = artists.map((artist) => {
    const values = artist.songs.flatMap((link) => link.song.ratings);
    const { averageRating, ratingCount } = averageFromValues(values);
    return {
      id: artist.id,
      name: artist.name,
      dob: artist.dob ? toDateOnly(artist.dob) : null,
      bio: artist.bio,
      averageRating,
      ratingCount,
    };
  });

  return ranked.sort(compareByAverageThenName).slice(0, limit);
}
