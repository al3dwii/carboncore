'use client';
import PageWrapper from '@/components/PageWrapper';
import { useState } from 'react';
import { FilterBar } from '@/components/ledger/FilterBar';
import dynamic from 'next/dynamic';
import { sdk } from '@/lib/sdk';

const Ace = dynamic(async () => (await import('react-ace')).default, { ssr: false });
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/theme-tomorrow';

export default function LedgerPage() {
  const [query, setQuery] = useState('from=2025-01-01');
  const { data } = sdk.useLedger__listQuery(query);
  const json = JSON.stringify(data?.items ?? [], null, 2);
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">Ledger Explorer</h1>
      <FilterBar onChange={setQuery} />
      <Ace
        mode="json"
        theme="tomorrow"
        name="ledger"
        value={json}
        readOnly
        width="100%"
        height="400px"
      />
      <button
        className="btn mt-4"
        onClick={() => window.open(`/ledger/csv?${query}`, '_blank')}
      >
        Download CSV
      </button>
    </PageWrapper>
  );
}
