// ✅ 1.  Always import from the /server entry-point inside server code
import { currentUser } from "@clerk/nextjs/server";
export async function getRole(): Promise<"ops" | "dev" | "analyst" | "user"> {
  const user = await currentUser();
  return (user?.publicMetadata?.role as any) ?? "user";
}
