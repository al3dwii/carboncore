"use client";
import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";      // if you don’t have lucide:
                                              //  pnpm add lucide-react
import { cn } from "./cn";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <button
      aria-label="Toggle dark mode"
      className={cn(
        "rounded p-2 transition hover:bg-gray-100 dark:hover:bg-gray-700"
      )}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
      {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
    </button>
  );
}
