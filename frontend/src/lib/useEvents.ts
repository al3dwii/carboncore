import { useInfiniteQuery, keepPreviousData } from '@tanstack/react-query';
import { qk } from './queryKeys';
import { request } from './api';

export const getNextPage = (last: { nextCursor?: string }) => last.nextCursor ?? undefined;

export function useEvents(params: Record<string, string>) {
  return useInfiniteQuery({
    queryKey: qk.events(params),
    queryFn: ({ pageParam }) => request('/api/events', { ...params, cursor: pageParam }),
    getNextPageParam: getNextPage,
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });
}
