import { useState } from "react";
export default function EdgePage(){
  const [ip,setIp]=useState(""); const [pop,setPop]=useState("");
  return(<div className="p-6 space-y-4">
    <input value={ip} onChange={e=>setIp(e.target.value)}
      placeholder="Enter IP" className="border p-2"/>
    <button onClick={async()=>{
      const r=await fetch(`/edge-route?ip=${ip}`); setPop((await r.json()).pop);
    }} className="border px-3 py-1 rounded">Route</button>
    {pop && <div className="mt-4">Best PoP: <b>{pop}</b></div>}
  </div>);
}
