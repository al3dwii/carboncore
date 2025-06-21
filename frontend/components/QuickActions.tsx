import { Button } from '@/components/ui';
export default function QuickActions() {
  const actions = [
    { href: '/events?q=error', label: 'View Errors' },
    { href: '/alerts', label: 'Open Alerts' },
    { href: '/jobs', label: 'Job Queue' },
  ];
  return (
    <div className="flex gap-3">
      {actions.map(a => (
        <Button asChild key={a.href}>
          <a href={a.href}>{a.label}</a>
        </Button>
      ))}
    </div>
  );
}
