import dynamic from "next/dynamic";
const ReportWizard = dynamic(() => import("@/components/comply/ReportWizard").then(m => m.ReportWizard), { ssr: false });

export default function ReportsPage() {
  return (
    <section>
      <h1 className="text-2xl font-bold mb-6">CarbonComply Report Wizard</h1>
      <ReportWizard />
    </section>
  );
}
