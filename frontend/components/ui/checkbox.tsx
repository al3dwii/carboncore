'use client';
import { cn } from '@/lib/utils';

export default function Checkbox({ checked, onCheckedChange, label }: { checked?: boolean; onCheckedChange?: (v: boolean) => void; label: string }) {
  return (
    <label className="flex items-center gap-2">
      <input type="checkbox" className={cn('border')} checked={checked} onChange={e=>onCheckedChange?.(e.target.checked)} />
      {label}
    </label>
  );
}
