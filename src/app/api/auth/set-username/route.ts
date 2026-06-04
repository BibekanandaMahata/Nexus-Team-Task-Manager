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
  first_name: z.string().min(1, { message: 'First name is required.' }),
  last_name: z.string().nullable().optional(),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  // Check if they actually have an incomplete profile
  if (!session.username.startsWith('nexus_user_') && session.first_name) {
    return Response.json({ error: 'Profile is already complete.' }, { status: 400 });
  }

  const body = await request.json().catch(() => null);
  const parsed = schema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const { username, first_name, last_name } = parsed.data;
  const db = getSupabase();

  // 1. Check uniqueness of the new username
  const { data: existingUser } = await db
    .from('users')
    .select('id')
    .eq('username', username.trim())
    .single();

  if (existingUser && existingUser.id !== session.userId) {
    return Response.json(
      { error: 'That username is already taken. Please choose another.' },
      { status: 409 }
    );
  }

  // 2. Update profile in the DB
  const { data: updatedUser, error: updateError } = await db
    .from('users')
    .update({ 
      username: username.trim(),
      first_name: first_name.trim(),
      last_name: last_name?.trim() || null
    })
    .eq('id', session.userId)
    .select('id, username, email, role_id, first_name, last_name')
    .single();

  if (updateError || !updatedUser) {
    console.error('[set-username] Update error:', updateError);
    return Response.json({ error: 'Failed to update username.' }, { status: 500 });
  }

  await setSessionCookie({
    userId: updatedUser.id,
    email: updatedUser.email,
    username: updatedUser.username,
    first_name: updatedUser.first_name,
    last_name: updatedUser.last_name,
    roleId: updatedUser.role_id,
  });

  return Response.json(
    { message: 'Username set successfully.', user: updatedUser },
    { status: 200 }
  );
}
