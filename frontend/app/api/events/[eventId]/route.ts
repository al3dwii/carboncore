export async function GET() {
  return Response.json({ id: '1', ts: Date.now(), type: 'info', plugin: 'core', summary: 'hello', payload: { foo: 'bar' } });
}
