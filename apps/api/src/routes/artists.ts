import { Router } from 'express';

import { validateRequest } from '../middleware/validate.js';
import { createArtistBodySchema } from '../schemas/artist.js';
import { findArtistByName } from '../services/catalog-uniqueness.js';

export const artistsRouter = Router();

/**
 * Create artist.
 * Current rule (API, not DB unique): reject duplicate names with 409.
 * Rules stay in the service layer so they can change later (name + DOB + nationality, etc.).
 * Full auth + insert lands in TODO 1.3.x; conflict check is enforced now.
 */
artistsRouter.post(
  '/',
  validateRequest(createArtistBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const { name } = createArtistBodySchema.parse(req.body);
      const existing = await findArtistByName(name);

      if (existing) {
        res.status(409).json({
          error: {
            code: 'ARTIST_NAME_TAKEN',
            message: 'An artist with this name already exists',
          },
        });
        return;
      }

      res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required to create an artist',
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  },
);
