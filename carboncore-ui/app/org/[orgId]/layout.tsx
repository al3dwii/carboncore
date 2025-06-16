import { ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { OrgCtx } from "@/lib/useOrg";

export default function OrgLayout({ children, params }: { children: ReactNode; params: { orgId: string } }) {
  return (
    <AuthGuard>
      <OrgCtx.Provider value={{ id: params.orgId, name: params.orgId }}>
        <AppShell orgId={params.orgId}>{children}</AppShell>
      </OrgCtx.Provider>
    </AuthGuard>
  );
}
