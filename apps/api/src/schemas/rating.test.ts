import { describe, expect, it } from 'vitest';

import { ratingValueSchema, upsertRatingBodySchema } from './rating.js';

describe('ratingValueSchema', () => {
  it('accepts integers and decimals in 1–5', () => {
    expect(ratingValueSchema.parse(1)).toBe(1);
    expect(ratingValueSchema.parse(5)).toBe(5);
    expect(ratingValueSchema.parse(3.5)).toBe(3.5);
    expect(ratingValueSchema.parse(1.0)).toBe(1);
  });

  it('rejects values outside 1–5', () => {
    expect(ratingValueSchema.safeParse(0).success).toBe(false);
    expect(ratingValueSchema.safeParse(0.9).success).toBe(false);
    expect(ratingValueSchema.safeParse(5.1).success).toBe(false);
    expect(ratingValueSchema.safeParse(6).success).toBe(false);
    expect(ratingValueSchema.safeParse(-1).success).toBe(false);
  });

  it('rejects non-numbers', () => {
    expect(ratingValueSchema.safeParse('3').success).toBe(false);
    expect(ratingValueSchema.safeParse(null).success).toBe(false);
  });
});

describe('upsertRatingBodySchema', () => {
  it('requires value', () => {
    expect(upsertRatingBodySchema.safeParse({}).success).toBe(false);
  });
});
