import { z } from 'zod';

/**
 * Register password rules - used by **web (first)** and **API (safety net)**.
 * - min 8, max 24 characters
 * - at least one uppercase letter
 * - at least one lowercase letter
 * - at least one number
 * - at least one symbol (non-alphanumeric)
 */
export const PASSWORD_MIN = 8;
export const PASSWORD_MAX = 24;

const hasUppercase = /[A-Z]/;
const hasLowercase = /[a-z]/;
const hasNumber = /[0-9]/;
const hasSymbol = /[^A-Za-z0-9]/;

export const passwordSchema = z
  .string({
    required_error: 'Password is required',
    invalid_type_error: 'Password must be a string',
  })
  .min(PASSWORD_MIN, `Password must be at least ${PASSWORD_MIN} characters`)
  .max(PASSWORD_MAX, `Password must be at most ${PASSWORD_MAX} characters`)
  .refine((value) => hasUppercase.test(value), {
    message: 'Password must include at least one uppercase letter',
  })
  .refine((value) => hasLowercase.test(value), {
    message: 'Password must include at least one lowercase letter',
  })
  .refine((value) => hasNumber.test(value), {
    message: 'Password must include at least one number',
  })
  .refine((value) => hasSymbol.test(value), {
    message: 'Password must include at least one symbol',
  });
