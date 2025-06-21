/* app/(main)/alerts/page.tsx  ──  *server component* */

import { default as loadable } from 'next/dynamic';   // ← alias!

export const dynamic = 'force-dynamic';               // ← the route flag

import RoleGate from '@/lib/RoleGate';

const AlertsClient = loadable(() => import('./AlertsClient'), { ssr: false });

export default function AlertsPage() {
  return (
    <RoleGate allow={['ops']}>
      <AlertsClient />
    </RoleGate>
  );
}
