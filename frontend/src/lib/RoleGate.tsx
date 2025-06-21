import { ReactNode } from 'react';
import { redirect } from 'next/navigation';
import { getRole, Role } from './auth.server';

export const dynamic = 'force-dynamic';

export async function RoleGate({
  allow,
  children,
}: {
  allow: Role[];
  children: ReactNode;
}) {
  const role = await getRole();
  if (!allow.includes(role)) redirect('/dashboard');
  return <>{children}</>;
}
