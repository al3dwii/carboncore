'use client';
import PageWrapper from '@/components/PageWrapper';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '@carbon/sdk';

export default function EcoLabel() {
  const { data } = useQuery({ queryKey:['label'], queryFn: () => sdk.ecolabel__views() });
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">EcoLabel views</h1>
      <pre className="text-xs bg-muted p-4 rounded">{JSON.stringify(data, null, 2)}</pre>
    </PageWrapper>
  );
}
