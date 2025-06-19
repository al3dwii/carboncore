import Providers from "../providers";
import Sidebar from "@/components/Sidebar";
import { cn } from "@/components/ui";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex h-screen w-screen overflow-hidden">
        <Sidebar />
        <main className={cn("flex-1 overflow-y-auto bg-gray-50 p-6")}>{children}</main>
      </div>
    </Providers>
  );
}
