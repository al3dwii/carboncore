'use client';
import { useEffect, useState } from 'react';
import PageWrapper from '@/components/PageWrapper';

export default function Page() {
  const [rows, setRows] = useState<any[]>([]);
  useEffect(() => {
    fetch('/iac-advisor/recent')
      .then(r => r.json())
      .then(setRows);
  }, []);
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">IaC Advisor results</h1>
      <pre className="bg-muted rounded p-4 text-xs">{JSON.stringify(rows, null, 2)}</pre>
    </PageWrapper>
  );
}
