// re-export whichever file *this bundle* may import safely
export { request } from typeof window === 'undefined'
  ? './request.server'
  : './request.client';
