import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import {
  cleanupCadenceTestUsers,
  registerAndGetToken,
} from '../test/auth-helpers.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('POST /songs', () => {
  const app = createApp();

  it('rejects without a JWT', async () => {
    const res = await request(app)
      .post('/songs')
      .send({
        name: 'Hello',
        releaseDate: '2012-01-01',
        artistIds: ['artist_1'],
      });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)(
    'rejects songs with zero artists when authenticated',
    async () => {
      const { token } = await registerAndGetToken(app, 'song-empty-artists');
      const res = await request(app)
        .post('/songs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Hello',
          releaseDate: '2012-01-01',
          artistIds: [],
        });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    },
  );

  it.skipIf(!hasDatabase)(
    'creates a song and rejects duplicate title + same artist set',
    async () => {
      const { token } = await registerAndGetToken(app, 'song-create');
      const { prisma } = await import('../lib/prisma.js');

      const artist = await prisma.artist.findFirst({
        where: { name: 'Eminem' },
      });
      expect(artist).not.toBeNull();
      if (!artist) {
        return;
      }

      const name = `API Test Song ${Date.now()}`;
      const created = await request(app)
        .post('/songs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name,
          releaseDate: '2024-01-15',
          album: 'Test Album',
          artistIds: [artist.id],
        });

      expect(created.status).toBe(201);
      expect(created.body.song.name).toBe(name);
      expect(created.body.song.album).toBe('Test Album');
      expect(created.body.song.artists).toEqual([
        { id: artist.id, name: artist.name },
      ]);
      expect(created.body.song.averageRating).toBeNull();

      const duplicate = await request(app)
        .post('/songs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name,
          releaseDate: '2024-01-15',
          artistIds: [artist.id],
        });

      expect(duplicate.status).toBe(409);
      expect(duplicate.body.error.code).toBe('SONG_DUPLICATE');

      await prisma.songArtist.deleteMany({
        where: { songId: created.body.song.id },
      });
      await prisma.song.delete({ where: { id: created.body.song.id } });
    },
  );

  it.skipIf(!hasDatabase)(
    'rejects duplicate seeded title + same artist set with 409',
    async () => {
      const { token } = await registerAndGetToken(app, 'song-seeded-dup');
      const { prisma } = await import('../lib/prisma.js');
      const wildflower = await prisma.song.findFirst({
        where: { name: 'Wildflower' },
        include: { artists: true },
      });

      expect(wildflower).not.toBeNull();
      if (!wildflower) {
        return;
      }

      const res = await request(app)
        .post('/songs')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name: 'Wildflower',
          releaseDate: '2024-05-17',
          artistIds: wildflower.artists.map((link) => link.artistId).reverse(),
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('SONG_DUPLICATE');
    },
  );

  afterAll(async () => {
    if (!hasDatabase) {
      return;
    }
    await cleanupCadenceTestUsers();
  });
});
