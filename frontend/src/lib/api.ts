const BASE = process.env.NEXT_PUBLIC_API_BASE ?? '';  // e.g. "https://api.carboncore.dev"

export async function request<T>(
  path: string,
  init: RequestInit = {},
  fallback: RequestInit['method'] = 'GET',
): Promise<T> {
  // (1) HTTP verb
  const verb = (init.method ?? fallback).toUpperCase() as RequestInit['method'];

  // (2) full URL
  const url = new URL(path, BASE).toString();

  // (3) fire
  const res = await fetch(url, {
    ...init,
    method: verb,
    headers: {
      'Content-Type': 'application/json',
      ...init.headers,
    },
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`[${verb}] ${url} \u2192 ${res.status}\n${body}`);
  }

  if (res.status === 204) return {} as T;
  return res.json() as Promise<T>;
}
import type { SavingEvent } from './types';
export interface AdvisorEvent {
  id: string;
  project: string;
  feature: string;
  kg_co2: number;
  usd: number;
  commit: string;
  date: string;
}

const CC_BASE = process.env.CARBONCORE_URL ?? '';
function req<T>(path: string) {
  return fetch(`${CC_BASE}${path}`, {
    headers: { 'x-project-token': process.env.NEXT_PUBLIC_PROJECT_TOKEN ?? '' },
    cache: 'no-store',
  }).then(r => r.json() as Promise<T>);
}

export const api = {
  recentAdvisor: (n = 20) => req<SavingEvent[]>(`/iac-advisor/recent?limit=${n}`),
  getAdvisorEvent: (id: string) => req<AdvisorEvent>(`/iac-advisor/event/${id}`),
  patchBudget: (body: { budget: number }) => request(`/api/budget`, {
    method: 'PATCH',
    body: JSON.stringify(body)
  }),
  patchVendorThreshold: (value: number) => request(`/api/vendor-threshold`, {
    method: 'PATCH',
    body: JSON.stringify({ threshold: value })
  }),
  getEcoLabelStats: (orgId: string) => req<{ route: string; avg: number; views: number }[]>(`/org/${orgId}/ecolabel`),
  currentResidual: (orgId: string) => req<{ residual: number }>(`/org/${orgId}/offsets/residual`),
};
