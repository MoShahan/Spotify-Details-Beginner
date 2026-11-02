import { z } from 'zod';

export const imageKitAuthBodySchema = z.object({
  folder: z.enum(['songs', 'artists']).default('songs'),
});

export type ImageKitAuthBody = z.infer<typeof imageKitAuthBodySchema>;
