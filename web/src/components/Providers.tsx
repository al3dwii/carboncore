'use client'
import { ReactNode, useEffect } from 'react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from 'next-themes'
import { initAnalytics } from '@/lib/analytics'
import ConsentBanner from '@/components/ConsentBanner'

const queryClient = new QueryClient()

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    initAnalytics()
  }, [])

  return (
    <ThemeProvider attribute="class">
      <QueryClientProvider client={queryClient}>
        {children}
        <ConsentBanner />
      </QueryClientProvider>
    </ThemeProvider>
  )
}
