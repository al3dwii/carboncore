import { getServerSession } from "next-auth";
import type { Role } from "@/types/roles";

export async function getServerSessionWithRole() {
  const session = (await getServerSession()) as (Awaited<ReturnType<typeof getServerSession>> & {
    user?: { role?: Role };
  });
  return session;
}
