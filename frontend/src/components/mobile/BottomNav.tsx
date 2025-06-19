'use client';
import { Home, Package2 } from 'lucide-react';
import Link from 'next/link';
export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 bg-background border-t md:hidden h-14 grid grid-cols-2">
      <Link href="/" className="flex flex-col items-center justify-center gap-0.5">
        <Home size={20}/><span className="text-[10px]">Home</span>
      </Link>
      <Link href="/projects" className="flex flex-col items-center justify-center gap-0.5">
        <Package2 size={20}/><span className="text-[10px]">Projects</span>
      </Link>
    </nav>
  );
}
