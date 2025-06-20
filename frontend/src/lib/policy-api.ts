import { request } from "@/lib/client";

export async function fetchPolicy(): Promise<{ weight: number }> {
  return request("/router/policy", "get", {}) as Promise<{ weight: number }>;
}

export async function patchPolicy(body: { weight: number }) {
  return request("/router/policy", "patch", {}, body) as Promise<{ weight: number }>;
}
