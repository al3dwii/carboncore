import { ReactNode, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";

export default function PlugInWrapper({ id, children }: { id: string; children: ReactNode }) {
  const [offline, setOffline] = useState(false);
  if (offline) {
    return <div className="p-4 text-gray-500 bg-gray-100 rounded">Plug-in offline</div>;
  }
  return (
    <ErrorBoundary fallback={<div>Plug-in offline</div>} onError={() => setOffline(true)}>
      {children}
    </ErrorBoundary>
  );
}
