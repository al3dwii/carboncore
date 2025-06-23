import { notFound } from 'next/navigation';
import dynamic from 'next/dynamic';
import { request } from '@/lib/request';
import { Button } from '@/components/ui';
import { toast } from 'sonner';

const JsonViewer = dynamic(() => import('react-json-view'), { ssr: false });
const DiffViewer = dynamic(() => import('react-json-view-diff'), { ssr: false });

export default async function EventDetail({ params: { eventId } }: { params: { eventId: string } }) {
  const ev = await request(`/api/events/${eventId}`);
  if (!ev) notFound();
  const prev = (ev as any).prev ?? null;

  async function replay() {
    'use server';
    await request(`/api/events/${eventId}/replay`, {}, 'PATCH');
    toast.success('Replay queued');
  }

  return (
    <div className="space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-lg font-bold">Event {eventId}</h1>
        <Button formAction={replay}>Replay</Button>
      </header>

      <div className="tabs">
        <input type="radio" id="raw" name="tab" defaultChecked className="peer hidden" />
        <label htmlFor="raw" className="tab">Raw</label>
        <input type="radio" id="diff" name="tab" className="peer hidden" />
        <label htmlFor="diff" className="tab">Diff</label>

        <div className="pt-4">
          <div className="hidden peer-checked:block" id="rawPane">
            <JsonViewer src={(ev as any).payload} theme="monokai" enableClipboard={false} />
          </div>
          <div className="hidden peer-checked:block" id="diffPane">
            {prev ? <DiffViewer oldData={(prev as any).payload} newData={(ev as any).payload} /> : 'No previous event'}
          </div>
        </div>
      </div>
    </div>
  );
}
