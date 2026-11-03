import { Router } from 'express';

import { normalizeArtistIds } from '../lib/artist-ids.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { type IdParams, idParamsSchema } from '../schemas/ids.js';
import {
  type ListSongsQuery,
  listSongsQuerySchema,
} from '../schemas/list-query.js';
import {
  type UpsertRatingBody,
  upsertRatingBodySchema,
} from '../schemas/rating.js';
import {
  type CreateSongBody,
  createSongBodySchema,
  type UpdateSongCoverBody,
  updateSongCoverBodySchema,
} from '../schemas/song.js';
import {
  findMissingArtistIds,
  findSongByNameAndArtistSet,
} from '../services/catalog-uniqueness.js';
import {
  createSong,
  getSongById,
  listSongs,
  listTopSongs,
  updateSongCoverUrl,
  upsertSongRating,
} from '../services/songs.js';

export const songsRouter = Router();

/**
 * Top 10 songs by average rating (auth).
 */
songsRouter.get('/top', requireAuth, async (_req, res, next) => {
  try {
    const songs = await listTopSongs(10);
    res.status(200).json({ songs });
  } catch (error: unknown) {
    next(error);
  }
});

/**
 * List songs (auth). Includes artists + average rating.
 * Query: `q`, `sortBy`, `sortOrder`, `limit` (default 20), `offset` (default 0).
 */
songsRouter.get(
  '/',
  requireAuth,
  validateRequest(listSongsQuerySchema, 'query'),
  async (req, res, next) => {
    try {
      const query = req.query as unknown as ListSongsQuery;
      const page = await listSongs(query);
      res.status(200).json(page);
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Create song + artist links (auth).
 * Requires at least one artist. Same title OK when the artist set differs.
 * Duplicate title + same artists → 409.
 */
songsRouter.post(
  '/',
  requireAuth,
  validateRequest(createSongBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body as CreateSongBody;
      const artistIds = normalizeArtistIds(body.artistIds);
      const userId = req.auth!.userId;

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

      const song = await createSong({
        ...body,
        artistIds,
        createdByUserId: userId,
      });
      res.status(201).json({ song });
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Song detail (auth).
 */
songsRouter.get(
  '/:id',
  requireAuth,
  validateRequest(idParamsSchema, 'params'),
  async (req, res, next) => {
    try {
      const { id } = req.params as IdParams;
      const song = await getSongById(id, req.auth!.userId);
      if (!song) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Song not found' },
        });
        return;
      }
      res.status(200).json({ song });
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Update song cover URL (auth). Empty string clears.
 */
songsRouter.patch(
  '/:id/cover',
  requireAuth,
  validateRequest(idParamsSchema, 'params'),
  validateRequest(updateSongCoverBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id } = req.params as IdParams;
      const body = req.body as UpdateSongCoverBody;
      const song = await updateSongCoverUrl(
        id,
        body.coverUrl,
        req.auth!.userId,
      );
      if (!song) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Song not found' },
        });
        return;
      }
      res.status(200).json({ song });
    } catch (error: unknown) {
      next(error);
    }
  },
);

/**
 * Upsert rating for a song (auth). Value 1–5, decimals OK.
 */
songsRouter.post(
  '/:id/ratings',
  requireAuth,
  validateRequest(idParamsSchema, 'params'),
  validateRequest(upsertRatingBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const { id: songId } = req.params as IdParams;
      const body = req.body as UpsertRatingBody;
      const userId = req.auth!.userId;

      const rating = await upsertSongRating(userId, songId, body.value);
      if (!rating) {
        res.status(404).json({
          error: { code: 'NOT_FOUND', message: 'Song not found' },
        });
        return;
      }

      res.status(200).json({ rating });
    } catch (error: unknown) {
      next(error);
    }
  },
);
