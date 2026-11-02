/** Read required env vars with clear errors (no secrets logged). */

export function getJwtSecret(): string {
  const secret = process.env.JWT_SECRET?.trim();
  if (!secret) {
    throw new Error('JWT_SECRET is required');
  }
  if (secret.length < 16) {
    throw new Error('JWT_SECRET must be at least 16 characters');
  }
  return secret;
}

export function getJwtExpiresIn(): string {
  return process.env.JWT_EXPIRES_IN?.trim() || '7d';
}
