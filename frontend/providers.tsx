"use client";
import { ClerkProvider }                from "@clerk/nextjs";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { PropsWithChildren, useState }  from "react";

export default function Providers({ children }: PropsWithChildren) {
  const [qc] = useState(() => new QueryClient());
  return (
    <ClerkProvider>
      <QueryClientProvider client={qc}>{children}</QueryClientProvider>
    </ClerkProvider>
  );
}
