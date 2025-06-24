import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Shell } from "@/components/Shell";
import Providers from "@/components/Providers";
import { OrgProvider } from "@/contexts/OrgContext";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <OrgProvider>
            <Providers>
              <Shell>{children}</Shell>
            </Providers>
          </OrgProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
