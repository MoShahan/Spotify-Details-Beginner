import { Router } from 'express';

import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  createArtistBodySchema,
  updateArtistImageBodySchema,
} from '../schemas/artist.js';
import { idParamsSchema } from '../schemas/ids.js';
import { listArtistsQuerySchema } from '../schemas/list-query.js';
import {
  getArtistById,
  listArtists,
  listTopArtists,
  updateArtistImageUrl,
} from '../services/artists.js';
import { findArtistByName } from '../services/catalog-uniqueness.js';

export const artistsRouter = Router();

/**
 * Top 10 artists by avg of all ratings on their songs (auth).
 */
artistsRouter.get('/top', requireAuth, async (_req, res, next) => {
  try {
    const artists = await listTopArtists(10);
    res.status(200).json({ artists });
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * List artists (auth). Includes averages.
 * Query: `q`, `sortBy` (name|rating|dob), `sortOrder` (asc|desc).
 */
artistsRouter.get(
  '/',
  requireAuth,
  validateRequest(listArtistsQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const query = listArtistsQuerySchema.parse(req.query);
      const artists = await listArtists(query);
      res.status(200).json({ artists });
    } catch (error: unknown) {
      next(error);
    }
  },
);

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

/**
 * Artist detail (auth).
 */
artistsRouter.get(
  '/:id',
  requireAuth,
  validateRequest(idParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const artist = await getArtistById(id);
      if (!artist) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Artist not found' },
        });
        return;
      }
      res.status(200).json({ artist });
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Update artist image URL (auth). Empty string clears. ImageKit can replace this later.
 */
artistsRouter.patch(
  '/:id/image',
  requireAuth,
  validateRequest(idParamsSchema, 'params'),
  validateRequest(updateArtistImageBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = idParamsSchema.parse(req.params);
      const body = updateArtistImageBodySchema.parse(req.body);
      const artist = await updateArtistImageUrl(id, body.imageUrl);
      if (!artist) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Artist not found' },
        });
        return;
      }
      res.status(200).json({ artist });
    } catch (error: unknown) {
      next(error);
    }
  },
);
