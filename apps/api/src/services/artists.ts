import { prisma } from '../lib/prisma.js';

export type ArtistListItem = {
  id: string;
  name: string;
  dob: string | null;
  bio: string | null;
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
