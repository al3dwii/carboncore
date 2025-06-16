import Link from "next/link";
import { ReactNode } from "react";
import { ModeToggle } from "@/components/ui/ModeToggle";

const nav = [
  { href: "/dashboard", label: "Dashboard", icon: "📊" },
  { href: "/ledger", label: "Ledger", icon: "📜" }
];

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen bg-cc-base text-white">
      {/* Side-nav */}
      <aside className="w-56 border-r border-white/10 hidden md:block">
        <div className="h-16 flex items-center justify-center font-bold">
          CarbonCore
        </div>
        <nav className="px-4 space-y-1">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-2 py-2 rounded hover:bg-white/10"
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
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
