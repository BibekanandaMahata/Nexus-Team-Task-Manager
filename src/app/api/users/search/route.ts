import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';

// ─── GET /api/users/search?q=username ─────────────────────────────────────
// Searches users by username (case-insensitive, partial match).
// Used by Admins when inviting members to a project.

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const q = request.nextUrl.searchParams.get('q')?.trim();
  const db = getSupabase();

  let query = db.from('users').select('id, username');

  if (q && q.length >= 2) {
    query = query.ilike('username', `%${q}%`);
  }

  const { data: users, error } = await query.limit(50);

  if (error) {
    return Response.json({ error: 'Search failed.' }, { status: 500 });
  }

  return Response.json({ users: users ?? [] }, { status: 200 });
}
