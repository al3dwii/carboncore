/*  NO  'use client'  →  Server Component  */
import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getRole } from "./auth";

export default async function RoleGate({
  allow,
  children,
}: {
  allow: ("ops" | "dev" | "analyst" | "user")[];
  children: ReactNode;
}) {
  const role = await getRole();
  if (!allow.includes(role)) redirect("/dashboard");
  return <>{children}</>;
}
