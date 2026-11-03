import { z } from 'zod';

import { emptyToUndefined } from './preprocess.js';

const sortOrderSchema = z.enum(['asc', 'desc']).default('asc');

/** Query strings arrive as strings; coerce with safe defaults when omitted. */
const limitSchema = z.preprocess(
  (value) => (value === undefined || value === '' ? 20 : value),
  z.coerce.number().int().min(1).max(100),
);

const offsetSchema = z.preprocess(
  (value) => (value === undefined || value === '' ? 0 : value),
  z.coerce.number().int().min(0),
);

const paginationFields = {
  limit: limitSchema,
  offset: offsetSchema,
};

export const listSongsQuerySchema = z.object({
  q: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
  sortBy: z.enum(['name', 'rating', 'releaseYear', 'album']).default('name'),
  sortOrder: sortOrderSchema,
  ...paginationFields,
});

export const listArtistsQuerySchema = z.object({
  q: z.preprocess(emptyToUndefined, z.string().trim().max(100).optional()),
  sortBy: z.enum(['name', 'rating', 'dob']).default('name'),
  sortOrder: sortOrderSchema,
  ...paginationFields,
});

export type ListSongsQuery = z.infer<typeof listSongsQuerySchema>;
export type ListArtistsQuery = z.infer<typeof listArtistsQuerySchema>;
