import "./globals.css";
import { Inter }        from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { Providers }     from "./providers";
import { Shell }         from "@/components/Shell";
import { OrgProvider }   from "@/contexts/OrgContext";

const inter = Inter({ subsets:["latin"], variable:"--font-inter" });

export const metadata  = { title: "CarbonCore Console" };
export const viewport  = { width:1024, initialScale:1 };

export default function RootLayout({ children }: { children:React.ReactNode }){
  return (
    <ClerkProvider>
      <html lang="en" className={inter.variable}>
        <body className="bg-gray-50 text-gray-800 antialiased">
          <Providers>
            <OrgProvider>
              <Shell>{children}</Shell>
            </OrgProvider>
          </Providers>
        </body>
      </html>
    </ClerkProvider>
  );
}
