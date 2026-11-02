import { z } from 'zod';

export const createSongFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Song name is required')
    .max(200, 'Song name must be at most 200 characters'),
  releaseDate: z
    .string()
    .trim()
    .min(1, 'Release date is required')
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'Use YYYY-MM-DD'),
  album: z.string().max(200, 'Album must be at most 200 characters'),
  coverUrl: z
    .string()
    .max(2048, 'Cover URL must be at most 2048 characters')
    .refine(
      (value) => value.trim() === '' || URL.canParse(value.trim()),
      'Cover URL must be a valid URL',
    ),
  artistIds: z
    .array(z.string().min(1))
    .min(1, 'Pick at least one artist')
    .max(20, 'A song may link at most 20 artists'),
});

export type CreateSongFormValues = z.infer<typeof createSongFormSchema>;

export const createArtistFormSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, 'Artist name is required')
    .max(150, 'Artist name must be at most 150 characters'),
  dob: z
    .string()
    .refine(
      (value) => value === '' || /^\d{4}-\d{2}-\d{2}$/.test(value),
      'Use YYYY-MM-DD',
    ),
  bio: z.string().max(5000, 'Bio must be at most 5000 characters'),
  imageUrl: z
    .string()
    .max(2048, 'Image URL must be at most 2048 characters')
    .refine(
      (value) => value.trim() === '' || URL.canParse(value.trim()),
      'Image URL must be a valid URL',
    ),
});

export type CreateArtistFormValues = z.infer<typeof createArtistFormSchema>;
