import { ReactNode } from "react";
import { sidebar } from "../sidebar-meta";
export default function Layout({ children }:{children:ReactNode}){
  return (
    <div className="flex">
      <aside className="w-56 border-r p-4 space-y-2">
        {sidebar.map(s => <a key={s.id} href={'/tool/'+s.id} className="block">{s.sidebar}</a>)}
      </aside>
{typeof window!=="undefined" && localStorage.getItem("overshoot")=="1" && 
 <div className="bg-yellow-100 p-2 text-sm text-yellow-800">Budget warning in 30 days</div> }
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
