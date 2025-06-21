export async function request(path: string, query: Record<string, string> = {}, method = 'GET', body?: unknown) {
  const url = new URL(path, 'http://localhost:3000');
  Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
  const res = await fetch(url.toString(), {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) throw new Error(res.statusText);
  return res.json();
}
