'use client';
import { useEffect } from 'react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  /* optional: report to PostHog/Sentry */
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html>
      <body className="grid h-screen place-content-center gap-6 text-center">
        <h1 className="text-2xl font-semibold text-destructive">
          Something went wrong 😓
        </h1>
        <button
          onClick={() => reset()}
          className="mx-auto rounded-lg border px-4 py-2 shadow-sm transition-all hover:bg-accent"
        >
          Try again
        </button>
      </body>
    </html>
  );
}
