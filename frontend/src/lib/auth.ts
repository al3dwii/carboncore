// frontend/src/lib/auth.ts
// ───────────────────────────────────────────────────────────
// All helpers here run **only on the server**.

import { cache } from 'react';
import { currentUser } from '@clerk/nextjs/server';

/** What the rest of the app needs to know about the signed-in user */
export type Session = {
  id: string;
  email: string;
  role: string;         // "dev", "ops", "analyst", …
};

/** Cached fetch so layouts don’t re-hit Clerk on each request */
export const getUserWithRole = cache(async (): Promise<Session | null> => {
  const user = await currentUser().catch(() => null);
  if (!user) return null;

  const role =
    (user.publicMetadata?.role as string | undefined) ||
    (user.privateMetadata?.role as string | undefined) ||
    'developer';

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress ?? '',
    role,
  };
});

// append to the bottom of src/lib/auth.ts
export const getRole = cache(async (): Promise<string> => {
  return (await getUserWithRole())?.role ?? "viewer";
});
