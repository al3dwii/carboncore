"use client";
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded bg-white/10">
      <div className="h-full bg-green-600" style={{ width: `${value}%` }} />
    </div>
  );
}
