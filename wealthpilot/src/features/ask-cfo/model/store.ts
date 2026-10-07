import { create } from 'zustand';
import { errorMessage } from '@shared/lib';
import { cfoApi } from '../api/cfo.mock';
import { cfoMessageSchema } from './schema';
import type { CfoMessage, CfoRequest, CfoReplyId, CfoPurchase } from './types';
interface CfoState {
  conversationId: string; messages: CfoMessage[]; busy: boolean; error: string | null;
  send: (message: string, replyId?: CfoReplyId, purchase?: CfoPurchase) => Promise<void>;
  retry: (messageId: string) => Promise<void>; reset: () => void;
}
export const useCfo = create<CfoState>((set, get) => {
  const execute = async (request: CfoRequest) => {
    set({ busy: true, error: null });
    try {
      const response = await cfoApi.ask(request);
      set(state => ({ busy: false, messages: [...state.messages.map(message => message.role === 'user' && message.id === request.requestId ? { ...message, status: 'sent' as const } : message), { id: response.id, role: 'assistant' as const, response }] }));
    } catch (cause: unknown) {
      set(state => ({ busy: false, error: errorMessage(cause), messages: state.messages.map(message => message.role === 'user' && message.id === request.requestId ? { ...message, status: 'failed' as const } : message) }));
    }
  };
  return { conversationId: crypto.randomUUID(), messages: [], busy: false, error: null,
    send: async (message, replyId, purchase) => {
      if (get().busy) return;
      const parsed = cfoMessageSchema.safeParse({ message });
      if (!parsed.success) { set({ error: parsed.error.issues[0]?.message ?? 'Enter a question.' }); return; }
      const request: CfoRequest = { requestId: crypto.randomUUID(), conversationId: get().conversationId, message: parsed.data.message, replyId, purchase };
      set(state => ({ messages: [...state.messages, { id: request.requestId, role: 'user', text: request.message, createdAt: new Date().toISOString(), status: 'pending', request }] }));
      await execute(request);
    },
    retry: async id => { if (get().busy) return; const message = get().messages.find(item => item.id === id); if (!message || message.role !== 'user' || message.status !== 'failed') return; set(state => ({ messages: state.messages.map(item => item.id === id && item.role === 'user' ? { ...item, status: 'pending' as const } : item) })); await execute(message.request); },
    reset: () => { if (!get().busy) set({ conversationId: crypto.randomUUID(), messages: [], error: null }); },
  };
});
