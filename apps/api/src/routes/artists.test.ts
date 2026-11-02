import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';
import {
  cleanupCadenceTestUsers,
  registerAndGetToken,
} from '../test/auth-helpers.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('POST /artists', () => {
  const app = createApp();

  it('rejects without a JWT', async () => {
    const res = await request(app).post('/artists').send({ name: 'No Auth' });
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it.skipIf(!hasDatabase)('rejects empty name when authenticated', async () => {
    const { token } = await registerAndGetToken(app, 'artist-empty');
    const res = await request(app)
      .post('/artists')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: '' });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it.skipIf(!hasDatabase)(
    'creates an artist and rejects duplicate names',
    async () => {
      const { token } = await registerAndGetToken(app, 'artist-create');
      const name = `Test Artist ${Date.now()}`;

      const created = await request(app)
        .post('/artists')
        .set('Authorization', `Bearer ${token}`)
        .send({
          name,
          bio: 'Created by API test',
        });

      expect(created.status).toBe(201);
      expect(created.body.artist.name).toBe(name);
      expect(created.body.artist.id).toEqual(expect.any(String));
      expect(created.body.artist.averageRating).toBeNull();
      expect(created.body.artist.ratingCount).toBe(0);

      const duplicate = await request(app)
        .post('/artists')
        .set('Authorization', `Bearer ${token}`)
        .send({ name });

      expect(duplicate.status).toBe(409);
      expect(duplicate.body.error.code).toBe('ARTIST_NAME_TAKEN');

      const { prisma } = await import('../lib/prisma.js');
      await prisma.artist.delete({ where: { id: created.body.artist.id } });
    },
  );

  it.skipIf(!hasDatabase)(
    'rejects an existing seeded artist name with 409',
    async () => {
      const { token } = await registerAndGetToken(app, 'artist-seeded');
      const res = await request(app)
        .post('/artists')
        .set('Authorization', `Bearer ${token}`)
        .send({ name: 'Billie Eilish' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('ARTIST_NAME_TAKEN');
    },
  );

  afterAll(async () => {
    if (!hasDatabase) {
      return;
    }
    await cleanupCadenceTestUsers();
  });
});
