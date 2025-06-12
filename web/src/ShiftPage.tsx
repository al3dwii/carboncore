import { useState } from "react";
export default function ShiftPage(){
  const [json,setJson]=useState<any>(null);
  return <div className="p-6">
    <button className="border px-3 py-1 rounded"
      onClick={async ()=>{
        const body={vcpu_hours:4,
          earliest:new Date().toISOString(),
          latest:new Date(Date.now()+4*3600*1000).toISOString(),
          preferred_region:"DE"};
        const r=await fetch("/suggest",{method:"POST",
          headers:{"Content-Type":"application/json"},
          body:JSON.stringify(body)});
        setJson(await r.json());
      }}>Suggest slot</button>
    <pre className="mt-4">{JSON.stringify(json,null,2)}</pre>
  </div>;
}
