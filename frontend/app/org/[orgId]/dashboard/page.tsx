import { fetchKpis } from '@/lib/kpi-api';
import { notFound } from 'next/navigation';
import { Suspense } from 'react';
import { Loading } from '@/components/Loading';

export const dynamic = 'force-dynamic';

export default function DashboardPage({ params }: { params: { orgId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <Content orgId={params.orgId} />
    </Suspense>
  );
}

async function Content({ orgId }: { orgId: string }) {
  if (!orgId) notFound();
  const kpis = await fetchKpis(orgId);
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-bold">Dashboard</h1>
      <ul className="grid grid-cols-2 gap-4">
        {kpis.items.map((k: any) => (
          <li key={k.name} className="rounded border p-4">
            <p className="text-muted-foreground text-sm">{k.name}</p>
            <p className="text-2xl font-bold">{k.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
