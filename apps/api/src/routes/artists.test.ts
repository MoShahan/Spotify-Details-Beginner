import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('POST /artists uniqueness', () => {
  const app = createApp();

  it('rejects empty name', async () => {
    const res = await request(app).post('/artists').send({ name: '' });
    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it.skipIf(!hasDatabase)(
    'rejects an existing artist name with 409',
    async () => {
      const res = await request(app)
        .post('/artists')
        .send({ name: 'Billie Eilish' });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('ARTIST_NAME_TAKEN');
    },
  );
});
