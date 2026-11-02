import { describe, expect, it } from 'vitest';

import { createSongBodySchema } from './song.js';

describe('createSongBodySchema', () => {
  it('requires at least one artist', () => {
    const result = createSongBodySchema.safeParse({
      name: 'Hello',
      releaseDate: '2012-01-01',
      artistIds: [],
    });
    expect(result.success).toBe(false);
  });

  it('accepts song with one artist', () => {
    const result = createSongBodySchema.safeParse({
      name: 'Hello',
      releaseDate: '2012-01-01',
      artistIds: ['artist_1'],
    });
    expect(result.success).toBe(true);
  });
});
