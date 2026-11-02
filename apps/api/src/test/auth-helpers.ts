import type { Express } from 'express';
import request from 'supertest';

export function uniqueEmail(label: string): string {
  return `${label}.${Date.now()}.${Math.random().toString(36).slice(2, 8)}@cadence.test`;
}

/** Delete @cadence.test users and any songs/ratings they own (FK-safe). */
export async function cleanupCadenceTestUsers(): Promise<void> {
  const { prisma } = await import('../lib/prisma.js');
  const testUsers = { email: { endsWith: '@cadence.test' } };

  await prisma.rating.deleteMany({ where: { user: testUsers } });
  await prisma.songArtist.deleteMany({
    where: { song: { createdBy: testUsers } },
  });
  await prisma.song.deleteMany({ where: { createdBy: testUsers } });
  await prisma.user.deleteMany({ where: testUsers });
}

export async function registerAndGetToken(
  app: Express,
  label: string,
): Promise<{ token: string; email: string; userId: string }> {
  const email = uniqueEmail(label);
  const password = 'GoodPass1!';

  const registered = await request(app)
    .post('/auth/register')
    .send({
      name: `Test ${label}`,
      email,
      password,
    });

  if (registered.status !== 201) {
    throw new Error(
      `Failed to register test user (${registered.status}): ${JSON.stringify(registered.body)}`,
    );
  }

  return {
    token: registered.body.token as string,
    email,
    userId: registered.body.user.id as string,
  };
}
