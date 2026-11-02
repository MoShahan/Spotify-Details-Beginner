import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('GET /artists/top', () => {
  const app = createApp();

  it('requires auth', async () => {
    const res = await request(app).get('/artists/top');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)(
    'returns at most 10 artists with averages',
    async () => {
      const login = await request(app).post('/auth/login').send({
        email: 'shahan@cadence.com',
        password: 'Shahan@123',
      });
      expect(login.status).toBe(200);

      const res = await request(app)
        .get('/artists/top')
        .set('Authorization', `Bearer ${login.body.token as string}`);

      expect(res.status).toBe(200);
      expect(Array.isArray(res.body.artists)).toBe(true);
      expect(res.body.artists.length).toBeGreaterThan(0);
      expect(res.body.artists.length).toBeLessThanOrEqual(10);
      expect(res.body.artists[0]).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          averageRating: expect.anything(),
          ratingCount: expect.any(Number),
        }),
      );
    },
  );
});
