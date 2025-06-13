export const registry = [
  {
    id: "core",
    sidebar: "Core",
    routes: [
      { component: "dashboard/CoreDashboard", path: "/", id: "core" }
    ]
  },
  {
    id: "eco-shift",
    sidebar: "EcoShift Scheduler",
    icon: "Clock4",
    routes: [
      { component: "ShiftPage", path: "/tool/eco-shift", id: "eco-shift" }
    ]
  },
  {
    id: "carbon-comply",
    sidebar: "CarbonComply",
    icon: "FileSpreadsheet",
    routes: [
      { component: "ComplyPage", path: "/tool/carbon-comply", id: "carbon-comply" }
    ]
  },
  {
    id: "edge-router",
    sidebar: "Edge Router",
    icon: "Share2",
    routes: [
      { component: "EdgePage", path: "/tool/edge-router", id: "edge-router" }
    ]
  }
  ,{
    id: "budget-copilot",
    sidebar: "Budget Copilot",
    icon: "TrendingDown",
    routes:[{component: "BudgetPage", path: "/tool/budget", id: "budget-copilot"}]
  }
] as const;
