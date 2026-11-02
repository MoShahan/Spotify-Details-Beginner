import type { NextFunction, Request, Response } from 'express';

import { verifyAccessToken } from '../lib/jwt.js';

function readBearerToken(header: string | undefined): string | null {
  if (!header) {
    return null;
  }
  const [scheme, token] = header.split(' ');
  if (scheme?.toLowerCase() !== 'bearer' || !token) {
    return null;
  }
  return token;
}

/**
 * Require `Authorization: Bearer <jwt>`.
 * Sets `req.auth = { userId, email }` on success.
 */
export function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = readBearerToken(req.header('authorization'));

  if (!token) {
    res.status(401).json({
      error: {
        code: 'AUTH_REQUIRED',
        message: 'Authentication required',
      },
    });
    return;
  }

  try {
    const payload = verifyAccessToken(token);
    req.auth = { userId: payload.sub, email: payload.email };
    next();
  } catch {
    res.status(401).json({
      error: {
        code: 'INVALID_TOKEN',
        message: 'Invalid or expired token',
      },
    });
  }
}
