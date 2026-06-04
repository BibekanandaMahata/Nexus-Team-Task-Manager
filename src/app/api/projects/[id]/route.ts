import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity';

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
});

type Params = { params: Promise<{ id: string }> };

// ─── Helper: verify user is a member of the project ────────────────────────
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

// ─── PATCH /api/projects/:id ───────────────────────────────────────────────
// Updates project name/description. Any member can do this.

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  const isMember = await assertMembership(id, session.userId);
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  if (!parsed.data.name && parsed.data.description === undefined) {
    return Response.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const db = getSupabase();
  const { data: project, error } = await db
    .from('projects')
    .update(parsed.data)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    return Response.json({ error: 'Failed to update project.' }, { status: 500 });
  }

  return Response.json({ project }, { status: 200 });
}

// ─── GET /api/projects/:id ─────────────────────────────────────────────────
// Fetch project details.

export async function GET(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  const isMember = await assertMembership(id, session.userId);
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const db = getSupabase();
  const { data: project, error } = await db
    .from('projects')
    .select('id, name, description, owner_id, created_at')
    .eq('id', id)
    .single();

  if (error || !project) {
    return Response.json({ error: 'Failed to fetch project.' }, { status: 404 });
  }

  return Response.json({ project }, { status: 200 });
}

// ─── DELETE /api/projects/:id ──────────────────────────────────────────────
// Project owner only. Permanently deletes project (cascades tasks + members via FK).

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id } = await params;

  const isMember = await assertMembership(id, session.userId);
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const db = getSupabase();

  // Role check: only Project Owner may delete projects
  const { data: project } = await db.from('projects').select('owner_id').eq('id', id).single();
  if (!project || project.owner_id !== session.userId) {
    return Response.json({ error: 'Forbidden. Project owner required.' }, { status: 403 });
  }

  // Log before deleting (so projectId still exists in logs)
  await logActivity({
    userId: session.userId,
    action: 'PROJECT_DELETED',
    projectId: id,
  });

  const { error } = await db.from('projects').delete().eq('id', id);

  if (error) {
    return Response.json({ error: 'Failed to delete project.' }, { status: 500 });
  }

  return Response.json({ message: 'Project deleted.' }, { status: 200 });
}
