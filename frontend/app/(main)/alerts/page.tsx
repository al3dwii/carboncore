import { RoleGate } from '@/lib/RoleGate';
import AlertsClient from './Alerts.client';
import type { Role } from '@/lib/auth.server';

export const dynamic = 'force-dynamic';

export default async function AlertsPage() {
  return (
    <RoleGate allow={['ops' satisfies Role]}>
      {/* @ts-expect-error RSC ↔ Client boundary */}
      <AlertsClient />
    </RoleGate>
  );
}
