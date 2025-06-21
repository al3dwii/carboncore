import { currentUser } from '@clerk/nextjs/server';

export type Role = 'ops' | 'analyst' | 'developer';
export interface Session {
  id: string;
  email: string;
  role: Role;
}

export async function getUserWithRole(): Promise<Session | null> {
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? '',
    role: (user.publicMetadata.role as Role) ?? 'developer',
  };
}

export async function getRole(): Promise<Role> {
  return (await getUserWithRole())?.role ?? 'developer';
}
