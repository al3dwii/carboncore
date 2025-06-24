import { request } from "../../src/lib/request";
export interface LedgerRow {
  id: string;
  ts: string;
  project: string;
  sku: string;
  kwh: number;
  kg: number;
}

export async function fetchLedger(
  orgId: string,
  limit = 50,
): Promise<LedgerRow[]> {
  return request(`/api/org/${orgId}/ledger?limit=${limit}`);
}
