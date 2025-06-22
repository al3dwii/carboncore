export interface SavingEvent {
  id: number | string;
  project_id: string;
  feature: string;
  sku_id?: string | null;
  region?: string | null;
  kwh: number;
  co2: number;
  usd: number;
  created_at: string;
}
