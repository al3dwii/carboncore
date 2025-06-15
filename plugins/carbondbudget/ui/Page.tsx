'use client';
import { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { sdk } from '@carbon/sdk';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/components/ui/button';

export default function Budget() {
  const [cap, setCap] = useState(1000);
  const [data, setData] = useState<any[]>([]);

  async function run() {
    const res = await sdk.budget__forecast({ cap_tco2: cap });
    setData(res.points);
  }

  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">Budget Copilot</h1>
      <input value={cap} onChange={e => setCap(+e.target.value)} className="input w-28 mr-2" />
      <Button onClick={run}>Forecast</Button>

      {data.length > 0 && (
        <div className="mt-6 bg-surface p-4 rounded">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={data}>
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line dataKey="remaining" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}
    </PageWrapper>
  );
}
