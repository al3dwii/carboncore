import { ReactNode } from 'react';
export default function KpiTile({ label, value, icon }: { label:string; value:string; icon:ReactNode }) {
  return (
    <div
      role="status"
      aria-label={label}
      className="flex flex-col gap-1 px-4 py-3 rounded-xl bg-card shadow-sm
                 w-full xs:w-1/2 md:w-1/4"
    >
      <span className="text-muted-foreground text-xs">{label}</span>
      <div className="flex items-center text-2xl font-semibold">{value}{icon}</div>
    </div>
  );
}
