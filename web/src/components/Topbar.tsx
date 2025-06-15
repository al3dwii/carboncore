'use client';
import { ModeToggle } from '@/components/ui/mode-toggle';
export function Topbar() {
  return (
    <header className="h-14 flex items-center justify-between border-b bg-surface pl-60 pr-4">
      <span className="font-medium">CarbonCore Console</span>
      <ModeToggle />
    </header>
  );
}
