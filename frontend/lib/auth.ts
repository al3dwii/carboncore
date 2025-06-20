import { auth } from "@clerk/nextjs/server";

export async function getUserWithRole() {
  const { userId, getToken } = await auth();
  if (!userId) return null;
  return { userId, role: "developer", getToken };
}
