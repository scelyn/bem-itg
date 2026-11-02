import jwt, { SignOptions } from 'jsonwebtoken';
import { env } from '../config/env';
import { AuthUserPayload } from '../types/auth';

/**
 * Signs a JWT token containing user identity and role.
 */
export function signToken(payload: AuthUserPayload): string {
  const options: SignOptions = {
    expiresIn: env.JWT_EXPIRES_IN as unknown as number, // jsonwebtoken accepts string like "8h"
  };
  return jwt.sign(payload, env.JWT_SECRET, options);
}

/**
 * Verifies a JWT token and returns the typed payload.
 */
export function verifyToken(token: string): AuthUserPayload {
  return jwt.verify(token, env.JWT_SECRET) as AuthUserPayload;
}

