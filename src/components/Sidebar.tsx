'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Logo from './Logo';

interface NavItem {
  href: string;
  label: string;
  icon: string;
  id: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: '/dashboard', label: 'Dashboard', icon: '⊞', id: 'nav-dashboard' },
  { href: '/projects', label: 'Projects', icon: '◈', id: 'nav-projects' },
  { href: '/team', label: 'Team', icon: '◉', id: 'nav-team' },
];

interface SidebarProps {
  firstName: string | null;
  lastName: string | null;
  username: string;
  email: string;
}

export function Sidebar({ firstName, lastName, username, email }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <Logo variant="short" size="md" />
      </div>

      {/* Navigation */}
      <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '2px' }}>
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          return (
            <Link
              key={item.href}
              href={item.href}
              id={item.id}
              className={`sidebar-nav-item ${isActive ? 'active' : ''}`}
            >
              <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* User info + Logout */}
      <div
        style={{
          paddingTop: '16px',
          borderTop: '1px solid var(--color-border)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <div style={{ padding: '8px 12px' }}>
          <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
            {firstName} {lastName}
          </div>
          <div style={{ fontSize: '12px', color: 'var(--color-text-muted)', marginBottom: '2px' }}>
            @{username}
          </div>
          <div style={{ fontSize: '11px', color: 'var(--color-text-muted)' }} className="truncate">
            {email}
          </div>
        </div>
        <button
          id="logout-btn"
          onClick={handleLogout}
          className="sidebar-nav-item btn-danger"
          style={{ width: '100%', border: 'none', cursor: 'pointer', background: 'transparent' }}
        >
          <span style={{ fontSize: '16px', width: '20px', textAlign: 'center' }}>→</span>
          Sign out
        </button>
      </div>
    </aside>
  );
}
