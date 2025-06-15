'use client';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '@carbon/sdk';
import PageWrapper from '@/components/PageWrapper';
import { Button } from '@/components/ui/button';

export default function Offset() {
  const { data, refetch } = useQuery({ queryKey:['offsets'], queryFn: () => sdk.offsets__list() });
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">Offset certificates</h1>
      <Button size="sm" onClick={() => sdk.offsets__buy().then(() => refetch())}>Buy now</Button>
      <ul className="mt-4 list-disc ml-6">
        {data?.map(c => <li key={c.id}>{c.marketplace_id} – {c.kg} kg</li>)}
      </ul>
    </PageWrapper>
  );
}
