import { request } from '../request';

export function apiFetch<T>(path: string, init?: RequestInit) {
  return request<T>(path, init);
}
