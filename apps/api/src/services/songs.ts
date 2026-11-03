import { normalizeArtistIds } from '../lib/artist-ids.js';
import { releaseYearUtc, toDateOnly } from '../lib/dates.js';
import { prisma } from '../lib/prisma.js';
import {
  averageFromValues,
  compareByAverageThenName,
  compareNullableNumber,
  compareNullableString,
} from '../lib/ratings.js';
import type { ListSongsQuery } from '../schemas/list-query.js';
import type { CreateSongBody } from '../schemas/song.js';

export type SongListItem = {
  id: string;
  name: string;
  releaseDate: string;
  releaseYear: number;
  album: string | null;
  coverUrl: string | null;
  averageRating: number | null;
  ratingCount: number;
  artists: { id: string; name: string }[];
  createdAt: string;
};

export type SongMapperInput = {
  id: string;
  name: string;
  releaseDate: Date;
  album: string | null;
  coverUrl: string | null;
  createdAt: Date;
  artists: { artist: { id: string; name: string } }[];
  ratings: { value: { toString(): string } }[];
};

export function mapSong(song: SongMapperInput): SongListItem {
  const { averageRating, ratingCount } = averageFromValues(song.ratings);
  return {
    id: song.id,
    name: song.name,
    releaseDate: toDateOnly(song.releaseDate),
    releaseYear: releaseYearUtc(song.releaseDate),
    album: song.album,
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

function matchesSongQuery(song: SongListItem, q: string): boolean {
  const needle = q.toLowerCase();
  if (song.name.toLowerCase().includes(needle)) {
    return true;
  }
  if (song.album?.toLowerCase().includes(needle)) {
    return true;
  }
  if (String(song.releaseYear).includes(needle)) {
    return true;
  }
  return song.artists.some((artist) =>
    artist.name.toLowerCase().includes(needle),
  );
}

function sortSongs(
  songs: SongListItem[],
  sortBy: ListSongsQuery['sortBy'],
  sortOrder: ListSongsQuery['sortOrder'],
): SongListItem[] {
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

/** List songs with optional search + sort (auth required at route). */
export async function listSongs(
  query: ListSongsQuery = { sortBy: 'name', sortOrder: 'asc' },
): Promise<SongListItem[]> {
  const songs = await prisma.song.findMany({
    include: songListInclude,
  });

  let items = songs.map(mapSong);
  if (query.q) {
    items = items.filter((song) => matchesSongQuery(song, query.q ?? ''));
  }
  return sortSongs(items, query.sortBy, query.sortOrder);
}

/** Top 10 songs by average rating (unrated last). */
export async function listTopSongs(limit = 10): Promise<SongListItem[]> {
  const songs = await listSongs({ sortBy: 'name', sortOrder: 'asc' });
  return [...songs].sort(compareByAverageThenName).slice(0, limit);
}

export type SongDetail = SongListItem & {
  myRating: number | null;
};

export async function getSongById(
  id: string,
  userId?: string,
): Promise<SongDetail | null> {
  const song = await prisma.song.findUnique({
    where: { id },
    include: songListInclude,
  });
  if (!song) {
    return null;
  }

  let myRating: number | null = null;
  if (userId) {
    const mine = await prisma.rating.findUnique({
      where: { userId_songId: { userId, songId: id } },
      select: { value: true },
    });
    if (mine) {
      myRating = Number(mine.value.toString());
    }
  }

  return {
    ...mapSong(song),
    myRating,
  };
}

export async function createSong(
  input: CreateSongBody & { createdByUserId: string },
): Promise<SongListItem> {
  const artistIds = normalizeArtistIds(input.artistIds);

  const song = await prisma.song.create({
    data: {
      name: input.name,
      releaseDate: new Date(`${input.releaseDate}T00:00:00.000Z`),
      album: input.album ?? null,
      coverUrl: input.coverUrl ?? null,
      createdByUserId: input.createdByUserId,
      artists: {
        create: artistIds.map((artistId) => ({ artistId })),
      },
    },
    include: songListInclude,
  });

  return mapSong(song);
}

export async function updateSongCoverUrl(
  id: string,
  coverUrl: string | null,
  userId?: string,
): Promise<SongDetail | null> {
  const existing = await prisma.song.findUnique({ where: { id } });
  if (!existing) {
    return null;
  }

  await prisma.song.update({
    where: { id },
    data: { coverUrl },
  });

  return getSongById(id, userId);
}

export type SongRatingItem = {
  id: string;
  userId: string;
  songId: string;
  value: number;
};

export async function upsertSongRating(
  userId: string,
  songId: string,
  value: number,
): Promise<SongRatingItem | null> {
  const song = await prisma.song.findUnique({
    where: { id: songId },
    select: { id: true },
  });
  if (!song) {
    return null;
  }

  const decimalValue = value.toFixed(1);

  const rating = await prisma.rating.upsert({
    where: {
      userId_songId: { userId, songId },
    },
    create: {
      userId,
      songId,
      value: decimalValue,
    },
    update: {
      value: decimalValue,
    },
  });

  return {
    id: rating.id,
    userId: rating.userId,
    songId: rating.songId,
    value: Number(rating.value.toString()),
  };
}
