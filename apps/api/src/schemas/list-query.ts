import { z } from 'zod';

import { emptyToUndefined } from './preprocess.js';

const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

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
