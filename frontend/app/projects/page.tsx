'use client';
import PageWrapper from '@/components/PageWrapper';
import { DataTable } from '@/components/table/DataTable';
import { ColumnDef } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { request } from '@/lib/client';

type Project = any;

const columns: ColumnDef<Project>[] = [
  { header: 'Name', accessorKey: 'name' },
  { header: 'Repo', accessorKey: 'repo_url' },
  { header: 'CO₂ saved', accessorKey: 'co2_kg' },
  { header: '$ saved', accessorKey: 'usd_saved' },
];

export default function ProjectsPage() {
  const { data, isLoading } = useQuery<any>({
    queryKey: ['projects'],
    queryFn: () => request('/projects', 'get', {} as any),
  });
  return (
    <PageWrapper>
      <h1 className="text-lg font-medium mb-6">Projects</h1>
      {isLoading ? 'Loading…' : <DataTable {...({ columns, data: data?.items ?? [] } as any)} />}
    </PageWrapper>
  );
}
