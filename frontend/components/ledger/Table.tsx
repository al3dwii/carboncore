"use client";

import { useEffect, useState } from "react";
import { LedgerEventSchema, type LedgerEvent } from "@/lib/schemas";
import { useEventSource } from "@/lib/useEventSource";
import { toastSuccess } from "@/lib/toast";

export default function LedgerTable({
  initial,
  orgId,
}: {
  initial: LedgerEvent[] | null | undefined;
  orgId: string;
}) {
  /* 1 ─ guarantee the state is an array */
  const [rows, setRows] = useState<LedgerEvent[]>(() =>
    Array.isArray(initial) ? initial : []
  );

  /* 2 ─ use the current hook signature: [data, err, status] */
  const [event] = useEventSource<LedgerEvent>(
    `/api/proxy/org/${orgId}/ledger/stream`,
    { reconnect: true }               // any opts you like
  );

  /* 3 ─ apply side-effects only when a new event arrives */
  useEffect(() => {
    if (!event) return;
    try {
      const evt = LedgerEventSchema.parse(event); // zod runtime check
      setRows(r => [evt, ...r]);
      toastSuccess(evt.message);
    } catch {
      /* ignore schema mismatch */
    }
  }, [event]);

  /* 4 ─ render */
  return (
    <table className="w-full table-auto text-sm">
      <thead>
        <tr className="bg-gray-100">
          <th className="px-4 py-2 text-left">Time</th>
          <th className="px-4 py-2 text-left">Type</th>
          <th className="px-4 py-2 text-left">Details</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(e => (
          <tr key={e.id} className="border-t">
            <td className="px-4 py-2">
              {new Date(e.ts).toLocaleString()}
            </td>
            <td className="px-4 py-2">{e.kind}</td>
            <td className="px-4 py-2">{e.message}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
