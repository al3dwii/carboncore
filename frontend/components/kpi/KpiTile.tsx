"use client";

export function KpiTile({
  label,
  value,
  unit,
}: {
  label: string;
  value: number | string;
  unit?: string;
}) {
  return (
    <div className="rounded bg-white p-4 shadow-sm">
      <p className="text-xs text-neutral-500">{label}</p>
      <p className="mt-1 text-2xl font-semibold">
        {value}
        {unit && <span className="ml-1 text-sm">{unit}</span>}
      </p>
    </div>
  );
}
