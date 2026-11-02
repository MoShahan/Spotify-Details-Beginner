import { Router } from 'express';

import { normalizeArtistIds } from '../lib/artist-ids.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  songIdParamsSchema,
  upsertRatingBodySchema,
} from '../schemas/rating.js';
import { createSongBodySchema } from '../schemas/song.js';
import {
  findMissingArtistIds,
  findSongByNameAndArtistSet,
} from '../services/catalog-uniqueness.js';
import { listSongs } from '../services/songs.js';

export const songsRouter = Router();

/**
 * List all songs (auth). Includes artists + average rating.
 */
songsRouter.get('/', requireAuth, async (_req, res, next) => {
  try {
    const songs = await listSongs();
    res.status(200).json({ songs });
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * Create song + artist links.
 * Requires at least one artist. Same title is allowed only when the artist set differs
 * (sorted id compare). Duplicate title + same artists → 409.
 * Full auth + insert lands in TODO 1.4.x; conflict / artist checks are enforced now.
 */
songsRouter.post(
  '/',
  validateRequest(createSongBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = createSongBodySchema.parse(req.body);
      const artistIds = normalizeArtistIds(body.artistIds);

      const missing = await findMissingArtistIds(artistIds);
      if (missing.length > 0) {
        res.status(400).json({
          error: {
            code: 'ARTIST_NOT_FOUND',
            message: 'One or more artist ids do not exist',
            details: { missingArtistIds: missing },
          },
        });
        return;
      }

      const duplicate = await findSongByNameAndArtistSet(body.name, artistIds);
      if (duplicate) {
        res.status(409).json({
          error: {
            code: 'SONG_DUPLICATE',
            message:
              'A song with this name and the same artist(s) already exists',
          },
        });
        return;
      }

      res.status(401).json({
        error: {
          code: 'AUTH_REQUIRED',
          message: 'Authentication required to create a song',
        },
      });
    } catch (error: unknown) {
      next(error);
    }
  },
);

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
