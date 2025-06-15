'use client';
import { useState } from 'react';
import { sdk } from '@carbon/sdk';
import { Button } from '@/components/ui/button';
import PageWrapper from '@/components/PageWrapper';

export default function EcoShift() {
  const [suggestion, setSug] = useState<any>(null);
  const [form, set] = useState({ vcpu: 4, hrs: 2, earliest: 'now', latest: '+6h' });

  async function handle() {
    const res = await sdk.ecoshift__suggest(form);
    setSug(res);
  }

  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">EcoShift Scheduler</h1>
      <div className="grid gap-4 mb-6 max-w-sm">
        {['vcpu', 'hrs', 'earliest', 'latest'].map(k => (
          <input className="input"
            key={k}
            value={form[k]}
            onChange={e => set({ ...form, [k]: e.target.value })}
            placeholder={k}
          />
        ))}
        <Button onClick={handle}>Suggest window</Button>
      </div>
      {suggestion && (
        <pre className="bg-muted rounded p-4 text-xs">{JSON.stringify(suggestion, null, 2)}</pre>
      )}
    </PageWrapper>
  );
}
