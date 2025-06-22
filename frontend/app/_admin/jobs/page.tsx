import { RoleGate } from '@/lib/RoleGate';
import JobsClient from './Jobs.client';
import type { Role } from '@/lib/auth.server';

export const dynamic = 'force-dynamic';

export default async function JobsPage() {
  return (
    <RoleGate allow={['dev' satisfies Role]}>
      {/* @ts-expect-error RSC ↔ Client boundary */}
      <JobsClient />
    </RoleGate>
  );
}
