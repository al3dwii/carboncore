"use client";

import { useEffect, useRef, useState } from "react";

type Status = "connecting" | "open" | "closed" | "error";

export interface UseEventSourceOpts<T> {
  /** auto-reconnect after the stream closes?  (default: false) */
  reconnect?: boolean;
  /** initial delay for reconnect (ms, default 1 000) */
  reconnectDelay?: number;
  /** transform raw `message.data` before it reaches state (default: JSON.parse) */
  parse?: (raw: string) => T;
}

/**
 * React hook around Server-Sent Events (EventSource).
 *
 * @example
 * const [msg, err, status] =
 *   useEventSource<{ remaining: number }>("/api/budget/stream", { reconnect: true });
 */

export function useEventSource<T = unknown>(
  url: string,
  {
    reconnect = false,
    reconnectDelay = 1_000,
    parse = JSON.parse,
  }: UseEventSourceOpts<T> = {}
): [T | null, Error | null, Status] {
  const [data, setData]     = useState<T | null>(null);
  const [error, setError]   = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>("connecting");

  const esRef   = useRef<EventSource | null>(null);
  const timerId = useRef<NodeJS.Timeout>();

  /** tear everything down */
  const cleanup = () => {
    esRef.current?.close();
    esRef.current = null;
    if (timerId.current) clearTimeout(timerId.current);
  };

  useEffect(() => {
    let delay = reconnectDelay;

    const openStream = () => {
      setStatus("connecting");
      const es = new EventSource(url, { withCredentials: true });
      esRef.current = es;

      es.onopen = () => setStatus("open");

      es.onmessage = (ev) => {
        try {
          // @ts-ignore – user might override parse to return void
          setData(parse(ev.data));
        } catch (e) {
          setError(e as Error);
        }
      };

      es.onerror = () => {
        setStatus("error");
        cleanup();

        if (reconnect) {
          timerId.current = setTimeout(openStream, delay);
          delay = Math.min(delay * 2, 30_000); // exponential back-off up to 30 s
        } else {
          setError(new Error("EventSource closed"));
          setStatus("closed");
        }
      };
    };

    openStream();
    return cleanup; // run on unmount / hot-reload
  }, [url, reconnect, reconnectDelay, parse]);

  return [data, error, status];
}
