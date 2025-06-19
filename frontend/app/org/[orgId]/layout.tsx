import { ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { OrgProvider } from "@/lib/useOrg";

export default function OrgLayout({ children, params }: { children: ReactNode; params: { orgId: string } }) {
  return (
    <AuthGuard>
      <OrgProvider initialOrg={params.orgId}>
        <AppShell orgId={params.orgId}>{children}</AppShell>
      </OrgProvider>
    </AuthGuard>
  );
}
