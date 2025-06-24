"use client";
import type { ReactNode } from "react";

export function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex flex-col gap-6 px-6 py-4 lg:px-12 lg:py-8">
      {children}
    </div>
  );
}
