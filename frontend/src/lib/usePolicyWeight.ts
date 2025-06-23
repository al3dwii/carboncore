import { useQuery } from '@tanstack/react-query';
import { fetchPolicy } from './policy-api';

export function usePolicyWeight() {
  return useQuery({
    queryKey: ['policy-weight'],
    queryFn: fetchPolicy,
    select: (d) => d.weight,
    staleTime: 60_000,
  });
}
