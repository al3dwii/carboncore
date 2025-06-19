"use client";
import { createContext, useContext, useState, ReactNode } from "react";

export interface OrgCtxValue {
  orgId: string;
  setOrgId: (id: string) => void;
}

const OrgCtx = createContext<OrgCtxValue | null>(null);

export function OrgProvider({ children, initialOrg }: { children: ReactNode; initialOrg: string }) {
  const [orgId, setOrgId] = useState(initialOrg);
  return <OrgCtx.Provider value={{ orgId, setOrgId }}>{children}</OrgCtx.Provider>;
}

export function useOrg() {
  const ctx = useContext(OrgCtx);
  if (!ctx) throw new Error("useOrg must be inside <OrgProvider>");
  return ctx;
}

