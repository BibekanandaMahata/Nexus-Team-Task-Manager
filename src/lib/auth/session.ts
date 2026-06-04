import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/lib/types';

const COOKIE_NAME = 'nexus_session';
const JWT_SECRET = process.env.JWT_SECRET!;
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

// ─── Sign a JWT and return it as a string ──────────────────────────────────

export function signSession(payload: SessionPayload): string {
  if (!JWT_SECRET) throw new Error('JWT_SECRET env var is not set.');
  return jwt.sign(payload, JWT_SECRET, { expiresIn: SESSION_MAX_AGE });
}

// ─── Verify & decode a JWT string ──────────────────────────────────────────

export function verifySession(token: string): SessionPayload | null {
  try {
    if (!JWT_SECRET) throw new Error('JWT_SECRET env var is not set.');
    return jwt.verify(token, JWT_SECRET) as SessionPayload;
  } catch {
    return null;
  }
}

// ─── Set the session cookie on the response (call from Route Handlers) ─────

export async function setSessionCookie(payload: SessionPayload): Promise<void> {
  const token = signSession(payload);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE,
  });
}

// ─── Clear the session cookie ───────────────────────────────────────────────

export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

// ─── Read the current session from the cookie store ────────────────────────

export async function getSession(): Promise<SessionPayload | null> {
  const cookieStore = await cookies();
  const cookie = cookieStore.get(COOKIE_NAME);
  if (!cookie?.value) return null;
  return verifySession(cookie.value);
}

// ─── Read session from a raw Request (used in middleware) ──────────────────

export function getSessionFromRequest(request: any): SessionPayload | null {
  try {
    if (request.cookies && typeof request.cookies.get === 'function') {
      const cookie = request.cookies.get(COOKIE_NAME);
      if (cookie?.value) {
        return verifySession(cookie.value);
      }
    }
    const cookieHeader = request.headers?.get?.('cookie') ?? '';
    const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${COOKIE_NAME}=([^;]+)`));
    if (!match) return null;
    return verifySession(decodeURIComponent(match[1]));
  } catch {
    return null;
  }
}
