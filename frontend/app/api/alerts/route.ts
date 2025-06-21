export async function GET() {
  return Response.json({ items: [{ id: 'a1', sev: 'critical', msg: 'example', ts: Date.now() }] });
}
