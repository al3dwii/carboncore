import "./globals.css";
import { Inter }        from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers }     from "./providers";
import { Shell }         from "@/components/Shell";

const inter = Inter({ subsets:["latin"], variable:"--font-inter" });

export const metadata  = { title: "CarbonCore Console" };
export const viewport  = { width:1024, initialScale:1 };

export default function RootLayout({ children }: { children:React.ReactNode }){
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="antialiased bg-gray-50 text-gray-800">
          <Providers>
            <Shell>{children}</Shell>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
