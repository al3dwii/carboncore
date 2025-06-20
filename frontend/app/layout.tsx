import "./globals.css";
import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ReactQueryStreamedHydration } from "@tanstack/react-query-next-experimental";
import { Providers } from "./providers";
import { Shell } from "@/components/Shell";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata = { title: "CarbonCore Console", viewport: "width=device-width, initial-scale=1" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="bg-gray-50 text-gray-800 antialiased">
          <Providers>
            <Shell>{children}</Shell>
          </Providers>
          <ReactQueryStreamedHydration />
        </body>
      </html>
    </ClerkProvider>
  );
}

