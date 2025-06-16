"use client";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect } from "react";

export function AuthGuard({ children }: { children: ReactNode }) {
  const { status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace(`/api/auth/signin?callbackUrl=${pathname}`);
    }
  }, [status, pathname, router]);

  if (status !== "authenticated") {
    return null;
  }
  return <>{children}</>;
}
