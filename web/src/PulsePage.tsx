import { useEffect, useState } from "react";
export default function Pulse(){
 const [rows,set]=useState<any[]>([]);
 useEffect(()=>{fetch("/suppliers").then(r=>r.json()).then(set)},[]);
 return <table className="min-w-full border"><thead><tr><th>Name</th><th>SLA</th></tr></thead>
  <tbody>{rows.map(r=><tr key={r.id}><td>{r.name}</td><td>{r.sla_gco2}</td></tr>)}</tbody></table>;
}
