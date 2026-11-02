import { z } from 'zod';

/** Rating value: 1–5 inclusive, decimals allowed (e.g. 3.5). */
export const ratingValueSchema = z
  .number({
    required_error: 'Rating value is required',
    invalid_type_error: 'Rating must be a number',
  })
  .min(1, 'Rating must be at least 1')
  .max(5, 'Rating must be at most 5');

export const upsertRatingBodySchema = z.object({
  value: ratingValueSchema,
});

export const songIdParamsSchema = z.object({
  id: z.string().min(1, 'Song id is required'),
});

export type UpsertRatingBody = z.infer<typeof upsertRatingBodySchema>;
export type SongIdParams = z.infer<typeof songIdParamsSchema>;
