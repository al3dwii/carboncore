export default function Landing() {
  return (
    <main className="p-10">
      <h1 className="text-3xl font-bold mb-6">CarbonCore Frontend</h1>
      {/* link to an existing Pages-Router page so nothing breaks */}
      <a href="/dashboard" className="underline text-blue-400">Dashboard →</a>
    </main>
  );
}
