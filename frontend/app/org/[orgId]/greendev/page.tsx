import { notFound } from 'next/navigation';
import PageWrapper from '@/components/PageWrapper';
import { Chat } from '@/components/greendev/Chat';
import { Suspense } from 'react';
import { Loading } from '@/components/Loading';

export default function Page({ params: { orgId } }: { params: { orgId: string } }) {
  if (!orgId) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <PageWrapper>
        <h1 className="mb-6 text-2xl font-bold">GreenDev Bot 🤖</h1>
        <Chat orgId={orgId} />
      </PageWrapper>
    </Suspense>
  );
}
