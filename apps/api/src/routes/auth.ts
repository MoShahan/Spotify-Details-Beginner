import { Router } from 'express';

import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validate.js';
import {
  type LoginBody,
  loginBodySchema,
  type RegisterBody,
  registerBodySchema,
} from '../schemas/auth.js';
import { getUserById, loginUser, registerUser } from '../services/auth.js';

export const authRouter = Router();

authRouter.post(
  '/register',
  validateRequest(registerBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body as RegisterBody;
      const result = await registerUser(body);

      if (!result.ok) {
        res.status(409).json({
          error: { code: result.code, message: result.message },
        });
        return;
      }

      res.status(201).json(result.data);
    } catch (error: unknown) {
      next(error);
    }
  },
);

authRouter.post(
  '/login',
  validateRequest(loginBodySchema, 'body'),
  async (req, res, next) => {
    try {
      const body = req.body as LoginBody;
      const result = await loginUser(body);

      if (!result.ok) {
        res.status(401).json({
          error: { code: result.code, message: result.message },
        });
        return;
      }

      res.status(200).json(result.data);
    } catch (error: unknown) {
      next(error);
    }
  },
);

authRouter.get('/me', requireAuth, async (req, res, next) => {
  try {
    const user = await getUserById(req.auth!.userId);
    if (!user) {
      res.status(401).json({
        error: {
          code: 'INVALID_TOKEN',
          message: 'User no longer exists',
        },
      });
      return;
    }

    res.status(200).json({ user });
  } catch (error: unknown) {
    next(error);
  }
});
