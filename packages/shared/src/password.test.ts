import { describe, expect, it } from 'vitest';

import { passwordSchema } from './password.js';

describe('passwordSchema (shared)', () => {
  it('accepts a valid password', () => {
    expect(passwordSchema.safeParse('Abcd123!').success).toBe(true);
  });

  it('rejects weak passwords', () => {
    expect(passwordSchema.safeParse('password').success).toBe(false);
    expect(passwordSchema.safeParse('Abcd1234').success).toBe(false);
    expect(passwordSchema.safeParse('Ab1!').success).toBe(false);
  });
});
