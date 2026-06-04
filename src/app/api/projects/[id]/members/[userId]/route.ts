import { NextRequest } from 'next/server';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { logActivity } from '@/lib/activity';

type Params = { params: Promise<{ id: string; userId: string }> };

// ─── DELETE /api/projects/:id/members/:userId ──────────────────────────────
// Admin only. Removes a user from the project.
// Note: The owner cannot be removed from their own project.

export async function DELETE(_request: NextRequest, { params }: Params) {
  const session = await getSession();
  if (!session) return Response.json({ error: 'Unauthorized.' }, { status: 401 });

  if (session.roleId !== 1) {
    return Response.json({ error: 'Forbidden. Admin role required.' }, { status: 403 });
  }

  const { id: projectId, userId: targetUserId } = await params;
  const db = getSupabase();

  // Check caller is a member of the project
  const { data: callerMembership } = await db
    .from('project_members')
    .select('project_id')
    .eq('project_id', projectId)
    .eq('user_id', session.userId)
    .single();

  if (!callerMembership) {
    return Response.json({ error: 'Forbidden.' }, { status: 403 });
  }

  // Prevent removing the project owner
  const { data: project } = await db
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single();

  if (project?.owner_id === targetUserId) {
    return Response.json(
      { error: 'Cannot remove the project owner.' },
      { status: 400 }
    );
  }

  const { error } = await db
    .from('project_members')
    .delete()
    .eq('project_id', projectId)
    .eq('user_id', targetUserId);

  if (error) {
    return Response.json({ error: 'Failed to remove member.' }, { status: 500 });
  }

  await logActivity({
    userId: session.userId,
    action: 'MEMBER_REMOVED',
    projectId,
    metadata: { removedUserId: targetUserId },
  });

  return Response.json({ message: 'Member removed from project.' }, { status: 200 });
}
