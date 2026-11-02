import { describe, expect, it } from 'vitest';

import { passwordSchema } from './password.js';

describe('passwordSchema', () => {
  it('accepts a valid password', () => {
    expect(passwordSchema.safeParse('Abcd123!').success).toBe(true);
    expect(passwordSchema.safeParse('GoodPass1$').success).toBe(true);
  });

  it('rejects too short or too long', () => {
    expect(passwordSchema.safeParse('Ab1!xyz').success).toBe(false);
    expect(passwordSchema.safeParse('Abcd123!' + 'x'.repeat(20)).success).toBe(
      false,
    );
  });

  it('rejects missing uppercase, lowercase, number, or symbol', () => {
    expect(passwordSchema.safeParse('abcd123!').success).toBe(false);
    expect(passwordSchema.safeParse('ABCD123!').success).toBe(false);
    expect(passwordSchema.safeParse('Abcdefgh!').success).toBe(false);
    expect(passwordSchema.safeParse('Abcd1234').success).toBe(false);
  });
});
