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

  const { id: projectId, userId: targetUserId } = await params;
  const db = getSupabase();

  // Prevent removing the project owner and enforce caller must be owner
  const { data: project } = await db
    .from('projects')
    .select('owner_id')
    .eq('id', projectId)
    .single();

  if (!project || project.owner_id !== session.userId) {
    return Response.json({ error: 'Forbidden. Project owner required.' }, { status: 403 });
  }

  if (project.owner_id === targetUserId) {
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
