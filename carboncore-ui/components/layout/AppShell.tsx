import { ReactNode } from "react";
import { ModeToggle } from "@/components/ui/ModeToggle";
import { NAV_BY_ROLE } from "@/lib/nav";
import { SideNav } from "./SideNav";
import { getServerSessionWithRole } from "@/lib/auth";

export async function AppShell({ children }: { children: ReactNode }) {
  const session = await getServerSessionWithRole();
  const role = (session?.user?.role as keyof typeof NAV_BY_ROLE) || "developer";
  const nav = NAV_BY_ROLE[role];

  return (
    <div className="flex min-h-screen bg-cc-base text-white">
      {/* Side-nav */}
      <aside className="w-56 border-r border-white/10 hidden md:block">
        <div className="h-16 flex items-center justify-center font-bold">
          CarbonCore
        </div>
        <SideNav items={nav} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col">
        <header className="h-16 flex items-center justify-end px-6 gap-4 border-b border-white/10">
          <ModeToggle />
        </header>
        <main className="p-6 flex-1">{children}</main>
      </div>
    </div>
  );
}
