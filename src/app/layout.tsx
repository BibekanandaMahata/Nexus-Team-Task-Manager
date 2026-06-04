import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'Nexus — Team Task Manager',
    template: '%s | Nexus',
  },
  description:
    'Nexus is a beautiful, fast, team-first task manager with Kanban boards, project management, and real-time collaboration.',
  keywords: ['task manager', 'kanban', 'team', 'project management'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
