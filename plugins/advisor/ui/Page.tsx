'use client';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '@carbon/sdk';
import PageWrapper from '@/components/PageWrapper';

export default function Advisor() {
  const { data } = useQuery({ queryKey:['diffs'], queryFn: () => sdk.advisor__recent() });
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">IaC Advisor results</h1>
      <pre className="bg-muted rounded p-4 text-xs">{JSON.stringify(data, null, 2)}</pre>
    </PageWrapper>
  );
}
