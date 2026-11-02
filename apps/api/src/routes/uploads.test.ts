import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import {
  cleanupCadenceTestUsers,
  registerAndGetToken,
} from '../test/auth-helpers.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);
const hasImageKit = Boolean(
  process.env.IMAGEKIT_PRIVATE_KEY?.trim() &&
  process.env.IMAGEKIT_PUBLIC_KEY?.trim() &&
  process.env.IMAGEKIT_URL_ENDPOINT?.trim(),
);

describe('POST /uploads/imagekit-auth', () => {
  const app = createApp();

  it('rejects without a JWT', async () => {
    const res = await request(app).post('/uploads/imagekit-auth');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it('rejects with an invalid JWT', async () => {
    const res = await request(app)
      .post('/uploads/imagekit-auth')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_TOKEN');
  });

  it.skipIf(!hasDatabase || !hasImageKit)(
    'returns signed upload params when authenticated',
    async () => {
      const { token } = await registerAndGetToken(app, 'imagekit-auth');
      const res = await request(app)
        .post('/uploads/imagekit-auth')
        .set('Authorization', `Bearer ${token}`)
        .send({ folder: 'songs' });

      expect(res.status).toBe(200);
      expect(res.body).toEqual(
        expect.objectContaining({
          token: expect.any(String),
          expire: expect.any(Number),
          signature: expect.any(String),
          publicKey: expect.any(String),
          urlEndpoint: expect.any(String),
          folder: expect.stringContaining('/songs'),
        }),
      );
    },
  );

  afterAll(async () => {
    if (!hasDatabase) {
      return;
    }
    await cleanupCadenceTestUsers();
  });
});
