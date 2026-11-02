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
  imageUrl: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .url('Image URL must be a valid URL')
      .max(2048, 'Image URL must be at most 2048 characters')
      .optional(),
  ),
});

/** PATCH artist image (empty string clears). */
export const updateArtistImageBodySchema = z.object({
  imageUrl: z.preprocess(
    (value) => {
      if (value === '' || value === null) {
        return null;
      }
      return value;
    },
    z.union([
      z.string().trim().url('Image URL must be a valid URL').max(2048),
      z.null(),
    ]),
  ),
});

export type CreateArtistBody = z.infer<typeof createArtistBodySchema>;
export type UpdateArtistImageBody = z.infer<typeof updateArtistImageBodySchema>;
