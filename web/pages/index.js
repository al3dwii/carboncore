import Layout from '../src/components/Layout'
export default function Home(){
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">PRs analysed — 0</div>
        <div className="p-4 border rounded">kg CO₂ avoided — <span id="co2">0</span></div>
        <div className="p-4 border rounded">$ saved — 0</div>
        <div className="p-4 border rounded">Jobs shifted — <span id="shifted">0</span></div>
        <div className="p-4 border rounded">Active tools — 0</div>
      </div>
    </Layout>
  );
}

if (typeof window !== "undefined") {
  fetch("/events?kind=ecs_shift&aggregate=count")
    .then((r) => r.json())
    .then(({ count }) => {
      const s = document.getElementById("shifted");
      if (s) s.textContent = count;
    });
  fetch("/events?field=meta.kg_co2&aggregate=sum")
    .then((r) => r.json())
    .then(({ sum }) => {
      const e = document.getElementById("co2");
      if (e) e.textContent = (sum || 0).toFixed(1);
    });
}
