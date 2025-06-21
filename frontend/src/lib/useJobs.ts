import { useQuery } from '@tanstack/react-query';
import { qk } from './queryKeys';
import { request } from './api';

export function useJobs(params: Record<string, string>, refetchInterval?: number | false) {
  return useQuery({
    queryKey: qk.jobs(params),
    queryFn: () => request('/api/jobs', params),
    staleTime: 30_000,
    refetchInterval,
  });
}
