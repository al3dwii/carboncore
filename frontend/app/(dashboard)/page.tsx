import { Suspense } from 'react';
import AlertBanner from '@/components/AlertBanner';
import QuickActions from '@/components/QuickActions';
import { useStats } from '@/lib/useStats';
import PageWrapper from '@/components/PageWrapper';

async function getStats() {
  const { request } = await import('@/lib/api');
  return request('/api/dashboard');
}

export default async function Dashboard() {
  const stats = await getStats();
  const { alerts_unresolved } = stats as any;
  return (
    <PageWrapper>
      <AlertBanner count={alerts_unresolved} />
      <QuickActions />
      {/* KPI grid … */}
    </PageWrapper>
  );
}
