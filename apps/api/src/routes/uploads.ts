import { Router } from 'express';

import { createImageKitAuth } from '../lib/imagekit.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import { imageKitAuthBodySchema } from '../schemas/uploads.js';

export const uploadsRouter = Router();

/**
 * Signed ImageKit upload params (auth required).
 * Private key stays on the API; client uploads directly to ImageKit.
 */
uploadsRouter.post(
  '/imagekit-auth',
  requireAuth,
  validateRequest(imageKitAuthBodySchema, 'body'),
  (req, res, next) => {
    try {
      const body = imageKitAuthBodySchema.parse(req.body);
      const auth = createImageKitAuth(body.folder);
      res.status(200).json(auth);
    } catch (error: unknown) {
      next(error);
    }
  },
);
