import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import {
  cleanupCadenceTestUsers,
  registerAndGetToken,
} from '../test/auth-helpers.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('POST /songs/:id/ratings', () => {
  const app = createApp();

  it('rejects without a JWT', async () => {
    const res = await request(app)
      .post('/songs/song_1/ratings')
      .send({ value: 3.5 });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)(
    'rejects value below 1 when authenticated',
    async () => {
      const { token } = await registerAndGetToken(app, 'rating-low');
      const res = await request(app)
        .post('/songs/song_1/ratings')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 0 });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    },
  );

  it.skipIf(!hasDatabase)(
    'rejects value above 5 when authenticated',
    async () => {
      const { token } = await registerAndGetToken(app, 'rating-high');
      const res = await request(app)
        .post('/songs/song_1/ratings')
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 5.1 });

      expect(res.status).toBe(400);
      expect(res.body.error.code).toBe('VALIDATION_ERROR');
    },
  );

  it.skipIf(!hasDatabase)(
    'upserts a rating and updates song average',
    async () => {
      const { token } = await registerAndGetToken(app, 'rating-upsert');
      const { prisma } = await import('../lib/prisma.js');

      const song = await prisma.song.findFirst({
        where: { name: 'Wildflower' },
      });
      expect(song).not.toBeNull();
      if (!song) {
        return;
      }

      const first = await request(app)
        .post(`/songs/${song.id}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 4.5 });

      expect(first.status).toBe(200);
      expect(first.body.rating.songId).toBe(song.id);
      expect(first.body.rating.value).toBe(4.5);

      const second = await request(app)
        .post(`/songs/${song.id}/ratings`)
        .set('Authorization', `Bearer ${token}`)
        .send({ value: 3 });

      expect(second.status).toBe(200);
      expect(second.body.rating.value).toBe(3);
      expect(second.body.rating.id).toBe(first.body.rating.id);

      const detail = await request(app)
        .get(`/songs/${song.id}`)
        .set('Authorization', `Bearer ${token}`);

      expect(detail.status).toBe(200);
      expect(detail.body.song.ratingCount).toBeGreaterThanOrEqual(1);
      expect(detail.body.song.averageRating).toEqual(expect.any(Number));

      await prisma.rating.deleteMany({
        where: { id: first.body.rating.id },
      });
    },
  );

  it.skipIf(!hasDatabase)('returns 404 for an unknown song', async () => {
    const { token } = await registerAndGetToken(app, 'rating-missing');
    const res = await request(app)
      .post('/songs/does_not_exist_song/ratings')
      .set('Authorization', `Bearer ${token}`)
      .send({ value: 4 });

    expect(res.status).toBe(404);
    expect(res.body.error.code).toBe('NOT_FOUND');
  });

  afterAll(async () => {
    if (!hasDatabase) {
      return;
    }
    await cleanupCadenceTestUsers();
  });
});
