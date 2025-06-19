import "../styles/globals.css";
import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export const metadata = { title: "CarbonCore Console" };

export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-cc-base text-white">
        <ThemeProvider attribute="class" defaultTheme="dark">
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
