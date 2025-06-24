"use client";
import { useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { UserButton } from "@clerk/nextjs";

export function Shell({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 bg-black/50 transition-opacity lg:hidden 
                    ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      {/* sidebar column */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white 
                         border-r px-4 py-6 transition-transform duration-300
                         dark:bg-zinc-950
                         ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <Logo onClick={() => setOpen(false)} />
        <div className="mt-8">
          <Sidebar onNavigate={() => setOpen(false)} />
        </div>
        <div className="mt-auto pt-6">
          <UserButton afterSignOutUrl="/" />
        </div>
      </aside>

      {/* hamburger + title (mobile only) */}
      <header className="flex items-center gap-3 border-b bg-white px-4 py-3 lg:hidden">
        <button
          onClick={() => setOpen(true)}
          className="rounded-md p-2"
          aria-label="Open navigation"
        >
          <svg viewBox="0 0 20 14" stroke="currentColor" strokeWidth="2" className="h-5 w-5"><path d="M1 1h18M1 7h18M1 13h18" /></svg>
        </button>
        <h1 className="text-lg font-semibold">CarbonCore</h1>
      </header>

      {/* scrollable page content */}
      <main className="flex-1 overflow-y-auto bg-gray-50 px-6 py-8 dark:bg-zinc-900">
        {children}
      </main>
    </div>
  );
}

function Logo(props: React.ComponentProps<"a">) {
  return (
    <a href="/" className="flex items-center gap-2 text-xl font-bold text-brand" {...props}>
      <span className="grid h-8 w-8 place-content-center rounded-full bg-brand text-white">C</span>
      CarbonCore
    </a>
  );
}
