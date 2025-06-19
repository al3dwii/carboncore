import { auth } from "next-auth";
import type { Role } from "@/types/role";

export async function getServerSessionWithRole() {
  const session = (await auth()) as (Awaited<ReturnType<typeof auth>> & {
    user?: { role?: Role };
  });
  return session;
}
