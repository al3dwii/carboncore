import KpiTile from '@/components/kpi/KpiTile';
import AlertBanner from '@/components/AlertBanner';
import QuickActions from '@/components/QuickActions';
import PageWrapper from '@/components/PageWrapper';
import { request } from '@/lib/request';
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  ResponsiveContainer, Tooltip
} from 'recharts';

async function getStats() {
  return request('/api/dashboard');
}

export default async function Dashboard() {
  const { alerts_unresolved, kpi, trend, by_tool } = await getStats() as any;

  return (
    <PageWrapper>
      <AlertBanner count={alerts_unresolved} />
      <QuickActions />

      {/* KPI tiles */}
      <div className="flex flex-wrap gap-3 mb-6">
        {kpi?.map((t: any) => (
          <KpiTile key={t.id} label={t.label} value={t.value} />
        ))}
      </div>

      {/* Charts */}
      {trend && (
        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-surface rounded-xl p-4">
            <h2 className="text-sm mb-2">Cumulative CO₂ avoided</h2>
            <div className="w-full h-[220px] xs:h-[260px] md:h-[320px]">
              <ResponsiveContainer>
                <LineChart data={trend}>
                  <XAxis dataKey="date" hide />
                  <YAxis hide />
                  <Tooltip />
                  <Line type="monotone" dataKey="co2_kg" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-surface rounded-xl p-4">
            <h2 className="text-sm mb-2">Savings by tool</h2>
            <div className="w-full h-[220px] xs:h-[260px] md:h-[320px]">
              <ResponsiveContainer>
                <BarChart data={by_tool}>
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
