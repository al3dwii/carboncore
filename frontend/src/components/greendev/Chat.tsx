'use client';

import { FormEvent, useRef } from 'react';
import { useChat } from '@/lib/useChat';
import { PaperAirplaneIcon } from '@heroicons/react/24/outline';

export function Chat({ orgId }: { orgId: string }) {
  const { ask, history, state } = useChat(orgId);
  const input = useRef<HTMLInputElement>(null);

  const onSend = async (e: FormEvent) => {
    e.preventDefault();
    const q = input.current!.value.trim();
    if (!q) return;
    await ask(q);
    input.current!.value = '';
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="h-[50vh] flex-1 overflow-y-auto rounded border p-4">
        {history.map((m) => (
          <p key={m.id} className={m.role === 'bot' ? 'text-green-700' : ''}>
            <strong>{m.role === 'bot' ? 'Bot:' : 'You:'}</strong> {m.content}
          </p>
        ))}
        {state === 'loading' && <p className="italic text-gray-500">…thinking</p>}
      </div>

      <form onSubmit={onSend} className="flex gap-2">
        <input
          ref={input}
          type="text"
          placeholder="Ask how to reduce CO₂ …"
          className="flex-1 rounded border px-3 py-2"
        />
        <button className="rounded bg-emerald-600 px-4 py-2 text-white">
          <PaperAirplaneIcon className="size-5 -rotate-45" />
        </button>
      </form>
    </div>
  );
}
