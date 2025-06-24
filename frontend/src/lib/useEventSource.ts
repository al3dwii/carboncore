"use client";
import { useEffect, useState } from "react";

export function useEventSource<T = any>(url: string) {
  const [data, set] = useState<T | null>(null);
  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch(url, { method: "HEAD" })
      .then(r => {
        if (!r.ok) throw new Error(`endpoint ${url} unavailable`);
        const es = new EventSource(url, { withCredentials: true });
        es.onmessage = ev => !cancelled && set(JSON.parse(ev.data));
        es.onerror = () => {
          es.close();
          !cancelled && setErr(new Error("stream error"));
        };
      })
      .catch(e => !cancelled && setErr(e));
    return () => {
      cancelled = true;
    };
  }, [url]);

  return [data, err] as const;
}
