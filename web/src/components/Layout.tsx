import { ReactNode } from "react";
import { sidebar } from "../sidebar-meta";
export default function Layout({ children }:{children:ReactNode}){
  return (
    <div className="flex">
      <aside className="w-56 border-r p-4 space-y-2">
        {sidebar.map(s => <a key={s.id} href={'/tool/'+s.id} className="block">{s.sidebar}</a>)}
      </aside>
      <main className="flex-1 p-6">{children}</main>
    </div>
  );
}
