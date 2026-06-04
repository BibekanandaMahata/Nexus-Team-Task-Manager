import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity';

const createSchema = z.object({
  projectId: z.string().uuid({ error: 'Valid project ID is required.' }),
  title: z.string().min(1, { error: 'Task title is required.' }).max(200),
  description: z.string().max(2000).optional(),
  assignedTo: z.string().uuid().optional(),
});

// ─── Helper: check user is a member of the given project ───────────────────
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

// ─── GET /api/tasks?projectId=:id ─────────────────────────────────────────
// Returns all tasks for a project, used to populate Kanban columns.

export async function GET(request: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const projectId = request.nextUrl.searchParams.get('projectId');

  if (!projectId) {
    return Response.json({ error: 'projectId query param is required.' }, { status: 400 });
  }

  const isMember = await assertMembership(projectId, session.userId);
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const db = getSupabase();
  const { data: tasks, error } = await db
    .from('tasks')
    .select(
      `
      id, title, description, status, created_at, updated_at,
      assigned_to,
      assignee:users!tasks_assigned_to_fkey (id, username),
      creator:users!tasks_created_by_fkey (id, username)
      `
    )
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });

  if (error) {
    console.error('[GET /api/tasks]', error);
    return Response.json({ error: 'Failed to fetch tasks.' }, { status: 500 });
  }

  return Response.json({ tasks: tasks ?? [] }, { status: 200 });
}

// ─── POST /api/tasks ───────────────────────────────────────────────────────
// Creates a new task under a project. Any project member may create tasks.

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const { projectId, title, description, assignedTo } = parsed.data;

  const isMember = await assertMembership(projectId, session.userId);
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const db = getSupabase();
  const { data: task, error } = await db
    .from('tasks')
    .insert({
      project_id: projectId,
      title,
      description: description ?? null,
      assigned_to: assignedTo ?? null,
      created_by: session.userId,
      status: 'To Do',
    })
    .select()
    .single();

  if (error || !task) {
    console.error('[POST /api/tasks]', error);
    return Response.json({ error: 'Failed to create task.' }, { status: 500 });
  }

  await logActivity({
    userId: session.userId,
    action: 'TASK_CREATED',
    projectId,
    taskId: task.id,
    metadata: { title },
  });

  return Response.json({ task }, { status: 201 });
}
