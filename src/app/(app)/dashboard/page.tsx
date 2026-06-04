import type { Metadata } from 'next';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';

export const metadata: Metadata = { title: 'Dashboard' };

interface ActivityLog {
  id: string;
  action: string;
  created_at: string;
  users: { username: string } | null;
  metadata: Record<string, string> | null;
}

function formatAction(action: string, meta: Record<string, string> | null): string {
  switch (action) {
    case 'PROJECT_CREATED': return `created project "${meta?.name ?? ''}"`;
    case 'PROJECT_DELETED': return 'deleted a project';
    case 'TASK_CREATED':   return `created task "${meta?.title ?? ''}"`;
    case 'TASK_UPDATED':   return `updated task "${meta?.taskTitle ?? ''}"`;
    case 'TASK_DELETED':   return `deleted task "${meta?.taskTitle ?? ''}"`;
    case 'MEMBER_ADDED':   return `added ${meta?.addedUsername ?? 'a user'} to project`;
    case 'MEMBER_REMOVED': return 'removed a member from project';
    default:               return action.toLowerCase().replace(/_/g, ' ');
  }
}

function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) return null;

  const db = getSupabase();
  const userId = session.userId;

  // First get the user's project IDs
  const { data: memberRows } = await db
    .from('project_members')
    .select('project_id')
    .eq('user_id', userId);

  const projectIds: string[] = (memberRows ?? []).map((r: { project_id: string }) => r.project_id);

  const [todoRes, myTasksRes, activityRes] = await Promise.all([
    projectIds.length > 0
      ? db
          .from('tasks')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'To Do')
          .in('project_id', projectIds)
      : Promise.resolve({ count: 0 }),

    db.from('tasks').select('id', { count: 'exact', head: true }).eq('assigned_to', userId),

    projectIds.length > 0
      ? db
          .from('activity_logs')
          .select('id, action, created_at, metadata, users(username)')
          .in('project_id', projectIds)
          .order('created_at', { ascending: false })
          .limit(8)
      : Promise.resolve({ data: [] }),
  ]);

  const stats = {
    activeProjects: projectIds.length,
    todoTasks: (todoRes as { count?: number }).count ?? 0,
    myTasks: (myTasksRes as { count?: number }).count ?? 0,
  };

  const activity: ActivityLog[] = ((activityRes as { data?: unknown[] }).data ?? []) as ActivityLog[];

  return (
    <div style={{ width: '100%', maxWidth: '68.75rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '32px' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 800, marginBottom: '6px' }}>
          Good{' '}
          {new Date().getHours() < 12 ? 'morning' : new Date().getHours() < 18 ? 'afternoon' : 'evening'},{' '}
          <span className="gradient-text">{session.username}</span> 👋
        </h1>
        <p style={{ color: 'var(--color-text-secondary)', fontSize: '14px' }}>
          Here&apos;s what&apos;s happening across your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px',
        }}
      >
        <div className="stat-card">
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Active Projects
          </div>
          <div className="stat-number">{stats.activeProjects}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>you are a member of</div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            To Do Tasks
          </div>
          <div className="stat-number">{stats.todoTasks}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>across all projects</div>
        </div>

        <div className="stat-card">
          <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Assigned to Me
          </div>
          <div className="stat-number">{stats.myTasks}</div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)' }}>tasks need your attention</div>
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '16px', color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          Recent Activity
        </h2>

        {activity.length === 0 ? (
          <div
            className="glass-card"
            style={{ padding: '40px', textAlign: 'center', color: 'var(--color-text-muted)', fontSize: '14px' }}
          >
            No activity yet. Create a project to get started!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {activity.map((log) => (
              <div
                key={log.id}
                className="glass-card"
                style={{
                  padding: '14px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '16px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minWidth: 0 }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: '8px',
                      background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15), rgba(6, 182, 212, 0.15))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '14px',
                      flexShrink: 0,
                    }}
                  >
                    {log.action.startsWith('TASK') ? '◈' : log.action.startsWith('PROJECT') ? '◉' : '◎'}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <span style={{ fontWeight: 600, fontSize: '13px', color: 'var(--color-text-primary)' }}>
                      {log.users?.username ?? 'Unknown'}
                    </span>{' '}
                    <span style={{ fontSize: '13px', color: 'var(--color-text-secondary)' }}>
                      {formatAction(log.action, log.metadata)}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: '11px', color: 'var(--color-text-muted)', flexShrink: 0 }}>
                  {timeAgo(log.created_at)}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
