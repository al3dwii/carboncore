import { auth }         from "@clerk/nextjs";
import type { Role }     from "@/types/role";

export async function getUserWithRole() {
  const { userId, sessionId, orgId, getToken } = auth();
  if (!userId) return null;

  const role: Role = "developer";
  return { userId, role, getToken };
}
