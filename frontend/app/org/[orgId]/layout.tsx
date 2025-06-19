import { ReactNode } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { OrgProvider } from "@/lib/useOrg";

export default function OrgLayout({ children, params }: { children: ReactNode; params: { orgId: string } }) {
  return (
    <OrgProvider initialOrg={params.orgId}>
      <AppShell orgId={params.orgId}>{children}</AppShell>
    </OrgProvider>
  );
}
