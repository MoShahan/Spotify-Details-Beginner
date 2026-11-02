import { z } from 'zod';

const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

function emptyToUndefined(value: unknown): unknown {
  if (value === '' || value === null) {
    return undefined;
  }
  return value;
}

export const listSongsQuerySchema = z.object({
  q: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
  sortBy: z.enum(['name', 'rating', 'releaseYear', 'album']).default('name'),
  sortOrder: sortOrderSchema,
});

export const listArtistsQuerySchema = z.object({
  q: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
  sortBy: z.enum(['name', 'rating', 'dob']).default('name'),
  sortOrder: sortOrderSchema,
});

export type ListSongsQuery = z.infer<typeof listSongsQuerySchema>;
export type ListArtistsQuery = z.infer<typeof listArtistsQuerySchema>;
