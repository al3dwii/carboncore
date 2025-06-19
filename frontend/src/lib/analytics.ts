import posthog from 'posthog-js';
export function initAnalytics() {
  if (process.env.NEXT_PUBLIC_PH_ENABLED !== 'true') return;
  if (typeof window !== 'undefined' && localStorage.getItem('cc.consent') !== 'yes') return;
  posthog.init(process.env.NEXT_PUBLIC_PH_KEY!, {
    api_host: process.env.NEXT_PUBLIC_PH_HOST,
    capture_pageview: false,
  });
}
export const analytics = {
  page: (path:string) => posthog.capture('$pageview', { path }),
  event: (name:string, props={}) => posthog.capture(name, props),
};
