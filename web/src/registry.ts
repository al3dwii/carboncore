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
  }
] as const;
