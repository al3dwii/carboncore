import { fetchLedger } from "@/lib/ledger-api";
import { Suspense } from "react";
import { EventRow } from "@/components/ledger/EventRow";
import { useEventSource } from "@/lib/useEventSource";
import { LedgerEvent } from "@/types/ledger";
import { Virtualizer } from "@tanstack/react-virtual";

export const dynamic = "force-dynamic";

export default async function LedgerPage() {
  const initial = await fetchLedger(50);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-4">Ledger</h1>
      <Suspense fallback={<p>Loading events…</p>}>
        <LiveList initial={initial} />
      </Suspense>
    </section>
  );
}

/** Client component */
function LiveList({ initial }: { initial: LedgerEvent[] }) {
  "use client";
  const newEvents = useEventSource<LedgerEvent>("/api/ledger/stream");
  const events = [...newEvents, ...initial];

  // virtualisation
  const parentRef = React.useRef<HTMLDivElement>(null);
  const rowVirtualizer = Virtualizer({
    count: events.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48
  });

  return (
    <div ref={parentRef} className="h-[70vh] overflow-auto">
      <div style={{ height: rowVirtualizer.getTotalSize() }} className="relative">
        {rowVirtualizer.getVirtualItems().map((v) => {
          const e = events[v.index];
          return (
            <div
              key={e.id}
              className="absolute top-0 left-0 right-0"
              style={{ transform: `translateY(${v.start}px)` }}
            >
              <EventRow e={e} />
            </div>
          );
        })}
      </div>
    </div>
  );
}
