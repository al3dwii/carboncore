import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import type { Message } from './api/greendev';
import { askGreenDev } from './api/greendev';

export function useChat(orgId: string) {
  const qc = useQueryClient();
  const [history, setHistory] = useState<Message[]>([]);
  const mutation = useMutation({
    mutationFn: (question: string) =>
      askGreenDev(orgId, question, history.map((h) => h.id)),
    onSuccess: (msgs) => setHistory(msgs),
  });

  return {
    history,
    ask: mutation.mutateAsync,
    state: mutation.status,
  };
}
