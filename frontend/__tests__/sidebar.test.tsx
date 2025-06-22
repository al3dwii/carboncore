// __tests__/sidebar.test.tsx
import { describe, expect, test, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ──────────────────────────────────────────────
// mocks
// ──────────────────────────────────────────────

// 1) next/navigation ─ pathname & params used inside Sidebar
vi.mock('next/navigation', async () => {
  const actual = await vi.importActual<typeof import('next/navigation')>(
    'next/navigation'
  );
  return {
    ...actual,
    usePathname: () => '/org/org-123/dashboard',
    useParams:   () => ({ orgId: 'org-123' }),
  };
});

// 2) feature-flag hook ─ Advisor flag is ON
vi.mock('@/lib/useFlags', () => ({
  useFlags: () => ({
    data:       { advisor: true },
    isLoading:  false,
    isError:    false,
  }),
}));

// 3) Clerk ─ user with a role (value is irrelevant because we’ll also stub NAV_BY_ROLE)
vi.mock('@clerk/nextjs', () => ({
  useUser: () => ({
    user: {
      id:        'user-1',
      firstName: 'Ada',
      publicMetadata: { role: 'developer' },
    },
  }),
}));

// 4) navigation map ─ ensure role “developer” has an Advisor entry
vi.mock('@/lib/nav', () => ({
  NAV_BY_ROLE: {
    developer: [
      { label: 'Dashboard', href: '/dashboard' },
      { label: 'Ledger',    href: '/ledger'    },
      { label: 'IaC Advisor', href: '/advisor', flag: 'advisor' },
    ],
  },
}));

// ──────────────────────────────────────────────
// component *after* the mocks so it picks them up
// ──────────────────────────────────────────────
import { Sidebar } from '@/components/Sidebar';

// ──────────────────────────────────────────────
// test
// ──────────────────────────────────────────────
describe('<Sidebar />', () => {
  test('shows “IaC Advisor” item when Advisor flag is true', () => {
    const qc = new QueryClient();

    render(
      <QueryClientProvider client={qc}>
        <Sidebar />
      </QueryClientProvider>
    );

    // the item should now be present
    expect(screen.getByText(/IaC\s+Advisor/i)).toBeInTheDocument();
  });
});
