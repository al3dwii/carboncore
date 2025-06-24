"use client";
import { createContext, useContext } from "react";
import { useParams } from "next/navigation";

const OrgCtx = createContext<{ id: string }>({ id: "1" });

export function OrgProvider({ children }: { children: React.ReactNode }) {
  const params = useParams() as { orgId?: string };
  const id = params?.orgId ?? "1";
  return <OrgCtx.Provider value={{ id }}>{children}</OrgCtx.Provider>;
}

export function useOrg() {
  return useContext(OrgCtx);
}
