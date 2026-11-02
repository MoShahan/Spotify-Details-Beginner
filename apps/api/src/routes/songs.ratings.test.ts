import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

describe('POST /songs/:id/ratings validation', () => {
  const app = createApp();

  it('rejects value below 1', async () => {
    const res = await request(app)
      .post('/songs/song_1/ratings')
      .send({ value: 0 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects value above 5', async () => {
    const res = await request(app)
      .post('/songs/song_1/ratings')
      .send({ value: 5.1 });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('accepts decimal in range then requires auth (not implemented yet)', async () => {
    const res = await request(app)
      .post('/songs/song_1/ratings')
      .send({ value: 3.5 });

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });
});
