'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

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
  username: string;
  roleName: string;
}

export function Sidebar({ username, roleName }: SidebarProps) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            ⚡
          </div>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 800,
              background: 'linear-gradient(135deg, #818cf8, #a78bfa)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Nexus
          </span>
        </div>
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
          <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-text-primary)', marginBottom: '2px' }}>
            {username}
          </div>
          <span className={`badge ${roleName === 'Admin' ? 'badge-admin' : 'badge-member'}`}>
            {roleName}
          </span>
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
