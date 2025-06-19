"use client";
import { SessionProvider } from "next-auth/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "sonner";
import { PropsWithChildren, useState } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export default function Providers({ children }: PropsWithChildren) {
  const [qc] = useState(() => new QueryClient());

  return (
    <SessionProvider>
      <QueryClientProvider client={qc}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
        <Toaster richColors position="top-right" />
      </QueryClientProvider>
    </SessionProvider>
  );
}
