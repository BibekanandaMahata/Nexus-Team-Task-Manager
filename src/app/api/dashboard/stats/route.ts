import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';

// ─── GET /api/dashboard/stats ──────────────────────────────────────────────
// Returns aggregated metrics for the dashboard view.

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  const db = getSupabase();
  const userId = session.userId;

  // First get the user's project IDs
  const { data: memberRows } = await db
    .from('project_members')
    .select('project_id')
    .eq('user_id', userId);

  const projectIds: string[] = (memberRows ?? []).map((r: { project_id: string }) => r.project_id);

  // Run stat queries in parallel
  const [todoTasksResult, myTasksResult, recentActivityResult] = await Promise.all([
    // Total "To Do" tasks across all user's projects
    projectIds.length > 0
      ? db
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'To Do')
          .in('project_id', projectIds)
      : Promise.resolve({ count: 0 }),

    // Tasks assigned specifically to this user
    db
      .from('tasks')
      .select('id', { count: 'exact', head: true })
      .eq('assigned_to', userId),

    // Recent activity logs for user's projects
    projectIds.length > 0
      ? db
          .from('activity_logs')
          .select('id, action, metadata, created_at, users(username)')
          .in('project_id', projectIds)
          .order('created_at', { ascending: false })
          .limit(10)
      : Promise.resolve({ data: [] }),
  ]);

  return Response.json(
    {
      stats: {
        activeProjects: projectIds.length,
        todoTasks: (todoTasksResult as { count?: number }).count ?? 0,
        myTasks: (myTasksResult as { count?: number }).count ?? 0,
      },
      recentActivity: (recentActivityResult as { data?: unknown[] }).data ?? [],
    },
    { status: 200 }
  );
}
