import { useEffect, useState } from "react";
export default function Budget(){
 const [data,set]=useState<any[]>([]);
 useEffect(()=>{fetch("/budget").then(r=>r.json()).then(set)},[]);
 return <div className="p-6"><pre>{JSON.stringify(data,null,2)}</pre></div>
}
