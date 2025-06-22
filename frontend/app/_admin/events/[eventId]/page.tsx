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
        <h1 className="font-bold text-lg">Event {eventId}</h1>
        <Button formAction={replay}>Replay</Button>
      </header>

      <div className="tabs">
        <input type="radio" id="raw" name="tab" defaultChecked className="hidden peer" />
        <label htmlFor="raw" className="tab">Raw</label>
        <input type="radio" id="diff" name="tab" className="hidden peer" />
        <label htmlFor="diff" className="tab">Diff</label>

        <div className="pt-4">
          <div className="peer-checked:block hidden" id="rawPane">
            <JsonViewer src={(ev as any).payload} theme="monokai" enableClipboard={false} />
          </div>
          <div className="peer-checked:block hidden" id="diffPane">
            {prev ? <DiffViewer oldData={(prev as any).payload} newData={(ev as any).payload} /> : 'No previous event'}
          </div>
        </div>
      </div>
    </div>
  );
}
