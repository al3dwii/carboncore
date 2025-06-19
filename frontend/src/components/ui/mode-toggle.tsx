'use client';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
export function ModeToggle() {
  const { theme, setTheme } = useTheme();
  return (
    <button
      className="p-2 rounded-lg hover:bg-muted"
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );
}
