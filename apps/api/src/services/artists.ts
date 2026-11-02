import { prisma } from '../lib/prisma.js';
import {
  averageFromValues,
  compareByAverageThenName,
  compareNullableNumber,
  compareNullableString,
} from '../lib/ratings.js';
import type { CreateArtistBody } from '../schemas/artist.js';
import type { ListArtistsQuery } from '../schemas/list-query.js';

export type ArtistListItem = {
  id: string;
  name: string;
  dob: string | null;
  bio: string | null;
  imageUrl: string | null;
  averageRating: number | null;
  ratingCount: number;
};

export type ArtistSongSummary = {
  id: string;
  name: string;
  releaseDate: string;
  releaseYear: number;
  album: string | null;
  coverUrl: string | null;
  averageRating: number | null;
  ratingCount: number;
};

export type ArtistDetail = ArtistListItem & {
  songs: ArtistSongSummary[];
};

export type ArtistTopItem = ArtistListItem;

function toDateOnly(value: Date): string {
  return value.toISOString().slice(0, 10);
}

function matchesArtistQuery(artist: ArtistListItem, q: string): boolean {
  const needle = q.toLowerCase();
  if (artist.name.toLowerCase().includes(needle)) {
    return true;
  }
  if (artist.bio?.toLowerCase().includes(needle)) {
    return true;
  }
  if (artist.dob?.includes(needle)) {
    return true;
  }
  return false;
}

function sortArtists(
  artists: ArtistListItem[],
  sortBy: ListArtistsQuery['sortBy'],
  sortOrder: ListArtistsQuery['sortOrder'],
): ArtistListItem[] {
  const sorted = [...artists];
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
      case 'dob':
        return compareNullableString(a.dob, b.dob, sortOrder, nameTie);
      case 'name':
      default: {
        const cmp = a.name.localeCompare(b.name);
        return sortOrder === 'asc' ? cmp : -cmp;
      }
    }
  });
  return sorted;
}

async function loadArtistsWithRatings(): Promise<ArtistListItem[]> {
  const artists = await prisma.artist.findMany({
    select: {
      id: true,
      name: true,
      dob: true,
      bio: true,
      imageUrl: true,
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

  return artists.map((artist) => {
    const values = artist.songs.flatMap((link) => link.song.ratings);
    const { averageRating, ratingCount } = averageFromValues(values);
    return {
      id: artist.id,
      name: artist.name,
      dob: artist.dob ? toDateOnly(artist.dob) : null,
      bio: artist.bio,
      imageUrl: artist.imageUrl,
      averageRating,
      ratingCount,
    };
  });
}

/** All artists with averages; optional search + sort (auth required at route). */
export async function listArtists(
  query: ListArtistsQuery = { sortBy: 'name', sortOrder: 'asc' },
): Promise<ArtistListItem[]> {
  let items = await loadArtistsWithRatings();
  if (query.q) {
    items = items.filter((artist) => matchesArtistQuery(artist, query.q ?? ''));
  }
  return sortArtists(items, query.sortBy, query.sortOrder);
}

/**
 * Top artists by average of all ratings on their songs
 * (not nested avg-of-song-avgs).
 */
export async function listTopArtists(limit = 10): Promise<ArtistTopItem[]> {
  const artists = await loadArtistsWithRatings();
  return artists.sort(compareByAverageThenName).slice(0, limit);
}

export async function getArtistById(id: string): Promise<ArtistDetail | null> {
  const artist = await prisma.artist.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      dob: true,
      bio: true,
      imageUrl: true,
      songs: {
        select: {
          song: {
            select: {
              id: true,
              name: true,
              releaseDate: true,
              album: true,
              coverUrl: true,
              ratings: { select: { value: true } },
            },
          },
        },
      },
    },
  });

  if (!artist) {
    return null;
  }

  const allRatings = artist.songs.flatMap((link) => link.song.ratings);
  const { averageRating, ratingCount } = averageFromValues(allRatings);

  const songs: ArtistSongSummary[] = artist.songs.map((link) => {
    const songAvg = averageFromValues(link.song.ratings);
    return {
      id: link.song.id,
      name: link.song.name,
      releaseDate: toDateOnly(link.song.releaseDate),
      releaseYear: link.song.releaseDate.getUTCFullYear(),
      album: link.song.album,
      coverUrl: link.song.coverUrl,
      averageRating: songAvg.averageRating,
      ratingCount: songAvg.ratingCount,
    };
  });

  songs.sort((a, b) => a.name.localeCompare(b.name));

  return {
    id: artist.id,
    name: artist.name,
    dob: artist.dob ? toDateOnly(artist.dob) : null,
    bio: artist.bio,
    imageUrl: artist.imageUrl,
    averageRating,
    ratingCount,
    songs,
  };
}

export async function createArtist(
  input: CreateArtistBody,
): Promise<ArtistListItem> {
  const artist = await prisma.artist.create({
    data: {
      name: input.name,
      dob: input.dob ? new Date(`${input.dob}T00:00:00.000Z`) : null,
      bio: input.bio ?? null,
      imageUrl: input.imageUrl ?? null,
    },
  });

  return {
    id: artist.id,
    name: artist.name,
    dob: artist.dob ? toDateOnly(artist.dob) : null,
    bio: artist.bio,
    imageUrl: artist.imageUrl,
    averageRating: null,
    ratingCount: 0,
  };
}

export async function updateArtistImageUrl(
  id: string,
  imageUrl: string | null,
): Promise<ArtistListItem | null> {
  const existing = await prisma.artist.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  await prisma.artist.update({
    where: { id },
    data: { imageUrl },
  });

  const detail = await getArtistById(id);
  if (!detail) {
    return null;
  }

  return {
    id: detail.id,
    name: detail.name,
    dob: detail.dob,
    bio: detail.bio,
    imageUrl: detail.imageUrl,
    averageRating: detail.averageRating,
    ratingCount: detail.ratingCount,
  };
}
