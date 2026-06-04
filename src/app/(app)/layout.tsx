import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { Sidebar } from '@/components/Sidebar';
import UsernameOnboarding from '@/components/UsernameOnboarding';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  // Restrict temporary users from navigating the app until they set their username
  if (session.username.startsWith('nexus_user_')) {
    return <UsernameOnboarding />;
  }

  // Fetch role name for sidebar badge
  const db = getSupabase();
  const { data: roleRow } = await db
    .from('roles')
    .select('name')
    .eq('id', session.roleId)
    .single();

  const roleName = roleRow?.name ?? 'Member';

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
      {/* Background elements */}
      <div className="app-bg-grid" />
      <div className="app-ambient-glow" />

      <Sidebar username={session.username} roleName={roleName} />
      <main
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '32px',
          position: 'relative',
          zIndex: 1,
        }}
      >
        {children}
      </main>
    </div>
  );
}
