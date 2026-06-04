import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { Sidebar } from '@/components/Sidebar';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  // Fetch role name for sidebar badge
  const db = getSupabase();
  const { data: roleRow } = await db
    .from('roles')
    .select('name')
    .eq('id', session.roleId)
    .single();

  const roleName = roleRow?.name ?? 'Member';

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar username={session.username} roleName={roleName} />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          background: 'var(--color-bg)',
          padding: '32px',
        }}
      >
        {children}
      </main>
    </div>
  );
}
