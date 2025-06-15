'use client';
import { sdk } from '@carbon/sdk';
import useSWR from 'swr';
import PageWrapper from '@/components/PageWrapper';

export default function GreenDev() {
  const { data } = useSWR('leaderboard', () => sdk.advice__leaderboard());
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">GreenDev Leaderboard</h1>
      {!data ? 'Loading…' : (
        <table className="text-sm">
          <thead><tr><th>Developer</th><th>KG saved</th></tr></thead>
          <tbody>
            {data.map(r => (
              <tr key={r.dev}>
                <td>{r.dev}</td><td>{r.kg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </PageWrapper>
  );
}
