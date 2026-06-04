import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

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
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
