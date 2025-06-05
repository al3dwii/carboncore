'use client';
import useSWR from 'swr';
import { Card, CardContent } from '@/components/ui/card';
import { Bar } from 'react-chartjs-2';

export default function SavingsChart() {
  const { data } = useSWR('/events/?limit=100', (url) =>
    fetch(url, { headers: { 'x-project-token': 'demo' } }).then((r) => r.json())
  );
  if (!data) return 'Loading…';

  return (
    <Card className="m-6">
      <CardContent>
        <Bar
          data={{
            labels: data.items.map((e) =>
              new Date(e.timestamp).toLocaleDateString()
            ),
            datasets: [
              { label: 'kg CO₂ saved', data: data.items.map((e) => e.kg_co2_saved) },
            ],
          }}
          options={{ responsive: true }}
        />
      </CardContent>
    </Card>
  );
}
