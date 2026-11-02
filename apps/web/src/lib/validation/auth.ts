import { z } from 'zod';

import { passwordSchema } from './password';

export const loginFormSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Email must be valid'),
  password: z.string().min(1, 'Password is required'),
});

export const registerFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Name is required')
    .max(100, 'Name must be at most 100 characters'),
  email: z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Email must be valid')
    .max(255, 'Email must be at most 255 characters'),
  password: passwordSchema,
});

export type LoginFormValues = z.infer<typeof loginFormSchema>;
export type RegisterFormValues = z.infer<typeof registerFormSchema>;
