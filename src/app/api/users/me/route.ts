import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';

// ─── GET /api/users/me ─────────────────────────────────────────────────────
// Returns the authenticated user's profile.

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const db = getSupabase();
  const { data: user, error } = await db
    .from('users')
    .select('id, username, email, role_id, created_at, roles(name)')
    .eq('id', session.userId)
    .single();

  if (error || !user) {
    return Response.json({ error: 'User not found.' }, { status: 404 });
  }

  return Response.json({ user }, { status: 200 });
}
