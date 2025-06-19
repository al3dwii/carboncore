import { LedgerEvent, LedgerEvent as T } from "@/types/ledger";

export async function fetchLedger(limit = 50): Promise<T[]> {
  const res = await fetch(`/api/ledger?limit=${limit}`, { cache: "no-store" });
  if (!res.ok) throw new Error("Ledger fetch failed");
  const data = await res.json();
  return LedgerEvent.array().parse(data);
}
