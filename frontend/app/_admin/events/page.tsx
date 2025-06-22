import { Suspense } from 'react';
import EventsClient from './EventsClient';

export const dynamic = 'force-dynamic';

export default function EventsPage() {
  return (
    <Suspense>
      <EventsClient />
    </Suspense>
  );
}
