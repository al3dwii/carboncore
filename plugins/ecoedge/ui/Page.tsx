'use client';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '@carbon/sdk';
import PageWrapper from '@/components/PageWrapper';
import dynamic from 'next/dynamic';
const Map = dynamic(() => import('react-simple-maps').then(m => m.ComposableMap), { ssr: false });

export default function Edge() {
  const { data } = useQuery({ queryKey: ['edge'], queryFn: () => sdk.edge__heatmap() });
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">EcoEdge Router</h1>
      {!data ? 'Loading…' : (
        <Map>
          {data.nodes.map(n => (
            <circle key={n.id} cx={n.x} cy={n.y} r={4} fill={n.green ? 'green' : 'red'} />
          ))}
        </Map>
      )}
    </PageWrapper>
  );
}
