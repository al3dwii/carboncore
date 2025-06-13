import { useState } from "react";
export default function GreenDev(){
  const [sku, set] = useState("");
  const [data, setData] = useState<any>(null);
  const [lead, setLead] = useState<any[]>([]);
  return (
    <div className="p-6 space-y-4">
      <input value={sku} onChange={e=>set(e.target.value)}
        placeholder="t3.large" className="border p-2" />
      <button className="border px-3 py-1 rounded" onClick={async()=>{
        const r = await fetch("/advice/sku?sku=" + sku);
        setData(await r.json());
      }}>Get advice</button>
      {data && <pre>{JSON.stringify(data,null,2)}</pre>}
      <button className="border px-3 py-1 rounded" onClick={async()=>{
        const r = await fetch("/advice/leaderboard");
        setLead(await r.json());
      }}>Load leaderboard</button>
      <pre>{JSON.stringify(lead,null,2)}</pre>
    </div>
  );
}
