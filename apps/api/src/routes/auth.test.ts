import request from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

function uniqueEmail(label: string): string {
  return `${label}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@cadence.test`;
}

describe('Auth API', () => {
  const app = createApp();

  it('rejects weak passwords on register', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        name: 'Weak User',
        email: uniqueEmail('weak'),
        password: 'password',
      });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('rejects /auth/me without a token', async () => {
    const res = await request(app).get('/auth/me');
    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('AUTH_REQUIRED');
  });

  it('rejects /auth/me with a bad token', async () => {
    const res = await request(app)
      .get('/auth/me')
      .set('Authorization', 'Bearer not-a-real-token');

    expect(res.status).toBe(401);
    expect(res.body.error.code).toBe('INVALID_TOKEN');
  });

  it.skipIf(!hasDatabase)('registers, logs in, and returns /me', async () => {
    const email = uniqueEmail('happy');
    const password = 'GoodPass1!';

    const registered = await request(app).post('/auth/register').send({
      name: 'Happy Path',
      email,
      password,
    });

    expect(registered.status).toBe(201);
    expect(registered.body.token).toEqual(expect.any(String));
    expect(registered.body.user.email).toBe(email.toLowerCase());
    expect(registered.body.user).not.toHaveProperty('passwordHash');

    const duplicate = await request(app).post('/auth/register').send({
      name: 'Happy Path',
      email,
      password,
    });
    expect(duplicate.status).toBe(409);
    expect(duplicate.body.error.code).toBe('EMAIL_TAKEN');

    const badLogin = await request(app).post('/auth/login').send({
      email,
      password: 'WrongPass1!',
    });
    expect(badLogin.status).toBe(401);
    expect(badLogin.body.error.code).toBe('INVALID_CREDENTIALS');

    const login = await request(app).post('/auth/login').send({
      email,
      password,
    });
    expect(login.status).toBe(200);
    expect(login.body.token).toEqual(expect.any(String));

    const me = await request(app)
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.token as string}`);

    expect(me.status).toBe(200);
    expect(me.body.user.email).toBe(email.toLowerCase());
    expect(me.body.user.name).toBe('Happy Path');
  });

  afterAll(async () => {
    if (!hasDatabase) {
      return;
    }
    const { prisma } = await import('../lib/prisma.js');
    await prisma.user.deleteMany({
      where: { email: { endsWith: '@cadence.test' } },
    });
  });
});
