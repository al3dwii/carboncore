import { cookies } from 'next/headers';

/** Return the orgId that the user is “inside”.
 *  – first try `[orgId]` param from the route
 *  – else read `cc_org` cookie (set after picker)
 *  – else fall back to '' so the UI still renders   */
export function getActiveOrgId(param?: string | string[]): string {
  if (typeof param === 'string' && param) return param;
  const c = cookies().get('cc_org')?.value;
  return c ?? '';
}
