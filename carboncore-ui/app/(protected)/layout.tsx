import { ReactNode } from "react";
import { AuthGuard } from "@/components/AuthGuard";
import { AppShell } from "@/components/layout/AppShell";
import { JobStreamToasts } from "@/components/scheduler/JobStreamToasts";

export default function ProtectedLayout({ children }: { children: ReactNode }) {
  return (
    <AuthGuard>
      <AppShell>
        {children}
        <JobStreamToasts />
      </AppShell>
    </AuthGuard>
  );
}
