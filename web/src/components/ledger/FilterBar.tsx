import { useState } from 'react';
import { format, subDays } from 'date-fns';
import { Button } from '@/components/ui/button';

export function FilterBar({ onChange }: { onChange: (q: string) => void }) {
  const [kind, setKind] = useState<string | null>(null);
  const [range, setRange] = useState(7);
  return (
    <div className="flex items-center gap-2 mb-4">
      {['ecs_shift', 'comply_export', 'edge_route'].map(k => (
        <Button
          key={k}
          size="sm"
          variant={kind === k ? 'default' : 'outline'}
          onClick={() => {
            const next = kind === k ? null : k;
            setKind(next);
            onChange(build(next, range));
          }}
        >
          {k}
        </Button>
      ))}
      {[7, 30, 90].map(d => (
        <Button
          key={d}
          size="sm"
          variant={range === d ? 'default' : 'outline'}
          onClick={() => {
            setRange(d);
            onChange(build(kind, d));
          }}
        >
          last {d} days
        </Button>
      ))}
    </div>
  );
}

function build(kind: string | null, days: number) {
  const from = format(subDays(new Date(), days), 'yyyy-MM-dd');
  const q = new URLSearchParams({ from }).toString();
  return kind ? `${q}&kind=${kind}` : q;
}
