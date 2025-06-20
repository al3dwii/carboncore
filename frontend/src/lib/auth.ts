// ✅ 1.  Always import from the /server entry-point inside server code
import { auth, clerkClient } from "@clerk/nextjs/server";

type Role = "admin" | "developer" | "viewer";

/** Returns the signed-in user together with your app-specific role. */
export async function getUserWithRole() {
  // ✅ 2.  auth() is synchronous here – do NOT await it
  const { userId, orgId, getToken } = auth();
  if (!userId) return null;

  // ✅ 3.  clerkClient is the real object – `.users` exists
  const user = await clerkClient.users.getUser(userId);
  const role = (user.privateMetadata.role ?? "developer") as Role;

  return { userId, orgId, role, getToken };
}
