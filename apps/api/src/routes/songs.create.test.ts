import request from 'supertest';
import { describe, expect, it } from 'vitest';

import { createApp } from '../app.js';

const hasDatabase = Boolean(process.env.DATABASE_URL);

describe('POST /songs create guards', () => {
  const app = createApp();

  it('rejects songs with zero artists', async () => {
    const res = await request(app).post('/songs').send({
      name: 'Hello',
      releaseDate: '2012-01-01',
      artistIds: [],
    });

    expect(res.status).toBe(400);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it.skipIf(!hasDatabase)(
    'rejects duplicate title + same artist set with 409',
    async () => {
      const { prisma } = await import('../lib/prisma.js');
      const wildflower = await prisma.song.findFirst({
        where: { name: 'Wildflower' },
        include: { artists: true },
      });

      expect(wildflower).not.toBeNull();
      if (!wildflower) {
        return;
      }

      const res = await request(app)
        .post('/songs')
        .send({
          name: 'Wildflower',
          releaseDate: '2024-05-17',
          artistIds: wildflower.artists.map((link) => link.artistId).reverse(),
        });

      expect(res.status).toBe(409);
      expect(res.body.error.code).toBe('SONG_DUPLICATE');
    },
  );
});
