import { useState } from "react";
export default function Comply(){const[d,set]=useState(new Date().getFullYear());
return <div className="p-6">
  <input type="number" value={d} onChange={e=>set(+e.target.value)} className="border px-2 mr-2"/>
  <a href={`/comply/xlsx?year=${d}`} className="underline">Download ESRS XLSX</a>
</div>}
