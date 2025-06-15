'use client';
import { useState } from 'react';
import PageWrapper from '@/components/PageWrapper';
import { sdk } from '@carbon/sdk';
import { Button } from '@/components/ui/button';

export default function Comply() {
  const [year, setYear] = useState('2025');
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">CarbonComply export</h1>
      <input
        value={year}
        onChange={e => setYear(e.target.value)}
        type="number"
        className="input w-24 mr-2"
      />
      <Button
        onClick={() => window.open(`/comply/xlsx?year=${year}`, '_blank')}
      >
        Download XLSX
      </Button>
    </PageWrapper>
  );
}
