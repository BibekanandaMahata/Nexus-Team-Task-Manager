import { NextRequest } from 'next/server';
import { z } from 'zod';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity';

const updateSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().max(2000).optional(),
  status: z.enum(['To Do', 'In Progress', 'Done']).optional(),
  assignedTo: z.string().uuid().nullable().optional(),
});

type Params = { params: Promise<{ id: string }> };

// ─── Helper: fetch task and verify caller is a member of its project ────────
async function getTaskAndVerifyMembership(taskId: string, userId: string) {
  const db = getSupabase();

  const { data: task } = await db
    .from('tasks')
    .select('id, project_id, title, status, assigned_to')
    .eq('id', taskId)
    .single();

  if (!task) return { task: null, isMember: false };

  const { data: membership } = await db
    .from('project_members')
    .select('project_id')
    .eq('project_id', task.project_id)
    .eq('user_id', userId)
    .single();

  return { task, isMember: !!membership };
}

// ─── PATCH /api/tasks/:id ──────────────────────────────────────────────────
// Powerhouse update endpoint: status, assignee, title, description.
// Triggers activity log on every call.

export async function PATCH(request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  const { id: taskId } = await params;

  const { task, isMember } = await getTaskAndVerifyMembership(taskId, session.userId);
  if (!task) return Response.json({ error: 'Task not found.' }, { status: 404 });
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const body = await request.json().catch(() => null);
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return Response.json(
      { error: parsed.error.issues[0]?.message ?? 'Invalid request.' },
      { status: 400 }
    );
  }

  const { title, description, status, assignedTo } = parsed.data;

  if (!title && description === undefined && !status && assignedTo === undefined) {
    return Response.json({ error: 'Nothing to update.' }, { status: 400 });
  }

  const db = getSupabase();

  const updatePayload: Record<string, unknown> = {};
  if (title) updatePayload.title = title;
  if (description !== undefined) updatePayload.description = description;
  if (status) updatePayload.status = status;
  if (assignedTo !== undefined) updatePayload.assigned_to = assignedTo;

  const { data: updatedTask, error } = await db
    .from('tasks')
    .update(updatePayload)
    .eq('id', taskId)
    .select()
    .single();

  if (error) {
    return Response.json({ error: 'Failed to update task.' }, { status: 500 });
  }

  // Build a human-readable activity description
  const changes: string[] = [];
  if (status && status !== task.status) changes.push(`status: "${task.status}" → "${status}"`);
  if (assignedTo !== undefined) changes.push('assignee changed');
  if (title) changes.push('title updated');

  await logActivity({
    userId: session.userId,
    action: 'TASK_UPDATED',
    projectId: task.project_id,
    taskId,
    metadata: { changes, taskTitle: updatedTask.title },
  });

  return Response.json({ task: updatedTask }, { status: 200 });
}

// ─── DELETE /api/tasks/:id ─────────────────────────────────────────────────
// Admin only. Permanently deletes a task.

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  if (session.roleId !== 1) {
    return Response.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });
  }

  const { id: taskId } = await params;

  const { task, isMember } = await getTaskAndVerifyMembership(taskId, session.userId);
  if (!task) return Response.json({ error: 'Task not found.' }, { status: 404 });
  if (!isMember) return Response.json({ error: 'Forbidden.' }, { status: 403 });

  const db = getSupabase();

  await logActivity({
    userId: session.userId,
    action: 'TASK_DELETED',
    projectId: task.project_id,
    taskId,
    metadata: { taskTitle: task.title },
  });

  const { error } = await db.from('tasks').delete().eq('id', taskId);
  if (error) {
    return Response.json({ error: 'Failed to delete task.' }, { status: 500 });
  }

  return Response.json({ message: 'Task deleted.' }, { status: 200 });
}
