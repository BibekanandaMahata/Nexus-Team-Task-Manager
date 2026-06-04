'use client';

import { useState, useEffect, useCallback, use } from 'react';

type TaskStatus = 'To Do' | 'In Progress' | 'Done';

interface Task {
  id: string;
  title: string;
  description: string | null;
  status: TaskStatus;
  assigned_to: string | null;
  assignee: { id: string; username: string } | null;
  creator: { id: string; username: string } | null;
  created_at: string;
}

interface Member {
  joined_at: string;
  users: { id: string; username: string; email: string; role_id: number };
}

const COLUMNS: { status: TaskStatus; label: string; colorClass: string; dotColor: string }[] = [
  { status: 'To Do',       label: 'To Do',       colorClass: 'badge-todo',       dotColor: '#3b82f6' },
  { status: 'In Progress', label: 'In Progress',  colorClass: 'badge-inprogress', dotColor: '#f59e0b' },
  { status: 'Done',        label: 'Done',         colorClass: 'badge-done',       dotColor: '#22c55e' },
];

interface TaskCardProps {
  task: Task;
  isAdmin: boolean;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, status: TaskStatus) => void;
}

function TaskCard({ task, isAdmin, onEdit, onDelete, onStatusChange }: TaskCardProps) {
  return (
    <div
      id={`task-${task.id}`}
      className="task-card"
      onClick={() => onEdit(task)}
    >
      <div style={{ marginBottom: '10px' }}>
        <p style={{ fontSize: '13px', fontWeight: 600, lineHeight: 1.4, marginBottom: '4px' }}>{task.title}</p>
        {task.description && (
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', lineHeight: 1.5 }} className="truncate">
            {task.description}
          </p>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
        {task.assignee ? (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '11px',
              color: 'var(--color-text-muted)',
            }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '9px',
                fontWeight: 700,
                color: '#fff',
                flexShrink: 0,
              }}
            >
              {task.assignee.username[0].toUpperCase()}
            </div>
            {task.assignee.username}
          </div>
        ) : (
          <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>Unassigned</span>
        )}

        {isAdmin && (
          <button
            id={`delete-task-${task.id}`}
            className="btn-icon"
            style={{ padding: '4px 6px', fontSize: '11px' }}
            onClick={(e) => {
              e.stopPropagation();
              onDelete(task.id);
            }}
            title="Delete task"
          >
            ✕
          </button>
        )}
      </div>
    </div>
  );
}

