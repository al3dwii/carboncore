import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { Shell } from "@/components/Shell";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <Shell>{children}</Shell>
        </ClerkProvider>
      </body>
    </html>
  );
}
