"use client";
export default function GlobalError({ error }: { error: Error }) {
  return (
    <html>
      <body className="p-6 text-red-700">
        <h1 className="text-lg font-bold">Something went wrong 💥</h1>
        <pre className="whitespace-pre-wrap">{error.message}</pre>
      </body>
    </html>
  );
}
