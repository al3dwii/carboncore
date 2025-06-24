"use client";
import { useEffect } from "react";
import mixpanel from "mixpanel-browser";

export function usePageMetrics(page: string) {
  useEffect(() => {
    const start = performance.now();
    return () => {
      mixpanel.track("page_unmount", {
        page,
        duration_ms: performance.now() - start,
      });
    };
  }, [page]);
}
