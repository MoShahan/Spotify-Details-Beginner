import { describe, expect, it } from 'vitest';

import { createArtistBodySchema } from './artist.js';

describe('createArtistBodySchema', () => {
  it('accepts name only', () => {
    const result = createArtistBodySchema.safeParse({ name: 'New Artist' });
    expect(result.success).toBe(true);
  });

  it('rejects empty name', () => {
    const result = createArtistBodySchema.safeParse({ name: '  ' });
    expect(result.success).toBe(false);
  });
});
