"use client";
import { useEffect, useRef, useState } from "react";

export function useEventSource<T>(url: string, onMsg?: (d: T) => void) {
  const [events, setEvents] = useState<T[]>([]);
  const esRef = useRef<EventSource>();

  useEffect(() => {
    const es = new EventSource(url);
    esRef.current = es;
    es.onmessage = (e) => {
      const data: T = JSON.parse(e.data);
      setEvents((p) => [...p, data]);
      onMsg?.(data);
    };
    return () => es.close();
  }, [url]);

  return events;
}
