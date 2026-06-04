import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSupabase } from '@/lib/supabase/server';
import { getSession, setSessionCookie } from '@/lib/auth/session';

const schema = z.object({
  username: z
    .string()
    .min(2, { message: 'Username must be at least 2 characters.' })
    .max(32, { message: 'Username must be at most 32 characters.' })
    .regex(/^[a-zA-Z0-9_-]+$/, { message: 'Username can only contain letters, numbers, underscores, and hyphens.' }),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  // Check if they actually have a temporary username
  if (!session.username.startsWith('nexus_user_')) {
    return Response.json({ error: 'Username has already been set.' }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const { username } = parsed.data;
  const db = getSupabase();

  // 1. Check uniqueness of the new username
  const { data: existingUser } = await db
    .from('users')
    .select('id')
    .eq('username', username.trim())
    .single();

  if (existingUser) {
    return Response.json(
      { error: 'That username is already taken. Please choose another.' },
      { status: 409 }
    );
  }

  // 2. Update username in the DB
  const { data: updatedUser, error: updateError } = await db
    .from('users')
    .update({ username: username.trim() })
    .eq('id', session.userId)
    .select('id, username, email, role_id')
    .single();

  if (updateError || !updatedUser) {
    console.error('[set-username] Update error:', updateError);
    return Response.json({ error: 'Failed to update username.' }, { status: 500 });
  }

  // 3. Issue updated session cookie
  await setSessionCookie({
    userId: updatedUser.id,
    email: updatedUser.email,
    username: updatedUser.username,
    roleId: updatedUser.role_id,
  });

  return Response.json(
    { message: 'Username set successfully.', user: updatedUser },
    { status: 200 }
  );
}
