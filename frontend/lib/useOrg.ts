"use client";
import { createContext, useContext } from "react";

export const OrgCtx = createContext<{ id: string; name: string } | null>(null);

export const useOrg = () => {
  const ctx = useContext(OrgCtx);
  if (!ctx) throw new Error("OrgCtx missing");
  return ctx;
};
