import { api } from "@/lib/api";
import { AsyncStates } from "@/components/ui/AsyncStates";

export default async function Page({ params:{orgId} }: { params: { orgId: string } }) {
  const data = await api.getEcoLabelStats(orgId);
  if (!data.length) return <AsyncStates state="empty" message="No page views yet." />;
  return (
    <>
    <table className="w-full text-sm">
      <thead><tr><th>Route</th><th className="text-right">Avg g CO₂</th><th>Views</th></tr></thead>
      <tbody>
        {data.map(d=>(
          <tr key={d.route}>
            <td>{d.route}</td><td className="text-right">{d.avg.toFixed(2)}</td><td>{d.views}</td>
          </tr>
        ))}
      </tbody>
    </table>
    <pre className="mt-6 rounded bg-stone-100 p-3 text-xs">
{`<script src="${process.env.NEXT_PUBLIC_APP_URL}/widget/widget.js"
        data-org="${orgId}"></script>`}
    </pre>
    </>
  );
}
