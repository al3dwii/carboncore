"use client";
import { usePageMetrics } from "@/src/hooks/usePageMetrics";

export function PageMetrics({ page }: { page: string }) {
  usePageMetrics(page);
  return null;
}
