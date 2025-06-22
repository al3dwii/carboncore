"use client";
import { Sidebar }   from "../src/components/Sidebar";
import { UserButton } from "@clerk/nextjs";

export function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">{children}</main>
      <div className="fixed bottom-4 right-6 z-10">
        <UserButton afterSignOutUrl="/" />
      </div>
    </div>
  );
}
