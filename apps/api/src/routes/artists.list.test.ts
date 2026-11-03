import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('GET /artists', () => {
  const app = createApp();

  it('requires auth', async () => {
    const res = await request(app).get('/artists');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)('returns artists ordered by name', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'shahan@cadence.com',
      password: 'Shahan@123',
    });
    expect(login.status).toBe(200);

    const res = await request(app)
      .get('/artists')
      .set('Authorization', `Bearer ${login.body.token as string}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.artists)).toBe(true);
    expect(typeof res.body.hasMore).toBe('boolean');
    expect(res.body.artists.length).toBeGreaterThan(0);

    const names = res.body.artists.map((a: { name: string }) => a.name);
    expect(names).toEqual([...names].sort((a, b) => a.localeCompare(b)));

    expect(res.body.artists[0]).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        name: expect.any(String),
      }),
    );
    expect(names).toContain('Billie Eilish');
  });

  it.skipIf(!hasDatabase)('paginates with limit and offset', async () => {
    const login = await request(app).post('/auth/login').send({
      email: 'shahan@cadence.com',
      password: 'Shahan@123',
    });
    expect(login.status).toBe(200);
    const token = login.body.token as string;

    const first = await request(app)
      .get('/artists')
      .query({ limit: 2, offset: 0, sortBy: 'name', sortOrder: 'asc' })
      .set('Authorization', `Bearer ${token}`);

    expect(first.status).toBe(200);
    expect(first.body.artists).toHaveLength(2);
    expect(first.body.hasMore).toBe(true);

    const second = await request(app)
      .get('/artists')
      .query({ limit: 2, offset: 2, sortBy: 'name', sortOrder: 'asc' })
      .set('Authorization', `Bearer ${token}`);

    expect(second.status).toBe(200);
    expect(second.body.artists).toHaveLength(2);
    expect(second.body.artists[0].id).not.toBe(first.body.artists[0].id);
  });
});
