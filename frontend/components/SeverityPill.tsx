import { Badge } from '@/components/ui';
export const SeverityPill = ({ sev }: { sev: string }) => {
  const map: Record<string, string> = { critical: 'destructive', major: 'secondary', minor: 'outline' };
  return <Badge variant={map[sev] ?? 'default'}>{sev}</Badge>;
};
