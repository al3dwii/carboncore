import * as Lucide from 'lucide-react';
import { ComponentProps } from 'react';
export function Icon({
  name,
  ...props
}: { name: keyof typeof Lucide } & ComponentProps<'svg'>) {
  const LucideIcon = Lucide[name];
  return <LucideIcon aria-hidden className="w-4 h-4" {...props} />;
}
