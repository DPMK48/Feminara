import jwt from 'jsonwebtoken';
import { NextRequest } from 'next/server';

const SECRET = process.env.JWT_SECRET ?? 'feminara-dev-secret';

export function signToken(payload: object): string {
  return jwt.sign(payload, SECRET, { expiresIn: '30d' });
}

export function verifyToken(token: string): { userId: string } | null {
  try {
    return jwt.verify(token, SECRET) as { userId: string };
  } catch {
    return null;
  }
}

export function getUserId(req: NextRequest): string | null {
  const header = req.headers.get('authorization');
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  return verifyToken(token)?.userId ?? null;
}
