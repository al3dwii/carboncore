'use client';
import { useSearchParams, useRouter } from 'next/navigation';
import { useMemo } from 'react';
import { VirtualTable } from '@/components/VirtualTable';
import { useEvents } from '@/lib/useEvents';
import { Input } from '@/components/ui';
import { Checkbox } from '@/components/ui';
import { Loader2 } from 'lucide-react';

export default function EventsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const qp = useMemo(() => Object.fromEntries(params.entries()), [params]);
  const { data, fetchNextPage, isFetchingNextPage } = useEvents(qp as any);
  const items = data?.pages.flatMap(p => (p as any).items) ?? [];

  const setParam = (k: string, v: string) => {
    const next = new URLSearchParams(params as any);
    if (v) next.set(k, v); else next.delete(k);
    router.replace(`/events?${next.toString()}`);
  };

  return (
    <div className="grid grid-cols-[240px_1fr] gap-6">
      {/* Facets */}
      <aside className="space-y-4">
        <Input
          placeholder="Search…"
          defaultValue={qp.q ?? ''}
          onChange={e => setParam('q', e.target.value)}
        />
        <div className="space-y-2">
          <p className="text-sm font-medium">Type</p>
          {['info', 'warning', 'error'].map(t => (
            <Checkbox
              key={t}
              checked={qp.type === t}
              onCheckedChange={v => setParam('type', v ? t : '')}
              label={t}
            />
          ))}
        </div>
      </aside>

      {/* Timeline */}
      <div>
        <VirtualTable
          items={items}
          rowRenderer={(ev: any) => (
            <div
              className="grid grid-cols-[160px_100px_120px_1fr] gap-2 text-sm hover:bg-muted/40 cursor-pointer"
              onClick={() => router.push(`/events/${ev.id}`)}
            >
              <span>{new Date(ev.ts).toLocaleString()}</span>
              <span>{ev.type}</span>
              <span>{ev.plugin}</span>
              <span className="truncate">{ev.summary}</span>
            </div>
          )}
          rowClassName={i => (i % 2 ? 'bg-muted/20' : '')}
        />
        {isFetchingNextPage && <Loader2 className="animate-spin mx-auto my-4" />}
        <button
          hidden
          ref={el => {
            const io = new IntersectionObserver(([e]) => e.isIntersecting && fetchNextPage());
            el && io.observe(el);
          }}
        />
      </div>
    </div>
  );
}
