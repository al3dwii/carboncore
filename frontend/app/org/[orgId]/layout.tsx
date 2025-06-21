import { AppShell } from '@/components/layout/AppShell';
import { getActiveOrgId } from '@/lib/org';

export default function OrgLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { orgId: string };
}) {
  const orgId = getActiveOrgId(params.orgId);
  return <AppShell orgId={orgId}>{children}</AppShell>;
}
