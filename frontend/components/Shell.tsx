"use client";
import Link from "next/link";
import { UserButton } from "@clerk/nextjs";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const nav = [
  { label: "Dashboard", href: "/org/1/dashboard" },
  { label: "Ledger",     href: "/org/1/ledger" },
  { label: "Budget",     href: "/org/1/budget" },
  { label: "Scheduler",  href: "/org/1/scheduler" },
  { label: "Pulse",      href: "/org/1/pulse" },
  { label: "Settings",   href: "/org/1/settings" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  // auth(); // ⬅ server redirects if not signed-in
  return (
    <div className="flex h-screen">
      <aside className="w-56 border-r border-white/10 p-4 space-y-4">
        <h1 className="text-xl font-bold mb-4">CarbonCore</h1>
        <nav className="space-y-1">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "block rounded px-3 py-2 hover:bg-white/10",
                path?.startsWith(n.href) && "bg-white/10"
              )}
            >
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
    </div>
  );
}

// "use client";
// import  Sidebar  from "./Sidebar";
// import { Topbar } from "@/components/Topbar";
// import { useState } from "react";

// export function Shell({ children }: { children: React.ReactNode }) {
//   const [open, setOpen] = useState(false);
//   return (
//     <div className="min-h-screen flex flex-col">
//       <Topbar onMenu={() => setOpen(!open)} />
//       <div className="flex flex-1">
//         <Sidebar open={open} onClose={() => setOpen(false)} />
//         <main className="flex-1 p-6 lg:p-10">{children}</main>
//       </div>
//     </div>
//   );
// }
