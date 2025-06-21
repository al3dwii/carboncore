import { default as loadable } from 'next/dynamic';   // ← alias to avoid the name-collision
import RoleGate from '@/lib/RoleGate';                // simple wrapper that checks Clerk.role

export const dynamic = 'force-dynamic';               // tell Next this route is always dynamic

// lazy-load the client code (no SSR)
const JobsClient = loadable(() => import('./JobsClient'), { ssr: false });

export default function JobsPage() {
  return (
    <RoleGate allow={['dev'] /* or ['dev','analyst'] if both need it */}>
      <JobsClient />
    </RoleGate>
  );
}
