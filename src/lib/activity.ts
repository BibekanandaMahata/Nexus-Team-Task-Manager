import { getSupabase } from '@/lib/supabase/server';

interface LogActivityOptions {
  userId: string;
  action: string;
  projectId?: string;
  taskId?: string;
  metadata?: Record<string, unknown>;
}

// ─── Write a single activity log entry ─────────────────────────────────────
// This is fire-and-forget safe — errors are swallowed so they never break
// the primary API response.

export async function logActivity(opts: LogActivityOptions): Promise<void> {
  try {
    const db = getSupabase();
    await db.from('activity_logs').insert({
      user_id: opts.userId,
      action: opts.action,
      project_id: opts.projectId ?? null,
      task_id: opts.taskId ?? null,
      metadata: opts.metadata ?? null,
    });
  } catch (err) {
    console.error('[ActivityLogger] Failed to write log:', err);
  }
}
