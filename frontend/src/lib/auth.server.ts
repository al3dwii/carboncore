import { currentUser, clerkClient } from '@clerk/nextjs/server';

export type Role = 'ops' | 'dev' | 'analyst';

export async function getUserWithRole() {
  const user = await currentUser();
  if (!user) return null;

  //  \u2199 tweak this to wherever you store the role
  const role = (user.publicMetadata.role as Role | undefined) ?? 'analyst';
  return { id: user.id, role };
}

export async function getRole(): Promise<Role> {
  return (await getUserWithRole())?.role ?? 'analyst';
}
