import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ReactNode } from 'react';
export function NavLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const active = pathname === href;
  return (
    <Link
      href={href}
      className={
        'flex items-center rounded px-2 py-1 text-sm hover:bg-muted ' +
        (active ? 'bg-muted font-medium' : '')
      }
    >
      {children}
    </Link>
  );
}
