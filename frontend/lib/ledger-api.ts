import { request } from "@/lib/api";
import { LedgerEvent, LedgerEvent as T } from "@/types/ledger";

export async function fetchLedger(limit = 50): Promise<T[]> {
  const data = (await request("/ledger", "get", { limit } as any)) as T[];
  return LedgerEvent.array().parse(data);
}
