import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity';

const addMemberSchema = z.object({
  userId: z.string().uuid({ error: 'Invalid user ID.' }),
});

type Params = { params: Promise<{ id: string }> };

// ─── Helper: check if caller is a member of the project ────────────────────
async function assertMembership(projectId: string, userId: string) {
  const db = getSupabase();
  const { data } = await db
    .from('project_members')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('user_id', userId)
    .single();
  return !!data;
}

// ─── POST /api/projects/:id/members ────────────────────────────────────────
// Adds a user to the project. Only Admins may invite.

export async function POST(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id: projectId } = await params;

  const db = getSupabase();

  // Role check: only Project Owner may add members
  const { data: project } = await db.from('projects').select('owner_id').eq('id', projectId).single();
  if (!project || project.owner_id !== session.userId) {
    return Response.json({ error: 'Forbidden. Project owner required to invite members.' }, { status: 403 });
  }

  const isMember = await assertMembership(projectId, session.userId);
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = addMemberSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  // Verify the target user exists
  const { data: targetUser } = await db
    .from('users')
    .select('id, username')
    .eq('id', parsed.data.userId)
    .single();

  if (!targetUser) {
    return Response.json({ error: 'User not found.' }, { status: 404 });
  }

  // Check if already a member
  const { data: existing } = await db
    .from('project_members')
    .select('user_id')
    .eq('project_id', projectId)
    .eq('user_id', parsed.data.userId)
    .single();

  if (existing) {
    return Response.json({ error: 'User is already a member of this project.' }, { status: 409 });
  }

  const { error } = await db.from('project_members').insert({
    project_id: projectId,
    user_id: parsed.data.userId,
  });

  if (error) {
    return Response.json({ error: 'Failed to add member.' }, { status: 500 });
  }

  await logActivity({
    userId: session.userId,
    action: 'MEMBER_ADDED',
    projectId,
    metadata: { addedUserId: parsed.data.userId, addedUsername: targetUser.username },
  });

  return Response.json({ message: `${targetUser.username} added to project.` }, { status: 201 });
}

// ─── GET /api/projects/:id/members ─────────────────────────────────────────
// Lists all members of a project.

export async function GET(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id: projectId } = await params;

  const isMember = await assertMembership(projectId, session.userId);
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const db = getSupabase();
  const { data: members, error } = await db
    .from('project_members')
    .select('joined_at, users(id, username, email, role_id)')
    .eq('project_id', projectId);

  if (error) {
    return Response.json({ error: 'Failed to fetch members.' }, { status: 500 });
  }

  return Response.json({ members: members ?? [] }, { status: 200 });
}
