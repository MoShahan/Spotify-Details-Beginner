import { z } from 'zod';

function emptyToUndefined(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

export const createArtistBodySchema = z.object({
  name: z
    .string({ required_error: 'Artist name is required' })
    .trim()
    .min(1, 'Artist name is required')
    .max(150, 'Artist name must be at most 150 characters'),
  dob: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .date('Date of birth must be a valid date (YYYY-MM-DD)')
      .optional(),
  ),
  bio: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(5000, 'Bio must be at most 5000 characters')
      .optional(),
  ),
});

export type CreateArtistBody = z.infer<typeof createArtistBodySchema>;
