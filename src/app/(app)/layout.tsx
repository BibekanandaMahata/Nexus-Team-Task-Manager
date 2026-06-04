import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import { getSupabase } from '@/lib/supabase/server';
import { Sidebar } from '@/components/Sidebar';
import UsernameOnboarding from '@/components/UsernameOnboarding';

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect('/login');

  // Restrict temporary users from navigating the app until they complete their profile
  if (session.username.startsWith('nexus_user_') || !session.first_name) {
    return <UsernameOnboarding />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', position: 'relative', overflow: 'hidden', backgroundColor: 'var(--color-bg)' }}>
      {/* Background elements */}
      <div className="app-bg-grid" />
      <div className="app-ambient-glow" />

      <Sidebar firstName={session.first_name} lastName={session.last_name} username={session.username} />
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
