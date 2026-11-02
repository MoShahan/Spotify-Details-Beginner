import { z } from 'zod';

import { passwordSchema } from './password.js';

export const registerBodySchema = z.object({
  name: z
    .string({ required_error: 'Name is required' })
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Email must be valid')
    .max(255, 'Email must be at most 255 characters'),
  password: passwordSchema,
});

export const loginBodySchema = z.object({
  email: z
    .string({ required_error: 'Email is required' })
    .trim()
    .email('Email must be valid'),
  password: z.string({ required_error: 'Password is required' }).min(1),
});

export type RegisterBody = z.infer<typeof registerBodySchema>;
export type LoginBody = z.infer<typeof loginBodySchema>;
