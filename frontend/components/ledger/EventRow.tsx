import { LedgerEvent } from "@/types/ledger";
import { format } from "date-fns";

export function EventRow({ e }: { e: LedgerEvent }) {
  return (
    <div className="grid grid-cols-[120px_1fr_80px_80px_80px] gap-4 border-b border-white/10 py-2" data-row>
      <div className="font-mono text-xs text-white/70">{format(new Date(e.ts), "yyyy-MM-dd HH:mm")}</div>
      <div>{e.service}@{e.region}</div>
      <div className="text-right">{e.kwh.toFixed(2)} kWh</div>
      <div className="text-right">{e.co2.toFixed(2)} kg</div>
      <div className="text-right">${e.usd.toFixed(2)}</div>
    </div>
  );
}
