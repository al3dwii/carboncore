import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen dark:bg-bg bg-bg">
      <Sidebar />
      <Topbar />
      <main className="pl-60 pt-16 p-6">{children}</main>
    </div>
  );
}
