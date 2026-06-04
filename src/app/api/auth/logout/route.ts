import { clearSessionCookie } from '@/lib/auth/session';

// ─── POST /api/auth/logout ─────────────────────────────────────────────────
// Clears the session cookie. Simple and stateless.

export async function POST() {
  await clearSessionCookie();
  return Response.json({ message: 'Logged out successfully.' }, { status: 200 });
}
