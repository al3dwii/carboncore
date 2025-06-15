import { Skeleton } from '@/components/ui/skeleton';
export function Tile({
  label,
  value,
  loading,
}: {
  label: string;
  value: React.ReactNode;
  loading?: boolean;
}) {
  return (
    <div className="rounded-xl bg-surface p-6 shadow-sm flex flex-col">
      <span className="text-sm text-muted-foreground">{label}</span>
      {loading ? (
        <Skeleton className="h-8 w-24 mt-2" />
      ) : (
        <span className="text-2xl font-semibold mt-2">{value}</span>
      )}
    </div>
  );
}
