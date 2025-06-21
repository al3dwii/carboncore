import { fetchKpis } from '@/lib/kpi-api';
import { getActiveOrgId } from '@/lib/org';
import { notFound } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default async function Dashboard({
  params,
}: {
  params: { orgId: string };
}) {
  const orgId = getActiveOrgId(params.orgId);
  if (!orgId) notFound();
  const kpis = await fetchKpis(orgId);

  return (
    <div className="space-y-6">
      <h1 className="font-bold text-lg">Dashboard</h1>
      <ul className="grid grid-cols-2 gap-4">
        {kpis.items.map((k: any) => (
          <li key={k.name} className="border rounded p-4">
            <p className="text-muted-foreground text-sm">{k.name}</p>
            <p className="text-2xl font-bold">{k.value}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
