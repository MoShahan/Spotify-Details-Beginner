import jwt from 'jsonwebtoken';

import { getJwtExpiresIn, getJwtSecret } from './env.js';

export type AccessTokenPayload = {
  sub: string;
  email: string;
};

function isAccessTokenPayload(value: unknown): value is AccessTokenPayload {
  if (typeof value !== 'object' || value === null) {
    return false;
  }
  const record = value as Record<string, unknown>;
  return typeof record.sub === 'string' && typeof record.email === 'string';
}

export function signAccessToken(payload: AccessTokenPayload): string {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn: getJwtExpiresIn(),
  } as jwt.SignOptions);
}

export function verifyAccessToken(token: string): AccessTokenPayload {
  const decoded: unknown = jwt.verify(token, getJwtSecret());
  if (!isAccessTokenPayload(decoded)) {
    throw new Error('Invalid token payload');
  }
  return { sub: decoded.sub, email: decoded.email };
}
