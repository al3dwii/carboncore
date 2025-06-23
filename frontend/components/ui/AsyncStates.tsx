"use client";
import { ReactNode } from "react";

type Props =
  | { state: "loading" }
  | { state: "error"; error: string }
  | { state: "empty"; message: string }
  | { state: "ready"; children: ReactNode };

export function AsyncStates(props: Props) {
  if (props.state === "loading") return <p className="text-sm text-gray-500">Loading…</p>;
  if (props.state === "error")   return <p className="text-sm text-red-600">{props.error}</p>;
  if (props.state === "empty")   return <p className="text-sm text-gray-400">{props.message}</p>;
  return <>{props.children}</>;
}
