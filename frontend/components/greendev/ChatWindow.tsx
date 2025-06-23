"use client";
import { useChat } from "@/lib/useChat";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function ChatWindow() {
  const { messages, send } = useChat();
  return (
    <div className="flex h-full flex-col">
      <div className="grow space-y-3 overflow-y-auto p-4">
          {messages.map((m,i)=>(
            <div key={i} className={`rounded p-2 ${m.role==="user"?"bg-sky-50":"bg-stone-100"}`}> 
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{m.text}</ReactMarkdown>
            </div>
          ))}
      </div>
      <form onSubmit={e=>{e.preventDefault();send(e.currentTarget.q.value);e.currentTarget.reset();}}
            className="flex gap-2 border-t p-2">
        <input name="q" placeholder="Ask GreenDev…" className="grow rounded border px-2 py-1"/>
        <button className="rounded bg-emerald-600 px-4 py-1 text-white">Send</button>
      </form>
    </div>
  );
}
