"use client";
import { forwardRef, ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export const Button = forwardRef<HTMLButtonElement, ButtonHTMLAttributes<HTMLButtonElement>>(function Button(
  { className, ...props }, ref
) {
  return (
    <button
      ref={ref}
      className={cn("bg-green-600 hover:bg-green-500 text-white px-3 py-1 rounded", className)}
      {...props}
    />
  );
});

export default Button;
