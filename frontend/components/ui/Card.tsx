import { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Card({
  title, value, children, className,
}: {
  title: string;
  value?: ReactNode;
  children?: ReactNode;
  className?: string;
}) {
  return (
    <div className={cn(
      "rounded-lg border bg-white p-5 shadow-sm dark:bg-zinc-900", className)}>
      <p className="text-sm text-muted-foreground">{title}</p>
      {value && <p className="mt-1 text-3xl font-semibold">{value}</p>}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
