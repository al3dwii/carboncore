export type NavItem = { href: string; label: string; icon: string; flag?: string };

export const NAV_BY_ROLE: Record<string, NavItem[]> = {
  developer: [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/router", label: "Router", icon: "🗺", flag: "router" },
    { href: "/ledger", label: "Ledger", icon: "📜" },
    { href: "/scheduler", label: "Scheduler", icon: "⏱", flag: "scheduler" }
  ],
  finops: [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/ledger", label: "Ledger", icon: "📜" },
    { href: "/budget", label: "Budget", icon: "💶", flag: "budget" }
  ],
  sustainability: [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/ledger", label: "Ledger", icon: "📜" },
    { href: "/reports", label: "Reports", icon: "📄" }
  ],
  admin: [{ href: "/settings", label: "Settings", icon: "⚙️" }]
} as const;

export type Role = keyof typeof NAV_BY_ROLE;
