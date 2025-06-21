import { useQuery } from '@tanstack/react-query';
import { qk } from './queryKeys';
import { request } from './api';

export function useEvent(id: string) {
  return useQuery({
    queryKey: qk.event(id),
    queryFn: () => request(`/api/events/${id}`),
    staleTime: 30_000,
  });
}
