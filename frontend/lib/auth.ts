import { getServerSession } from "next-auth/next";
import { authOptions }       from "../app/api/auth/[...nextauth]/route";
import type { Role }         from "@/types/role";

export async function getServerSessionWithRole() {
  const session = (await getServerSession(authOptions)) as
    | (Awaited<ReturnType<typeof getServerSession>> & { user?: { role?: Role } })
    | null;
  return session;
}
