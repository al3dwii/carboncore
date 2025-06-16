export const NAV_BY_ROLE = {
  developer: [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/ledger", label: "Ledger", icon: "📜" },
    { href: "/scheduler", label: "Scheduler", icon: "⏱" }
  ],
  finops: [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/ledger", label: "Ledger", icon: "📜" },
    { href: "/budget", label: "Budget", icon: "💶" }
  ],
  sustainability: [
    { href: "/dashboard", label: "Dashboard", icon: "📊" },
    { href: "/ledger", label: "Ledger", icon: "📜" },
    { href: "/reports", label: "Reports", icon: "📄" }
  ],
  admin: [{ href: "/settings", label: "Settings", icon: "⚙️" }]
} as const;

export type Role = keyof typeof NAV_BY_ROLE;
