import type { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'change-me-in-.env';

export interface AuthedRequest extends Request {
  userId?: number;
}

export function signToken(userId: number): string {
  return jwt.sign({ sub: userId }, JWT_SECRET, { expiresIn: '7d' });
}

function readUserId(req: Request): number | undefined {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return undefined;
  try {
    const payload = jwt.verify(token, JWT_SECRET) as unknown as { sub: number };
    return Number(payload.sub);
  } catch {
    return undefined;
  }
}

/** Rejects the request with 401 unless a valid token is present. */
export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const id = readUserId(req);
  if (!id) return res.status(401).json({ error: 'Please log in to continue.' });
  req.userId = id;
  next();
}

/** Attaches userId when a token is present, but never blocks (public pages). */
export function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  req.userId = readUserId(req);
  next();
}
