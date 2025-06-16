"use client";
import { useEffect, useRef, useState } from "react";

export function useEventSource<T>(url: string) {
  const [events, setEvents] = useState<T[]>([]);
  const esRef = useRef<EventSource | null>(null);

  useEffect(() => {
    const es = new EventSource(url);
    es.onmessage = (e) => {
      const payload = JSON.parse(e.data);
      setEvents((prev) => [payload as T, ...prev]);
    };
    esRef.current = es;
    return () => es.close();
  }, [url]);

  return events;
}
