"use client";
import { ThemeProvider }                        from "next-themes";
import { SessionProvider }                      from "next-auth/react";
import { QueryClient, QueryClientProvider }     from "@tanstack/react-query";
import { Toaster }                              from "sonner";
import { PropsWithChildren, useState }          from "react";

export default function Providers({ children }: PropsWithChildren) {
  const [qc] = useState(() => new QueryClient());
  return (
    <SessionProvider>
      <QueryClientProvider client={qc}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
          <Toaster richColors position="top-right" />
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
