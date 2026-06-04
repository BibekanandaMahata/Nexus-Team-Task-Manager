import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase/server';
import { setSessionCookie } from '@/lib/auth/session';

const schema = z.object({
  email: z.email({ error: 'Invalid email address.' }),
  code: z.string().length(6, { error: 'OTP must be exactly 6 digits.' }),
  username: z.string().min(2).max(32).optional(), // required only for first-time users
});

// ─── POST /api/auth/verify-otp ─────────────────────────────────────────────
// Validates OTP → creates user if first login → issues session cookie.

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const { email, code, username } = parsed.data;
  const db = getSupabase();

  // ── 1. Find the most recent unused, non-expired OTP ─────────────────────
  const { data: otpRow, error: otpError } = await db
    .from('otps')
    .select('*')
    .eq('email', email)
    .eq('code', code)
    .eq('used', false)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (otpError || !otpRow) {
    return Response.json(
      { error: 'Invalid or expired OTP. Please request a new code.' },
      { status: 401 }
    );
  }

  // ── 2. Mark OTP as used ──────────────────────────────────────────────────
  await db.from('otps').update({ used: true }).eq('id', otpRow.id);

  // ── 3. Find or create the user ───────────────────────────────────────────
  let { data: user } = await db
    .from('users')
    .select('id, username, email, role_id, first_name, last_name')
    .eq('email', email)
    .single();

  if (!user) {
    let finalUsername = `nexus_user_${Math.random().toString(36).substring(2, 10)}`;
    let newUser = null;
    let createError = null;
    let retries = 3;

    while (retries > 0) {
      const { data, error } = await db
        .from('users')
        .insert({ email, username: finalUsername })
        .select('id, username, email, role_id, first_name, last_name')
        .single();

      if (!error && data) {
        newUser = data;
        break;
      }
      createError = error;
      finalUsername = `nexus_user_${Math.random().toString(36).substring(2, 10)}`;
      retries--;
    }

    if (createError || !newUser) {
      console.error('[verify-otp] User creation error:', createError);
      return Response.json({ error: 'Failed to create user account.' }, { status: 500 });
    }

    user = newUser;
  }

  // ── 4. Issue session cookie ──────────────────────────────────────────────
  await setSessionCookie({
    userId: user.id,
    email: user.email,
    username: user.username,
    first_name: user.first_name,
    last_name: user.last_name,
    roleId: user.role_id,
  });

  return Response.json(
    { message: 'Login successful.', user: { id: user.id, username: user.username, email: user.email, roleId: user.role_id } },
    { status: 200 }
  );
}
