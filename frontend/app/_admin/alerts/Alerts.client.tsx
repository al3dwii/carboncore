'use client';

import { useAlerts, snooze } from '@/lib/useAlerts';
import { useSearchParams, useRouter } from 'next/navigation';
import  Button  from '@/components/ui/Button';
import { SeverityPill } from '@/components/SeverityPill';

export default function AlertsClient() {
  const params = useSearchParams();
  const router = useRouter();
  const sev = params.get('sev') ?? '';
  const { data } = useAlerts({ sev });

  const toggle = (s: string) =>
    router.replace(`/alerts?sev=${s === sev ? '' : s}`);

  return (
    <div className="space-y-4">
      <h1 className="text-lg font-bold">Alerts</h1>

      <div className="flex gap-2">
        {['critical', 'major', 'minor'].map(s => (
          <Button
            key={s}
            variant={s === sev ? 'default' : 'outline'}
            onClick={() => toggle(s)}
          >
            {s}
          </Button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b">
            <th>Severity</th>
            <th>Message</th>
            <th>Date</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {data?.items.map(a => (
            <tr key={a.id} className="border-b">
              <td>
                <SeverityPill sev={a.sev} />
              </td>
              <td>{a.msg}</td>
              <td>{new Date(a.ts).toLocaleString()}</td>
              <td>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => snooze(a.id)}
                >
                  Snooze
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
