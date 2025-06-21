import Link from 'next/link';
import { ReactNode } from 'react';
import { getUserWithRole, Role } from '@/lib/auth';

const NAV: Record<Role, { href: string; label: string }[]> = {
  ops: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/alerts', label: 'Alerts' },
    { href: '/events', label: 'Events' },
  ],
  analyst: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/events', label: 'Events' },
    { href: '/jobs', label: 'Jobs' },
  ],
  developer: [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/jobs', label: 'Jobs' },
  ],
};

export async function AppShell({
  children,
  orgId = '',
}: {
  children: ReactNode;
  orgId?: string;
}) {
  const session = await getUserWithRole();
  const role = session?.role ?? 'developer';

  return (
    <div className="min-h-screen flex">
      <aside className="w-60 p-4 border-r shrink-0">
        <h1 className="font-bold mb-4 text-lg">Carbon Core</h1>
        <nav className="space-y-1">
          {NAV[role].map(i => (
            <Link
              key={i.href}
              href={orgId ? `/org/${orgId}${i.href}` : i.href}
              className="block px-2 py-1 rounded hover:bg-muted"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
