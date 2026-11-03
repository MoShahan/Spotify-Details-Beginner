import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('GET /songs', () => {
  const app = createApp();

  it('requires auth', async () => {
    const res = await request(app).get('/songs');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)(
    'returns songs with artists and averages',
    async () => {
      const login = await request(app).post('/auth/login').send({
        email: 'shahan@cadence.com',
        password: 'Shahan@123',
      });
      expect(login.status).toBe(200);

      const res = await request(app)
        .get('/songs')
        .set('Authorization', `Bearer ${login.body.token as string}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.songs)).toBe(true);
      expect(typeof res.body.hasMore).toBe('boolean');
      expect(res.body.songs.length).toBeGreaterThan(0);

      const wildflower = res.body.songs.find(
        (song: { name: string }) => song.name === 'Wildflower',
      );
      expect(wildflower).toBeDefined();
      expect(wildflower.artists.length).toBeGreaterThan(0);
      expect(wildflower.artists[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
        }),
      );
      expect(wildflower).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          releaseDate: expect.any(String),
          averageRating: expect.any(Number),
          ratingCount: expect.any(Number),
        }),
      );
    },
  );

  it.skipIf(!hasDatabase)('paginates with limit and offset', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'shahan@cadence.com',
      password: 'Shahan@123',
    });
    expect(login.status).toBe(200);
    const token = login.body.token as string;

    const first = await request(app)
      .get('/songs')
      .query({ limit: 2, offset: 0, sortBy: 'name', sortOrder: 'asc' })
      .set('Authorization', `Bearer ${token}`);

    expect(first.status).toBe(200);
    expect(first.body.songs).toHaveLength(2);
    expect(first.body.hasMore).toBe(true);

    const second = await request(app)
      .get('/songs')
      .query({ limit: 2, offset: 2, sortBy: 'name', sortOrder: 'asc' })
      .set('Authorization', `Bearer ${token}`);

    expect(second.status).toBe(200);
    expect(second.body.songs).toHaveLength(2);
    expect(second.body.songs[0].id).not.toBe(first.body.songs[0].id);
  });
});
