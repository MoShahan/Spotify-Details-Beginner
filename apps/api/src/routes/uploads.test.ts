import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

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
});
