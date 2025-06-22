import React from "react";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFlags } from "@/lib/useFlags";
import { describe, expect, it } from "vitest";

const wrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const qc = new QueryClient();
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>;
};

describe("useFlags()", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns an empty object when no orgId is provided", async () => {
    const { result } = renderHook(() => useFlags(), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual({});
    });
  });

  it("fetches and returns flags for a given orgId", async () => {
    vi.spyOn(global, "fetch").mockResolvedValueOnce(
      new Response(JSON.stringify({ advisor: true }), { status: 200 }),
    );

    const { result } = renderHook(() => useFlags("org-123"), { wrapper });

    await waitFor(() => {
      expect(result.current.data).toEqual({ advisor: true });
    });

    expect(global.fetch).toHaveBeenCalledWith("/api/org/org-123/flags");
  });
});
