import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import {
  cleanupCadenceTestUsers,
  registerAndGetToken,
} from '../test/auth-helpers.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('Catalog detail + image PATCH routes', () => {
  const app = createApp();

  it('requires auth for song and artist detail', async () => {
    const song = await request(app).get('/songs/any-id');
    expect(song.status).toBe(401);
    expect(song.body.error.code).toBe('AUTH_REQUIRED');

    const artist = await request(app).get('/artists/any-id');
    expect(artist.status).toBe(401);
    expect(artist.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)(
    'returns song detail and updates cover URL',
    async () => {
      const { token } = await registerAndGetToken(app, 'song-detail');
      const { prisma } = await import('../lib/prisma.js');
      const song = await prisma.song.findFirst({
        where: { name: 'Wildflower' },
      });
      expect(song).not.toBeNull();
      if (!song) {
        return;
      }

      const detail = await request(app)
        .get(`/songs/${song.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(detail.status).toBe(200);
      expect(detail.body.song.name).toBe('Wildflower');
      expect(detail.body.song.artists.length).toBeGreaterThan(0);

      const coverUrl = 'https://example.com/test-cover.jpg';
      const patched = await request(app)
        .patch(`/songs/${song.id}/cover`)
        .set('Authorization', `Bearer ${token}`)
        .send({ coverUrl });

      expect(patched.status).toBe(200);
      expect(patched.body.song.coverUrl).toBe(coverUrl);

      await request(app)
        .patch(`/songs/${song.id}/cover`)
        .set('Authorization', `Bearer ${token}`)
        .send({ coverUrl: song.coverUrl });
    },
  );

  it.skipIf(!hasDatabase)(
    'returns artist detail and updates image URL',
    async () => {
      const { token } = await registerAndGetToken(app, 'artist-detail');
      const { prisma } = await import('../lib/prisma.js');
      const artist = await prisma.artist.findFirst({
        where: { name: 'Billie Eilish' },
      });
      expect(artist).not.toBeNull();
      if (!artist) {
        return;
      }

      const detail = await request(app)
        .get(`/artists/${artist.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(detail.status).toBe(200);
      expect(detail.body.artist.name).toBe('Billie Eilish');
      expect(Array.isArray(detail.body.artist.songs)).toBe(true);

      const imageUrl = 'https://example.com/test-artist.jpg';
      const patched = await request(app)
        .patch(`/artists/${artist.id}/image`)
        .set('Authorization', `Bearer ${token}`)
        .send({ imageUrl });

      expect(patched.status).toBe(200);
      expect(patched.body.artist.imageUrl).toBe(imageUrl);

      await request(app)
        .patch(`/artists/${artist.id}/image`)
        .set('Authorization', `Bearer ${token}`)
        .send({ imageUrl: artist.imageUrl });
    },
  );

  afterAll(async () => {
    if (!hasDatabase) {
      return;
    }
    await cleanupCadenceTestUsers();
  });
});
