import { NavLink } from '@/components/ui/nav-link';
import { Icon } from '@/components/Icon';
import { useLDClient } from 'launchdarkly-react-client-sdk';
const items = [
  { id: 'dashboard', label: 'Dashboard', icon: 'BarChart3', href: '/' },
  { id: 'ledger', label: 'Ledger', icon: 'List', href: '/ledger' },
  { id: 'eco-shift', label: 'EcoShift', icon: 'Leaf', href: '/eco-shift' },
];
export function Sidebar() {
  const ld = useLDClient();
  return (
    <aside className="fixed inset-y-0 w-56 bg-surface border-r px-4 pt-6">
      <h1 className="text-xl font-bold mb-8">CarbonCore</h1>
      <nav className="space-y-1">
        {items.map((i) =>
          ld?.variation(`${i.id}.enabled`, true) ? (
            <NavLink key={i.id} href={i.href}>
              <Icon name={i.icon} className="mr-2" /> {i.label}
            </NavLink>
          ) : null,
        )}
      </nav>
    </aside>
  );
}
