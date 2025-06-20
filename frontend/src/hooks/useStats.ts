import { useQuery } from '@tanstack/react-query';
import { sdk } from '../lib/sdk';

export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => sdk.stats__dashboard(),
    staleTime: 60_000,
  });
}
