'use client';
import { ErrorBoundary } from 'react-error-boundary';
import { Badge } from '@/components/ui/badge';
export function PlugInWrapper({
  id,
  children,
}: {
  id: string;
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary
      fallback={
        <Badge variant="destructive" className="m-4">
          {id} offline
        </Badge>
      }
    >
      {children}
    </ErrorBoundary>
  );
}
