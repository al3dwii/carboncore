import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/client';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => request('/stats/dashboard', 'get', {} as any),
    staleTime: 60_000,
  });
}