export default function KanbanPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: projectId } = use(params);

  const [tasks, setTasks] = useState<Task[]>([]);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [ownerId, setOwnerId] = useState<string | null>(null);

  // Task modal state
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createStatus, setCreateStatus] = useState<TaskStatus>('To Do');

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newAssignee, setNewAssignee] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [editStatus, setEditStatus] = useState<TaskStatus>('To Do');
  const [editAssignee, setEditAssignee] = useState('');
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Member panel
  const [showMembers, setShowMembers] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [searchResults, setSearchResults] = useState<{ id: string; username: string }[]>([]);
  const [addingMember, setAddingMember] = useState(false);

  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    const [tasksRes, membersRes, meRes, projectRes] = await Promise.all([
      fetch(`/api/tasks?projectId=${projectId}`),
      fetch(`/api/projects/${projectId}/members`),
      fetch('/api/users/me'),
      fetch(`/api/projects/${projectId}`),
    ]);

    const [tasksData, membersData, meData, projectData] = await Promise.all([
      tasksRes.json(),
      membersRes.json(),
      meRes.json(),
      projectRes.json(),
    ]);

    setTasks(tasksData.tasks ?? []);
    setMembers(membersData.members ?? []);
    setIsAdmin(projectData.project?.owner_id === meData.user?.id);
    setOwnerId(projectData.project?.owner_id ?? null);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Search users for invite
  useEffect(() => {
    if (searchQ.length < 2) { setSearchResults([]); return; }
    const timeout = setTimeout(async () => {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(searchQ)}`);
      const data = await res.json();
      setSearchResults(data.users ?? []);
    }, 300);
    return () => clearTimeout(timeout);
  }, [searchQ]);

  async function handleCreateTask(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await fetch('/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        projectId,
        title: newTitle,
        description: newDesc || undefined,
        assignedTo: newAssignee || undefined,
      }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (!res.ok) { showToast(data.error, 'error'); return; }
    setShowCreateModal(false);
    setNewTitle(''); setNewDesc(''); setNewAssignee('');
    showToast('Task created!');
    fetchData();
  }

  async function handleUpdateTask(e: React.FormEvent) {
    e.preventDefault();
    if (!editingTask) return;
    setEditSubmitting(true);
    const res = await fetch(`/api/tasks/${editingTask.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: editTitle,
        description: editDesc,
        status: editStatus,
        assignedTo: editAssignee || null,
      }),
    });
    const data = await res.json();
    setEditSubmitting(false);
    if (!res.ok) { showToast(data.error, 'error'); return; }
    setEditingTask(null);
    showToast('Task updated!');
    fetchData();
  }

  async function handleDeleteTask(taskId: string) {
    if (!confirm('Delete this task?')) return;
    const res = await fetch(`/api/tasks/${taskId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { showToast(data.error, 'error'); return; }
    showToast('Task deleted.');
    fetchData();
  }

  async function handleStatusChange(taskId: string, status: TaskStatus) {
    const res = await fetch(`/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      setTasks((prev) => prev.map((t) => (t.id === taskId ? { ...t, status } : t)));
    }
  }

  async function handleAddMember(userId: string) {
    setAddingMember(true);
    const res = await fetch(`/api/projects/${projectId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    setAddingMember(false);
    if (!res.ok) { showToast(data.error, 'error'); return; }
    showToast(data.message);
    setSearchQ(''); setSearchResults([]);
    fetchData();
  }

  async function handleRemoveMember(userId: string) {
    if (!confirm('Remove this member?')) return;
    const res = await fetch(`/api/projects/${projectId}/members/${userId}`, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) { showToast(data.error, 'error'); return; }
    showToast('Member removed.');
    fetchData();
  }

  function openEditModal(task: Task) {
    setEditingTask(task);
    setEditTitle(task.title);
    setEditDesc(task.description ?? '');
    setEditStatus(task.status);
    setEditAssignee(task.assigned_to ?? '');
  }

  const tasksByStatus = (status: TaskStatus) => tasks.filter((t) => t.status === status);

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '4px' }}>Kanban Board</h1>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '13px' }}>Drag, click, or update tasks across columns</p>
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          {isAdmin && (
            <button
              id="manage-members-btn"
              className="btn btn-secondary"
              onClick={() => setShowMembers(true)}
            >
              ◉ Members ({members.length})
            </button>
          )}
          <button
            id="create-task-btn"
            className="btn btn-primary"
            onClick={() => { setCreateStatus('To Do'); setShowCreateModal(true); }}
          >
            + New Task
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      {loading ? (
        <div className="kanban-board">
          {COLUMNS.map((col) => (
            <div key={col.status} className="skeleton" style={{ height: '300px', borderRadius: '12px' }} />
          ))}
        </div>
      ) : (
        <div className="kanban-board">
          {COLUMNS.map((col) => (
            <div key={col.status} className="kanban-col">
              <div className="kanban-col-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: col.dotColor }} />
                  <span style={{ fontSize: '13px', fontWeight: 700, color: 'var(--color-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                    {col.label}
                  </span>
                </div>
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: 700,
                    padding: '2px 8px',
                    borderRadius: '99px',
                    background: 'var(--color-surface-3)',
                    color: 'var(--color-text-muted)',
                  }}
                >
                  {tasksByStatus(col.status).length}
                </span>
              </div>

              {tasksByStatus(col.status).map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  isAdmin={isAdmin}
                  onEdit={openEditModal}
                  onDelete={handleDeleteTask}
                  onStatusChange={handleStatusChange}
                />
              ))}

              <button
                id={`add-task-${col.status.replace(/ /g, '-').toLowerCase()}`}
                className="btn btn-secondary"
                style={{ width: '100%', marginTop: '4px', fontSize: '12px', padding: '8px' }}
                onClick={() => { setCreateStatus(col.status); setShowCreateModal(true); }}
              >
                + Add task
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      {showCreateModal && (
        <div className="modal-backdrop" onClick={() => setShowCreateModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>New Task</h2>
            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="task-title">Title *</label>
                <input id="task-title" type="text" className="input" value={newTitle} onChange={(e) => setNewTitle(e.target.value)} required autoFocus disabled={submitting} placeholder="What needs to be done?" />
              </div>
              <div className="form-group">
                <label htmlFor="task-desc">Description</label>
                <textarea id="task-desc" className="input" value={newDesc} onChange={(e) => setNewDesc(e.target.value)} disabled={submitting} placeholder="Optional details…" rows={3} />
              </div>
              <div className="form-group">
                <label htmlFor="task-status">Status</label>
                <select id="task-status" className="input" value={createStatus} onChange={(e) => setCreateStatus(e.target.value as TaskStatus)} disabled={submitting} style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-primary)' }}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="task-assignee">Assign to</label>
                <select id="task-assignee" className="input" value={newAssignee} onChange={(e) => setNewAssignee(e.target.value)} disabled={submitting} style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-primary)' }}>
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.users.id} value={m.users.id}>{m.users.username}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button id="create-task-submit" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={submitting}>
                  {submitting ? <><span className="spinner" />Creating…</> : 'Create task'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setShowCreateModal(false)} disabled={submitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      {editingTask && (
        <div className="modal-backdrop" onClick={() => setEditingTask(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Edit Task</h2>
            <form onSubmit={handleUpdateTask} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="form-group">
                <label htmlFor="edit-title">Title *</label>
                <input id="edit-title" type="text" className="input" value={editTitle} onChange={(e) => setEditTitle(e.target.value)} required disabled={editSubmitting} />
              </div>
              <div className="form-group">
                <label htmlFor="edit-desc">Description</label>
                <textarea id="edit-desc" className="input" value={editDesc} onChange={(e) => setEditDesc(e.target.value)} disabled={editSubmitting} rows={3} />
              </div>
              <div className="form-group">
                <label htmlFor="edit-status">Status</label>
                <select id="edit-status" className="input" value={editStatus} onChange={(e) => setEditStatus(e.target.value as TaskStatus)} disabled={editSubmitting} style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-primary)' }}>
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="edit-assignee">Assign to</label>
                <select id="edit-assignee" className="input" value={editAssignee} onChange={(e) => setEditAssignee(e.target.value)} disabled={editSubmitting} style={{ background: 'var(--color-surface-2)', color: 'var(--color-text-primary)' }}>
                  <option value="">Unassigned</option>
                  {members.map((m) => (
                    <option key={m.users.id} value={m.users.id}>{m.users.username}</option>
                  ))}
                </select>
              </div>
              <div style={{ display: 'flex', gap: '10px', marginTop: '4px' }}>
                <button id="edit-task-submit" type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={editSubmitting}>
                  {editSubmitting ? <><span className="spinner" />Saving…</> : 'Save changes'}
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setEditingTask(null)} disabled={editSubmitting}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Members Panel Modal */}
      {showMembers && (
        <div className="modal-backdrop" onClick={() => setShowMembers(false)}>
          <div className="modal" style={{ width: '100%', maxWidth: '32.5rem' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h2>Team Members</h2>
              <button className="btn-icon" onClick={() => setShowMembers(false)}>✕</button>
            </div>

            {/* Search to add member */}
            {isAdmin && (
              <div style={{ marginBottom: '20px' }}>
                <div className="form-group">
                  <label htmlFor="member-search">Invite by username</label>
                  <input
                    id="member-search"
                    type="text"
                    className="input"
                    placeholder="Search username…"
                    value={searchQ}
                    onChange={(e) => setSearchQ(e.target.value)}
                  />
                </div>
                {searchResults.length > 0 && (
                  <div
                    style={{
                      marginTop: '8px',
                      background: 'var(--color-surface-2)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      overflow: 'hidden',
                    }}
                  >
                    {searchResults.map((u) => (
                      <div
                        key={u.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '10px 14px',
                          borderBottom: '1px solid var(--color-border)',
                          fontSize: '13px',
                        }}
                      >
                        <span>{u.username}</span>
                        <button
                          id={`invite-${u.id}`}
                          className="btn btn-primary btn-sm"
                          onClick={() => handleAddMember(u.id)}
                          disabled={addingMember}
                        >
                          Invite
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            <div className="divider" />

            {/* Current members list */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '300px', overflowY: 'auto' }}>
              {members.map((m) => (
                <div
                  key={m.users.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 0',
                    borderBottom: '1px solid var(--color-border)',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: '50%',
                        background: 'linear-gradient(135deg, var(--color-brand-start), var(--color-brand-end))',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '13px',
                        fontWeight: 700,
                        color: '#fff',
                      }}
                    >
                      {m.users.username[0].toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontSize: '13px', fontWeight: 600 }}>{m.users.username}</div>
                      <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>{m.users.email}</div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${m.users.id === ownerId ? 'badge-admin' : 'badge-member'}`}>
                      {m.users.id === ownerId ? 'Creator' : 'Member'}
                    </span>
                    {isAdmin && m.users.id !== ownerId && (
                      <button
                        id={`remove-member-${m.users.id}`}
                        className="btn btn-danger btn-sm"
                        onClick={() => handleRemoveMember(m.users.id)}
                      >
                        Remove
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === 'success' ? '✓' : '✕'} {toast.msg}
        </div>
      )}
    </div>
  );
}
