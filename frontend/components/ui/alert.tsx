'use client';
import { cn } from '@/lib/utils';
import React from 'react';

export function Alert({ children, className, variant }: { children: React.ReactNode; className?: string; variant?: 'destructive' | 'default' }) {
  const variants: Record<string, string> = {
    destructive: 'bg-red-50 border-red-500 text-red-800',
    default: 'bg-gray-100 border-gray-200',
  };
  return <div className={cn('border p-4 rounded flex gap-2', variants[variant ?? 'default'], className)}>{children}</div>;
}

export const AlertTitle = ({ children }: { children: React.ReactNode }) => <div className="font-medium">{children}</div>;
export const AlertDescription = ({ children }: { children: React.ReactNode }) => <div>{children}</div>;

export default Alert;
