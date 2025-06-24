import { Icons } from "@/components/ui/Icons";

export type NavItem = {
  href: string;
  label: string;
  icon: keyof typeof Icons;
  flag?: string;       // optional LaunchDarkly flag
};

export const NAV_BY_ROLE: Record<string, NavItem[]> = {
  developer: [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/router",    label: "Router",    icon: "router",    flag: "router" },
    { href: "/pulse",     label: "Pulse",     icon: "pulse",     flag: "pulse"  },
    { href: "/ledger",    label: "Ledger",    icon: "ledger" },
    { href: "/scheduler", label: "Scheduler", icon: "scheduler", flag: "scheduler" },
    { href: "/iac-advisor",label:"IaC Advisor",icon:"iac-advisor",flag:"iac-advisor"},
    { href: "/greendev",  label: "GreenDev Bot", icon: "greendev", flag: "greendev"},
  ],
  finops: [
    { href: "/dashboard", label: "Dashboard", icon: "dashboard" },
    { href: "/ledger",    label: "Ledger",    icon: "ledger" },
    { href: "/budget",    label: "Budget",    icon: "budget" },
    { href: "/offsets",   label: "Offsets",   icon: "offsets" },
  ],
};
