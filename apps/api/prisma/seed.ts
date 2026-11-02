/**
 * Cadence demo seed.
 *
 * Artist average rule (document for 1.1.5):
 * Artist avg = average of all rating values on songs linked to that artist
 * (not nested avg-of-song-avgs). Song avg = AVG(ratings.value) for that song.
 *
 * Song metadata sourced from public listings (Apple Music / Wikipedia / label pages).
 * coverUrl left null until ImageKit uploads.
 */
import 'dotenv/config';

import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import bcrypt from 'bcrypt';

import { PrismaClient } from '../src/generated/prisma/client.js';

function createAdapter() {
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is required to run seed');
  }

  const parsed = new URL(databaseUrl);
  const sslMode = parsed.searchParams.get('sslaccept');

  return new PrismaMariaDb({
    host: parsed.hostname,
    port: Number(parsed.port || 3306),
    user: decodeURIComponent(parsed.username),
    password: decodeURIComponent(parsed.password),
    database: parsed.pathname.replace(/^\//, '') || undefined,
    connectionLimit: 5,
    ssl:
      sslMode === 'strict'
        ? { rejectUnauthorized: true }
        : { rejectUnauthorized: false },
  });
}

const prisma = new PrismaClient({ adapter: createAdapter() });

function d(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00.000Z`);
}

async function main() {
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

  const billie = await prisma.artist.create({
    data: {
      name: 'Billie Eilish',
      dob: d('2001-12-18'),
      bio: 'American singer-songwriter. Known for Hit Me Hard and Soft and earlier viral singles.',
    },
  });

  const eminem = await prisma.artist.create({
    data: {
      name: 'Eminem',
      dob: d('1972-10-17'),
      bio: 'American rapper and producer (Marshall Mathers). The Marshall Mathers LP 2 era.',
    },
  });

  const faheem = await prisma.artist.create({
    data: {
      name: 'Faheem Abdullah',
      bio: 'Singer and composer; Lost;Found project with Rauhan Malik and Amir Ameer.',
    },
  });

  const rauhan = await prisma.artist.create({
    data: {
      name: 'Rauhan Malik',
      bio: 'Composer and collaborator on Ishq (From "Lost;Found").',
    },
  });

  const amir = await prisma.artist.create({
    data: {
      name: 'Amir Ameer',
      bio: 'Lyricist and featured artist on Ishq (From "Lost;Found").',
    },
  });

  const sagi = await prisma.artist.create({
    data: {
      name: 'Sagi Abitbul',
      bio: 'Israeli dance/electronic producer; co-artist on Stanga.',
    },
  });

  const guy = await prisma.artist.create({
    data: {
      name: 'Guy Haliva',
      bio: 'Dance/electronic producer; co-artist on Stanga.',
    },
  });

  const kk = await prisma.artist.create({
    data: {
      name: 'KK',
      dob: d('1968-08-23'),
      bio: 'Krishnakumar Kunnath - Indian playback singer. Labon Ko from Bhool Bhulaiyaa (2007).',
    },
  });

  const udit = await prisma.artist.create({
    data: {
      name: 'Udit Narayan',
      dob: d('1955-12-01'),
      bio: 'Indian playback singer. Main Yahaan Hoon from Veer-Zaara (2004).',
    },
  });

  const dragons = await prisma.artist.create({
    data: {
      name: 'Imagine Dragons',
      bio: 'American pop-rock band (Las Vegas). Radioactive from Night Visions (2012).',
    },
  });

  const arijit = await prisma.artist.create({
    data: {
      name: 'Arijit Singh',
      dob: d('1987-04-25'),
      bio: 'Indian playback singer. Known for Tum Hi Ho, Uska Hi Banana, and many film hits.',
    },
  });

  const afusic = await prisma.artist.create({
    data: {
      name: 'Afusic',
      bio: 'Independent artist; Pal Pal (2025) with AliSoomroMusic.',
    },
  });

  const aliSoomro = await prisma.artist.create({
    data: {
      name: 'AliSoomroMusic',
      bio: 'Producer on Pal Pal with Afusic.',
    },
  });

  type SeedSong = {
    name: string;
    releaseDate: Date;
    artistIds: string[];
  };

  const songsData: SeedSong[] = [
    {
      name: 'Wildflower',
      releaseDate: d('2024-05-17'),
      artistIds: [billie.id],
    },
    {
      name: 'Rap God',
      releaseDate: d('2013-10-15'),
      artistIds: [eminem.id],
    },
    {
      name: 'Ishq (From "Lost;Found")',
      releaseDate: d('2024-03-09'),
      artistIds: [faheem.id, rauhan.id, amir.id],
    },
    {
      name: 'Stanga',
      releaseDate: d('2016-07-15'),
      artistIds: [sagi.id, guy.id],
    },
    {
      name: 'Labon Ko',
      releaseDate: d('2007-09-03'),
      artistIds: [kk.id],
    },
    {
      name: 'Main Yahaan Hoon',
      releaseDate: d('2004-09-18'),
      artistIds: [udit.id],
    },
    {
      name: 'Radioactive',
      releaseDate: d('2012-09-04'),
      artistIds: [dragons.id],
    },
    {
      name: 'Tum Hi Ho',
      releaseDate: d('2013-03-16'),
      artistIds: [arijit.id],
    },
    {
      name: 'Pal Pal',
      releaseDate: d('2025-02-18'),
      artistIds: [afusic.id, aliSoomro.id],
    },
    {
      name: 'Uska Hi Banana',
      releaseDate: d('2012-10-09'),
      artistIds: [arijit.id],
    },
  ];

  const songs: { id: string }[] = [];
  for (const entry of songsData) {
    const song = await prisma.song.create({
      data: {
        name: entry.name,
        releaseDate: entry.releaseDate,
        createdByUserId: shahan.id,
        artists: {
          create: entry.artistIds.map((artistId) => ({ artistId })),
        },
      },
    });
    songs.push({ id: song.id });
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

  console.log(
    `Seeded ${songs.length} songs, artists, 2 users (see apps/api/local-creds.local), and ratings.`,
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
