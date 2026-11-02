import bcrypt from 'bcrypt';

import { signAccessToken } from '../lib/jwt.js';
import { prisma } from '../lib/prisma.js';
import type { LoginBody, RegisterBody } from '../schemas/auth.js';

const BCRYPT_ROUNDS = 10;

export type PublicUser = {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
};

export type AuthResult = {
  token: string;
  user: PublicUser;
};

function toPublicUser(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}): PublicUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt,
  };
}

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export async function registerUser(
  input: RegisterBody,
): Promise<
  | { ok: true; data: AuthResult }
  | { ok: false; code: 'EMAIL_TAKEN'; message: string }
> {
  const email = normalizeEmail(input.email);
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return {
      ok: false,
      code: 'EMAIL_TAKEN',
      message: 'An account with this email already exists',
    };
  }

  const passwordHash = await bcrypt.hash(input.password, BCRYPT_ROUNDS);
  const user = await prisma.user.create({
    data: {
      name: input.name.trim(),
      email,
      passwordHash,
    },
  });

  const token = signAccessToken({ sub: user.id, email: user.email });
  return { ok: true, data: { token, user: toPublicUser(user) } };
}

export async function loginUser(
  input: LoginBody,
): Promise<
  | { ok: true; data: AuthResult }
  | { ok: false; code: 'INVALID_CREDENTIALS'; message: string }
> {
  const email = normalizeEmail(input.email);
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return {
      ok: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    };
  }

  const matches = await bcrypt.compare(input.password, user.passwordHash);
  if (!matches) {
    return {
      ok: false,
      code: 'INVALID_CREDENTIALS',
      message: 'Invalid email or password',
    };
  }

  const token = signAccessToken({ sub: user.id, email: user.email });
  return { ok: true, data: { token, user: toPublicUser(user) } };
}

export async function getUserById(userId: string): Promise<PublicUser | null> {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });
  return user;
}
