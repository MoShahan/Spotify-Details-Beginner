import { Router } from 'express';

import { validateRequest } from '../middleware/validate.js';
import {
  songIdParamsSchema,
  upsertRatingBodySchema,
} from '../schemas/rating.js';

export const songsRouter = Router();

/**
 * Upsert rating for a song.
 * Body `{ value }` must be 1–5 (decimals allowed). Out-of-range → 400.
 * Full auth + DB upsert lands in TODO 1.5.x; validation is enforced now.
 */
songsRouter.post(
  '/:id/ratings',
  validateRequest(songIdParamsSchema, 'params'),
  validateRequest(upsertRatingBodySchema, 'body'),
  (_req, res) => {
    res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required to rate a song',
      },
    });
  },
);
