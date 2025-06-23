import { useQuery } from '@tanstack/react-query';
import { api } from './api';

export function useAdvisorEvents() {
  return useQuery({
    queryKey: ['advisor-events'],
    queryFn: () => api.recentAdvisor(),
  });
}
