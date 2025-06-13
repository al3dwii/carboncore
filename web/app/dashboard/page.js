'use client';
import useSWR from 'swr';
import { Card, CardContent } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';

const fetcher = (url) =>
  fetch(url, { headers: { 'x-project-token': 'demo' } }).then((r) => r.json());

export default function SavingsChart() {
  const { data } = useSWR('/events/?limit=100', fetcher);
  const { data: shifted } = useSWR(
    '/events?kind=ecs_shift&aggregate=count',
    fetcher
  );
  const { data: co2 } = useSWR(
    '/events?field=meta.kg_co2&aggregate=sum',
    fetcher
  );
  if (!data) return 'Loading…';

  return (
    <div className="m-6 space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">
          Jobs shifted — <span id="shifted">{shifted ? shifted.count : '…'}</span>
        </div>
        <div className="p-4 border rounded">
          kg CO₂ avoided —{' '}
          <span id="co2">
            {co2 ? ((co2.sum || 0).toFixed(1)) : '…'}
          </span>
        </div>
      </div>
      <Card>
        <CardContent>
          <Bar
            data={{
              labels: data.items.map((e) =>
                new Date(e.timestamp).toLocaleDateString()
              ),
              datasets: [
                {
                  label: 'kg CO₂ saved',
                  data: data.items.map((e) => e.kg_co2_saved),
                },
              ],
            }}
            options={{ responsive: true }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
