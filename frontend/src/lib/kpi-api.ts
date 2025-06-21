import { request } from './api';

export function fetchKpis(orgId: string) {
  return request<{ items: { name: string; value: number }[] }>(`/api/org/${orgId}/kpi`);
}
