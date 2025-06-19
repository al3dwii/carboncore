"use client";
export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="w-full h-2 bg-white/10 rounded">
      <div className="h-full bg-green-600" style={{ width: `${value}%` }} />
    </div>
  );
}
