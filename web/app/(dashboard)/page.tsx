'use client';
import KpiTile from '@/src/components/KpiTile';
import { useStats } from '@/hooks/useStats';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import PageWrapper from '@/components/PageWrapper';

export default function Dashboard() {
  const { data, isLoading } = useStats();
  const tiles = [
    { label: 'CO₂ avoided (kg)', value: data?.co2_kg?.toLocaleString() },
    { label: '$ saved', value: '$' + (data?.usd_saved ?? 0).toLocaleString() },
    { label: 'Active plug-ins', value: data?.plugins ?? 0 },
    { label: 'PRs analysed', value: data?.prs ?? 0 },
  ];
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-6">Overview</h1>
      <div className="flex flex-wrap gap-3 mb-6">
        {tiles.map(t => (
          <KpiTile key={t.label} label={t.label} value={String(t.value)} icon={null} />
        ))}
      </div>

      {data && (
        <section className="grid lg:grid-cols-2 gap-6">
          {/* cumulative */}
          <div className="bg-surface rounded-xl p-4">
            <h2 className="text-sm mb-2">Cumulative CO₂ avoided</h2>
            <div className="w-full h-[220px] xs:h-[260px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.trend}>
                <XAxis dataKey="date" hide />
                <YAxis hide />
                <Tooltip />
                <Line type="monotone" dataKey="co2_kg" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
            </div>
          </div>

          {/* by tool */}
          <div className="bg-surface rounded-xl p-4">
            <h2 className="text-sm mb-2">Savings by tool</h2>
            <div className="w-full h-[220px] xs:h-[260px] md:h-[320px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.by_tool}>
                <XAxis dataKey="tool" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="co2_kg" />
              </BarChart>
            </ResponsiveContainer>
            </div>
          </div>
        </section>
      )}
    </PageWrapper>
  );
}
