import { useQuery } from '@tanstack/react-query';
import { qk } from './queryKeys';
import { request } from './api';

export function useAlerts(params: Record<string, string>) {
  return useQuery({
    queryKey: qk.alerts(params),
    queryFn: () => request('/api/alerts', params),
    staleTime: 30_000,
  });
}

export function snooze(id: string) {
  return request(`/api/alerts/${id}/snooze`, {}, 'PATCH');
}
