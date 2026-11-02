import { artistIdsEqual, normalizeArtistIds } from '../lib/artist-ids.js';
import { prisma } from '../lib/prisma.js';

/**
 * Catalog uniqueness helpers live here (not as DB UNIQUE constraints) so product rules
 * can change without migrations that fight existing data - e.g. artist identity may later
 * use name + DOB + nationality; song rules may tighten or loosen independently.
 */

/** Find an artist whose name collides under the current (name-only) rule. */
export async function findArtistByName(name: string) {
  return prisma.artist.findFirst({
    where: { name },
  });
}

/**
 * Find a song with the same name and the same artist set (order-independent).
 * Current rule: same title with a different artist set is allowed.
 */
export async function findSongByNameAndArtistSet(
  name: string,
  artistIds: readonly string[],
) {
  const wanted = normalizeArtistIds(artistIds);
  const candidates = await prisma.song.findMany({
    where: { name },
    include: { artists: { select: { artistId: true } } },
  });

  return (
    candidates.find((song) =>
      artistIdsEqual(
        song.artists.map((link) => link.artistId),
        wanted,
      ),
    ) ?? null
  );
}

/** Ensure every artist id exists; returns missing ids. */
export async function findMissingArtistIds(artistIds: readonly string[]) {
  const uniqueIds = normalizeArtistIds(artistIds);
  const found = await prisma.artist.findMany({
    where: { id: { in: uniqueIds } },
    select: { id: true },
  });
  const foundSet = new Set(found.map((row) => row.id));
  return uniqueIds.filter((id) => !foundSet.has(id));
}
