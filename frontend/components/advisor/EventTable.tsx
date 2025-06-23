'use client';
import type { SavingEvent } from '@/lib/types';

export function EventTable({ rows, onRowClick }: { rows: SavingEvent[]; onRowClick?: (id: string) => void }) {
  return (
    <table className="w-full border-collapse text-sm">
      <thead>
        <tr className="text-left text-white/60">
          <th className="py-2">Project</th>
          <th>Feature</th>
          <th>CO₂</th>
          <th>USD</th>
          <th>Date</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(r => (
          <tr
            key={r.id}
            className="cursor-pointer border-t border-white/10 hover:bg-white/5"
            onClick={() => onRowClick?.(r.id)}
          >
            <td className="py-2">{r.project_id}</td>
            <td>{r.feature}</td>
            <td>{r.co2}</td>
            <td>{r.usd}</td>
            <td>{r.created_at.slice(0, 10)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
