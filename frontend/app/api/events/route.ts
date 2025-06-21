export async function GET() {
  return Response.json({ items: [{ id: '1', ts: Date.now(), type: 'info', plugin: 'core', summary: 'hello' }], nextCursor: null });
}
