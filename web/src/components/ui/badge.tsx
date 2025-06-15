import { cn } from '@/lib/utils';
export function Badge({
  className,
  variant = 'default',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  variant?: 'default' | 'destructive';
}) {
  return (
    <div
      className={cn(
        'inline-flex items-center rounded px-2 py-1 text-xs font-medium',
        variant === 'destructive'
          ? 'bg-red-600 text-white'
          : 'bg-gray-200 text-black',
        className,
      )}
      {...props}
    />
  );
}
