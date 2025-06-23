'use client';

import { useState } from 'react';
import { useJobs } from '@/lib/useJobs';
import  Button  from '@/components/ui/Button';
import { Loader2 } from 'lucide-react';

export default function JobsClient() {
  const [refresh, setRefresh] = useState(false);

  // we keep one query instance here so the “global” spinner works
  const { isFetching } = useJobs({ state: 'running' }, refresh ? 10_000 : false);

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Jobs</h1>
        <Button size="sm" variant="outline" onClick={() => setRefresh((x) => !x)}>
          {refresh ? 'Stop auto refresh' : 'Refresh every 10s'}
        </Button>
      </header>

      {isFetching && <Loader2 className="animate-spin" />}

      {['running', 'queued', 'finished'].map((state) => (
        <JobSection key={state} state={state} />
      ))}
    </div>
  );
}

function JobSection({ state }: { state: string }) {
  const { data } = useJobs({ state });
  if (!data?.items.length) return null;

  return (
    <div>
      <h2 className="mb-2 font-medium capitalize">{state}</h2>
      <table className="w-full text-sm">
        <tbody>
          {data.items.map((j) => (
            <tr key={j.id} className="border-b">
              <td className="py-1">{j.name}</td>
              <td>{j.progress ? `${j.progress}%` : '—'}</td>
              <td>{j.duration ? `${j.duration}s` : ''}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
