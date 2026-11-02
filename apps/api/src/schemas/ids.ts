import { z } from 'zod';

export const idParamsSchema = z.object({
  id: z.string().trim().min(1, 'Id is required'),
});

export type IdParams = z.infer<typeof idParamsSchema>;
