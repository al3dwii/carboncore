'use client';
import { cn } from '@/lib/utils';

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement> & { variant?: string };

export default function Badge({ className, variant = 'default', ...props }: BadgeProps) {
  const styles: Record<string, string> = {
    destructive: 'bg-red-500 text-white',
    secondary: 'bg-gray-200 text-gray-800',
    outline: 'border border-gray-300',
    default: 'bg-gray-100 text-gray-800',
  };
  return (
    <span className={cn('px-2 py-0.5 rounded text-xs', styles[variant] ?? styles.default, className)} {...props} />
  );
}
