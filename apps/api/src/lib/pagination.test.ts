import { describe, expect, it } from 'vitest';

import { paginateItems } from './pagination.js';

describe('paginateItems', () => {
  const items = [1, 2, 3, 4, 5];

  it('returns the first page and hasMore when more remain', () => {
    expect(paginateItems(items, 0, 2)).toEqual({
      items: [1, 2],
      hasMore: true,
    });
  });

  it('returns hasMore false on the last page', () => {
    expect(paginateItems(items, 4, 2)).toEqual({
      items: [5],
      hasMore: false,
    });
  });

  it('returns an empty page past the end', () => {
    expect(paginateItems(items, 10, 2)).toEqual({
      items: [],
      hasMore: false,
    });
  });
});
