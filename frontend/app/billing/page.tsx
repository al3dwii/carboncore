'use client';
import PageWrapper from '@/components/PageWrapper';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';

export default function Billing() {
  const [url, setUrl] = useState<string | null>(null);
  const data: any[] = [];
  useEffect(() => {
    loadStripe(process.env.NEXT_PUBLIC_STRIPE_KEY!).then(s =>
      setUrl((s as any).getCheckoutIframeUrl?.() ?? '/stripe/placeholder'),
    );
  }, []);
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-6">Billing & usage</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <iframe src={url ?? ''} className="w-full h-[600px] rounded-xl border" />
        <table className="text-sm w-full">
          <thead>
            <tr><th>Event</th><th>Count</th></tr>
          </thead>
          <tbody>
            {data?.map(r => (
              <tr key={r.kind}><td>{r.kind}</td><td>{r.count}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </PageWrapper>
  );
}
