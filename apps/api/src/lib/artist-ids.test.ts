import { describe, expect, it } from 'vitest';

import { artistIdsEqual, normalizeArtistIds } from './artist-ids.js';

describe('normalizeArtistIds', () => {
  it('dedupes and sorts', () => {
    expect(normalizeArtistIds(['b', 'a', 'b'])).toEqual(['a', 'b']);
  });
});

describe('artistIdsEqual', () => {
  it('treats same set as equal regardless of order', () => {
    expect(artistIdsEqual(['a', 'b'], ['b', 'a'])).toBe(true);
  });

  it('treats different sets as not equal', () => {
    expect(artistIdsEqual(['a', 'b'], ['a', 'c'])).toBe(false);
    expect(artistIdsEqual(['a'], ['a', 'b'])).toBe(false);
  });
});
