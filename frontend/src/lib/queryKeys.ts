export const qk = {
  stats: () => ['stats'],
  events: (params: Record<string, string>) => ['events', params],
  event: (id: string) => ['event', id],
  alerts: (params: Record<string, string>) => ['alerts', params],
  jobs: (params: Record<string, string>) => ['jobs', params],
} as const;
