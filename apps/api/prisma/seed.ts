/**
 * Cadence demo seed.
 *
 * Artist average rule (document for 1.1.5):
 * Artist avg = average of all rating values on songs linked to that artist
 * (not nested avg-of-song-avgs). Song avg = AVG(ratings.value) for that song.
 *
 * Song metadata sourced from public listings (Apple Music / Wikipedia / label pages).
 * Artist portraits + song covers: Deezer lookup, then ImageKit host when env is set.
 */
import 'dotenv/config';

import bcrypt from 'bcrypt';

import { PrismaClient } from '../src/generated/prisma/client.js';
import { createMariaDbAdapterFromUrl } from '../src/lib/mariadb-adapter.js';
import {
  getSeedImageKit,
  resolveArtistImage,
  resolveSongCover,
} from './seed-images.js';

function createAdapter() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run seed');
  }

  return createMariaDbAdapterFromUrl(databaseUrl);
}

const prisma = new PrismaClient({ adapter: createAdapter() });

function d(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

async function main() {
  const imageKit = getSeedImageKit();
  if (imageKit.client) {
    console.log(
      `ImageKit enabled - uploading into ${imageKit.folder}/artists and ${imageKit.folder}/songs`,
    );
  } else {
    console.log(
      'ImageKit env not fully set - storing Deezer CDN URLs when found',
    );
  }

  // Clear in FK-safe order (Restrict requires children first)
  await prisma.rating.deleteMany();
  await prisma.songArtist.deleteMany();
  await prisma.song.deleteMany();
  await prisma.artist.deleteMany();
  await prisma.user.deleteMany();

  const shahan = await prisma.user.create({
    data: {
      name: 'Shahan',
      email: 'shahan@cadence.com',
      passwordHash: await bcrypt.hash('Shahan@123', 10),
    },
  });

  const admin = await prisma.user.create({
    data: {
      name: 'Admin',
      email: 'admin@cadence.com',
      passwordHash: await bcrypt.hash('Admin@123', 10),
    },
  });

  type SeedArtist = {
    name: string;
    dob?: Date;
    bio: string;
  };

  const artistsData: SeedArtist[] = [
    {
      name: 'Billie Eilish',
      dob: d('2001-12-18'),
      bio: 'American singer-songwriter. Known for Hit Me Hard and Soft and earlier viral singles.',
    },
    {
      name: 'Eminem',
      dob: d('1972-10-17'),
      bio: 'American rapper and producer (Marshall Mathers). Known for Lose Yourself, Rap God, and Recovery-era singles.',
    },
    {
      name: 'Rihanna',
      dob: d('1988-02-20'),
      bio: 'Barbadian singer and songwriter (Robyn Rihanna Fenty). Featured on Love the Way You Lie.',
    },
    {
      name: 'Faheem Abdullah',
      bio: 'Kashmiri singer-composer; Lost;Found and the Saiyaara title track (YRF, 2025).',
    },
    {
      name: 'Rauhan Malik',
      bio: 'Composer and collaborator on Ishq (From "Lost;Found").',
    },
    {
      name: 'Amir Ameer',
      bio: 'Lyricist and featured artist on Ishq (From "Lost;Found").',
    },
    {
      name: 'Sagi Abitbul',
      bio: 'Israeli dance/electronic producer; co-artist on Stanga.',
    },
    {
      name: 'Guy Haliva',
      bio: 'Dance/electronic producer; co-artist on Stanga.',
    },
    {
      name: 'KK',
      dob: d('1968-08-23'),
      bio: 'Krishnakumar Kunnath - Indian playback singer. Labon Ko from Bhool Bhulaiyaa (2007).',
    },
    {
      name: 'Udit Narayan',
      dob: d('1955-12-01'),
      bio: 'Indian playback singer. Main Yahaan Hoon from Veer-Zaara (2004).',
    },
    {
      name: 'Imagine Dragons',
      bio: 'American pop-rock band (Las Vegas). Radioactive from Night Visions (2012).',
    },
    {
      name: 'Arijit Singh',
      dob: d('1987-04-25'),
      bio: 'Indian playback singer. Known for Tum Hi Ho, Phir Bhi Tumko Chaahunga, and many film hits.',
    },
    {
      name: 'Shashaa Tirupati',
      dob: d('1989-12-21'),
      bio: 'Canadian playback singer. Co-vocals on Phir Bhi Tumko Chaahunga (Half Girlfriend).',
    },
    {
      name: 'Afusic',
      bio: 'Independent artist; Pal Pal (2025) with AliSoomroMusic.',
    },
    {
      name: 'AliSoomroMusic',
      bio: 'Producer on Pal Pal with Afusic.',
    },
    {
      name: 'Saad Lamjarred',
      dob: d('1985-04-07'),
      bio: 'Moroccan singer-songwriter. Mal Hbibi from the album Wala Alik.',
    },
  ];

  const artistsByName = new Map<
    string,
    { id: string; name: string; imageUrl: string | null }
  >();

  for (const entry of artistsData) {
    const imageUrl = await resolveArtistImage({
      artistName: entry.name,
      imageKit,
    });
    const artist = await prisma.artist.create({
      data: {
        name: entry.name,
        dob: entry.dob,
        bio: entry.bio,
        imageUrl,
      },
    });
    artistsByName.set(entry.name, {
      id: artist.id,
      name: artist.name,
      imageUrl: artist.imageUrl,
    });
    console.log(`Artist ${entry.name}: ${imageUrl ? 'image ok' : 'no image'}`);
  }

  function artistId(name: string): string {
    const found = artistsByName.get(name);
    if (!found) {
      throw new Error(`Missing seeded artist: ${name}`);
    }
    return found.id;
  }

  type SeedSong = {
    name: string;
    releaseDate: Date;
    album: string | null;
    artistNames: string[];
  };

  const songsData: SeedSong[] = [
    {
      name: 'Wildflower',
      releaseDate: d('2024-05-17'),
      album: 'Hit Me Hard and Soft',
      artistNames: ['Billie Eilish'],
    },
    {
      name: 'Rap God',
      releaseDate: d('2013-10-15'),
      album: 'The Marshall Mathers LP 2',
      artistNames: ['Eminem'],
    },
    {
      name: 'Ishq (From "Lost;Found")',
      releaseDate: d('2024-03-09'),
      album: 'Lost;Found',
      artistNames: ['Faheem Abdullah', 'Rauhan Malik', 'Amir Ameer'],
    },
    {
      name: 'Stanga',
      releaseDate: d('2016-07-15'),
      album: null,
      artistNames: ['Sagi Abitbul', 'Guy Haliva'],
    },
    {
      name: 'Labon Ko',
      releaseDate: d('2007-09-03'),
      album: 'Bhool Bhulaiyaa',
      artistNames: ['KK'],
    },
    {
      name: 'Main Yahaan Hoon',
      releaseDate: d('2004-09-18'),
      album: 'Veer-Zaara',
      artistNames: ['Udit Narayan'],
    },
    {
      name: 'Radioactive',
      releaseDate: d('2012-09-04'),
      album: 'Night Visions',
      artistNames: ['Imagine Dragons'],
    },
    {
      name: 'Tum Hi Ho',
      releaseDate: d('2013-03-16'),
      album: 'Aashiqui 2',
      artistNames: ['Arijit Singh'],
    },
    {
      name: 'Pal Pal',
      releaseDate: d('2025-02-18'),
      album: null,
      artistNames: ['Afusic', 'AliSoomroMusic'],
    },
    {
      name: 'Uska Hi Banana',
      releaseDate: d('2012-10-09'),
      album: '1920: Evil Returns',
      artistNames: ['Arijit Singh'],
    },
    {
      name: 'Lose Yourself',
      releaseDate: d('2002-10-28'),
      album: '8 Mile: Music from and Inspired by the Motion Picture',
      artistNames: ['Eminem'],
    },
    {
      name: 'Love the Way You Lie',
      releaseDate: d('2010-06-18'),
      album: 'Recovery',
      artistNames: ['Eminem', 'Rihanna'],
    },
    {
      name: 'Phir Bhi Tumko Chaahunga',
      releaseDate: d('2017-04-18'),
      album: 'Half Girlfriend',
      artistNames: ['Arijit Singh', 'Shashaa Tirupati'],
    },
    {
      name: 'Saiyaara',
      releaseDate: d('2025-06-03'),
      album: 'Saiyaara',
      artistNames: ['Faheem Abdullah'],
    },
    {
      name: 'Mal Hbibi',
      releaseDate: d('2012-12-21'),
      album: 'Wala Alik',
      artistNames: ['Saad Lamjarred'],
    },
  ];

  const songs: { id: string }[] = [];
  for (const entry of songsData) {
    const coverUrl = await resolveSongCover({
      songName: entry.name,
      album: entry.album,
      artistNames: entry.artistNames,
      imageKit,
    });
    const song = await prisma.song.create({
      data: {
        name: entry.name,
        releaseDate: entry.releaseDate,
        album: entry.album,
        coverUrl,
        createdByUserId: shahan.id,
        artists: {
          create: entry.artistNames.map((name) => ({
            artistId: artistId(name),
          })),
        },
      },
    });
    songs.push({ id: song.id });
    console.log(`Song ${entry.name}: ${coverUrl ? 'cover ok' : 'no cover'}`);
  }

  // Varied ratings so Top 10 order is not flat (decimals allowed)
  const ratingPlan: { userId: string; songIndex: number; value: number }[] = [
    { userId: shahan.id, songIndex: 0, value: 4.5 },
    { userId: admin.id, songIndex: 0, value: 5 },
    { userId: shahan.id, songIndex: 1, value: 4 },
    { userId: admin.id, songIndex: 1, value: 4.5 },
    { userId: shahan.id, songIndex: 2, value: 5 },
    { userId: admin.id, songIndex: 2, value: 4.5 },
    { userId: shahan.id, songIndex: 3, value: 3 },
    { userId: admin.id, songIndex: 3, value: 3.5 },
    { userId: shahan.id, songIndex: 4, value: 4.5 },
    { userId: admin.id, songIndex: 4, value: 5 },
    { userId: shahan.id, songIndex: 5, value: 4 },
    { userId: admin.id, songIndex: 5, value: 4 },
    { userId: shahan.id, songIndex: 6, value: 3.5 },
    { userId: admin.id, songIndex: 6, value: 4 },
    { userId: shahan.id, songIndex: 7, value: 5 },
    { userId: admin.id, songIndex: 7, value: 5 },
    { userId: shahan.id, songIndex: 8, value: 4 },
    { userId: admin.id, songIndex: 8, value: 3.5 },
    { userId: shahan.id, songIndex: 9, value: 4.5 },
    { userId: admin.id, songIndex: 9, value: 4 },
    { userId: shahan.id, songIndex: 10, value: 5 },
    { userId: admin.id, songIndex: 10, value: 4.5 },
    { userId: shahan.id, songIndex: 11, value: 4.5 },
    { userId: admin.id, songIndex: 11, value: 5 },
    { userId: shahan.id, songIndex: 12, value: 4.5 },
    { userId: admin.id, songIndex: 12, value: 4 },
    { userId: shahan.id, songIndex: 13, value: 5 },
    { userId: admin.id, songIndex: 13, value: 4.5 },
    { userId: shahan.id, songIndex: 14, value: 3.5 },
    { userId: admin.id, songIndex: 14, value: 4 },
  ];

  for (const row of ratingPlan) {
    await prisma.rating.create({
      data: {
        userId: row.userId,
        songId: songs[row.songIndex].id,
        value: row.value,
      },
    });
  }

  const artistsWithImage = [...artistsByName.values()].filter(
    (a) => a.imageUrl,
  ).length;
  console.log(
    `Seeded ${songs.length} songs, ${artistsByName.size} artists (${artistsWithImage} with images), 2 users, and ratings.`,
  );
}

main()
  .catch((error: unknown) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
