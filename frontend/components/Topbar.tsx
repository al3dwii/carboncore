"use client";
import { Menu } from "lucide-react";
import { UserButton } from "@clerk/nextjs";

export function Topbar({ onMenu }: { onMenu: () => void }) {
  return (
    <header className="h-14 flex items-center justify-between border-b bg-white px-4 shadow-sm lg:px-6">
      <button onClick={onMenu} className="p-2 rounded-md lg:hidden hover:bg-gray-100">
        <Menu size={20} />
      </button>
      <h1 className="text-lg font-semibold">CarbonCore</h1>
      <UserButton afterSignOutUrl="/" />
    </header>
  );
}
