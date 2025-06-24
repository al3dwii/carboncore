// "use client";
// import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
// import { ReactNode, useState } from "react";
// import { Toaster } from "@/components/ui/sonner";

// export function Providers({ children }: { children: React.ReactNode }) {
//   const [client] = useState(() => new QueryClient());
//   return (
//     <QueryClientProvider client={client}>
//       {children}
//       <Toaster richColors position="top-right" />
//       {process.env.NODE_ENV === "development" && <ReactQueryDevtools />}
//     </QueryClientProvider>
//   );
// }

// app/providers.tsx
"use client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient());

  // Lazy-load DevTools in the browser *and* dev mode only
  useEffect(() => {
    if (process.env.NODE_ENV === "development") {
      import("@tanstack/react-query-devtools")
        .then((m) => m.ReactQueryDevtools?.({ initialIsOpen: false }))
        .catch(() => null);
    }
  }, []);

  return <QueryClientProvider client={client}>{children}</QueryClientProvider>;
}
