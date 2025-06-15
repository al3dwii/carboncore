'use client';
import PageWrapper from '@/components/PageWrapper';
import { useQuery } from '@tanstack/react-query';
import { sdk } from '@carbon/sdk';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';

export default function Pulse() {
  const { data } = useQuery({ queryKey:['suppliers'], queryFn: () => sdk.suppliers__list() });
  const cols: ColumnDef<any>[] = [
    { header:'Name', accessorKey:'name' },
    { header:'URL', accessorKey:'url' },
    { header:'gCO₂', accessorKey:'gco2' },
    { header:'SLA', accessorKey:'sla_gco2' },
  ];
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-4">Supplier Pulse</h1>
      {data && <DataTable columns={cols} data={data.items} />}
    </PageWrapper>
  );
}
