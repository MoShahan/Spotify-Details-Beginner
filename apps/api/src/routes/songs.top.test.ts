import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('GET /songs/top', () => {
  const app = createApp();

  it('requires auth', async () => {
    const res = await request(app).get('/songs/top');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)('returns at most 10 songs', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'shahan@cadence.com',
      password: 'Shahan@123',
    });
    expect(login.status).toBe(200);

    const res = await request(app)
      .get('/songs/top')
      .set('Authorization', `Bearer ${login.body.token as string}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.songs)).toBe(true);
    expect(res.body.songs.length).toBeGreaterThan(0);
    expect(res.body.songs.length).toBeLessThanOrEqual(10);
  });
});
