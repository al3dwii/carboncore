import Layout from '../src/components/Layout'
export default function Home(){
  return (
    <Layout>
      <div className="grid grid-cols-2 gap-4">
        <div className="p-4 border rounded">PRs analysed — 0</div>
        <div className="p-4 border rounded">kg CO₂ avoided — <span id="co2">0</span></div>
        <div className="p-4 border rounded">$ saved — 0</div>
        <div className="p-4 border rounded">Avg latency Δ — <span id="lat">0</span> ms</div>
        <div className="p-4 border rounded">Jobs shifted — <span id="shifted">0</span></div>
        <div className="p-4 border rounded">Active tools — 0</div>
      </div>
    </Layout>
  );
}


const API = 'http://127.0.0.1:8000';
async function waitReady() {
  for (;;) {
    try {
      const r = await fetch(`${API}/health`);
      if (r.ok) return;
    } catch {}
    await new Promise((r) => setTimeout(r, 1000));
  }
}

if (typeof window !== "undefined") {
  waitReady().then(() => {
    fetch(`${API}/events?kind=ecs_shift&aggregate=count`)
      .then((r) => r.json())
      .then(({ count }) => {
        const s = document.getElementById("shifted");
        if (s) s.textContent = count;
      });
    fetch(`${API}/events?field=meta.kg_co2&aggregate=sum`)
      .then((r) => r.json())
      .then(({ sum }) => {
        const e = document.getElementById("co2");
        if (e) e.textContent = (sum || 0).toFixed(1);
      });
    fetch(`${API}/events?kind=edge_route&aggregate=avg&field=meta.rtt`)
      .then(r=>r.json()).then(({avg})=>{
        const el=document.getElementById("lat"); if(el) el.textContent=Math.round(avg||0);
      });
  });
}
