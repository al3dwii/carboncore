"use client";
export default function Error({ error }: { error: Error }) {
  return (
    <div className="p-10 text-center">
      <h1 className="text-red-600 text-xl font-bold mb-4">Something went wrong</h1>
      <pre className="text-sm text-gray-500">{error.message}</pre>
    </div>
  );
}
