import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity';

const createSchema = z.object({
  name: z.string().min(1, { error: 'Project name is required.' }).max(100),
  description: z.string().max(500).optional(),
});

// ─── GET /api/projects ─────────────────────────────────────────────────────
// Returns all projects the authenticated user is a member of.

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const db = getSupabase();

  const { data: projects, error } = await db
    .from('project_members')
    .select(
      `
      projects (
        id,
        name,
        description,
        owner_id,
        created_at,
        users!projects_owner_id_fkey (username)
      )
      `
    )
    .eq('user_id', session.userId);

  if (error) {
    console.error('[GET /api/projects]', error);
    return Response.json({ error: 'Failed to fetch projects.' }, { status: 500 });
  }

  // Flatten the join result
  const flat = (projects ?? []).map((row: { projects: unknown }) => row.projects).filter(Boolean);

  return Response.json({ projects: flat }, { status: 200 });
}

// ─── POST /api/projects ────────────────────────────────────────────────────
// Creates a new project and auto-assigns the creator as owner and member.

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const db = getSupabase();

  // Create the project
  const { data: project, error: projectError } = await db
    .from('projects')
    .insert({
      name: parsed.data.name,
      description: parsed.data.description ?? null,
      owner_id: session.userId,
    })
    .select()
    .single();

  if (projectError || !project) {
    console.error('[POST /api/projects]', projectError);
    return Response.json({ error: 'Failed to create project.' }, { status: 500 });
  }

  // Auto-add creator as a member
  await db.from('project_members').insert({
    project_id: project.id,
    user_id: session.userId,
  });

  // Log the activity
  await logActivity({
    userId: session.userId,
    action: 'PROJECT_CREATED',
    projectId: project.id,
    metadata: { name: project.name },
  });

  return Response.json({ project }, { status: 201 });
}
