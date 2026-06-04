// ─── Domain types matching the DB schema ───────────────────────────────────

export interface Role {
  id: number;
  name: string; // 'Admin' | 'Member'
}

export interface User {
  id: string; // UUID
  username: string;
  email: string;
  role_id: number;
  created_at: string;
}

export interface Otp {
  id: string;
  email: string;
  code: string;
  expires_at: string;
  used: boolean;
  created_at: string;
}

export interface Project {
  id: string;
  name: string;
  description: string | null;
  owner_id: string;
  created_at: string;
}

export interface ProjectMember {
  project_id: string;
  user_id: string;
  joined_at: string;
}

export type TaskStatus = 'To Do' | 'In Progress' | 'Done';

export interface Task {
  id: string;
  project_id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_to: string | null;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface ActivityLog {
  id: string;
  project_id: string | null;
  task_id: string | null;
  user_id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

// ─── Session payload (stored in JWT cookie) ────────────────────────────────

export interface SessionPayload {
  userId: string;
  email: string;
  username: string;
  roleId: number;
}

// ─── API response helpers ───────────────────────────────────────────────────

export interface ApiError {
  error: string;
}
