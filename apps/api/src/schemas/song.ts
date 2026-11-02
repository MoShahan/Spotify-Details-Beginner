import { z } from 'zod';

function emptyToUndefined(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

export const createSongBodySchema = z.object({
  name: z
    .string({ required_error: 'Song name is required' })
    .trim()
    .min(1, 'Song name is required')
    .max(200, 'Song name must be at most 200 characters'),
  releaseDate: z
    .string({ required_error: 'Release date is required' })
    .trim()
    .date('Release date must be a valid date (YYYY-MM-DD)'),
  album: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .max(200, 'Album must be at most 200 characters')
      .optional(),
  ),
  coverUrl: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .url('Cover URL must be a valid URL')
      .max(2048, 'Cover URL must be at most 2048 characters')
      .optional(),
  ),
  /** At least one artist required; order does not matter (normalized server-side). */
  artistIds: z
    .array(z.string().trim().min(1, 'Artist id is required'), {
      required_error: 'At least one artist is required',
      invalid_type_error: 'artistIds must be an array',
    })
    .min(1, 'At least one artist is required')
    .max(20, 'A song may link at most 20 artists'),
});

/** PATCH song cover (empty string clears). */
export const updateSongCoverBodySchema = z.object({
  coverUrl: z.preprocess(
    (value) => {
      if (value === '' || value === null) {
        return null;
      }
      return value;
    },
    z.union([
      z.string().trim().url('Cover URL must be a valid URL').max(2048),
      z.null(),
    ]),
  ),
});

export type CreateSongBody = z.infer<typeof createSongBodySchema>;
export type UpdateSongCoverBody = z.infer<typeof updateSongCoverBodySchema>;
