import { ApiError } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import { create } from 'zustand';
import { errorMessage } from '@shared/lib';
import { cfoApi } from '../api/cfo.api';
import { cfoMessageSchema } from './schema';
import type { CfoMessage, CfoRequest, CfoReplyId, CfoPurchase } from './types';
interface CfoState {
  conversationId: string; messages: CfoMessage[]; busy: boolean; error: string | null;
  send: (message: string, replyId?: CfoReplyId, purchase?: CfoPurchase, income?: number) => Promise<void>;
  clear: () => void; restore: (owner: string) => Promise<void>; retry: (messageId: string) => Promise<void>; reset: () => void;
}
export const useCfo = create<CfoState>((set, get) => {
  let ownerKey = ''; let generation = 0;
  const execute = async (request: CfoRequest) => {
    const epoch = generation; set({ busy: true, error: null });
    try {
      const response = await cfoApi.ask(request); if (epoch !== generation) return;
      set(state => ({ busy: false, messages: [...state.messages.map(message => message.role === 'user' && message.id === request.requestId ? { ...message, status: 'sent' as const } : message), { id: response.id, role: 'assistant' as const, response }] }));
    } catch (cause: unknown) { if (epoch !== generation) return;
      set(state => ({ busy: false, error: errorMessage(cause), messages: state.messages.map(message => message.role === 'user' && message.id === request.requestId ? { ...message, status: 'failed' as const } : message) }));
    }
  };
  return { clear: () => { generation += 1; ownerKey = ''; set({ conversationId: crypto.randomUUID(), messages: [], busy: false, error: null }); }, restore: async owner => { if (IS_DEMO || !owner) return; ownerKey = 'wealthpilot:conversation:' + owner; let existing = false; let id: string = crypto.randomUUID(); try { const saved = localStorage.getItem(ownerKey); if (saved && /^[0-9a-f-]{36}$/i.test(saved)) { id = saved; existing = true; } localStorage.setItem(ownerKey, id); } catch { /* In-memory conversation still works when storage is disabled. */ } const epoch = generation; set({ conversationId: id, busy: existing }); if (!existing) return; try { const messages: CfoMessage[] = []; let page = 1; for (;;) { const result = await cfoApi.history(id, page); for (const item of result.items) { const request = normalizeRequest(item.request); messages.push({ id: request.requestId, role: 'user', text: request.message, createdAt: item.response?.createdAt ?? new Date().toISOString(), status: item.finalized ? 'sent' : 'failed', request }); if (item.finalized && item.response) messages.push({ id: item.response.id, role: 'assistant', response: item.response }); } if (page * result.pageSize >= result.total || result.items.length === 0) break; page += 1; } if (epoch === generation) set({ messages, busy: false }); } catch (cause: unknown) { if (epoch === generation) { if (cause instanceof ApiError && cause.status === 404) set({ messages: [], busy: false, error: null }); else set({ busy: false, error: errorMessage(cause) }); } } }, conversationId: crypto.randomUUID(), messages: [], busy: false, error: null,
    send: async (message, replyId, purchase, income) => {
      if (get().busy) return;
      if (get().messages.some(item => item.role === 'user' && item.status === 'failed')) { set({ error: 'Retry your undelivered message or start a new conversation before sending another question.' }); return; }
      const parsed = cfoMessageSchema.safeParse({ message });
      if (!parsed.success) { set({ error: parsed.error.issues[0]?.message ?? 'Enter a question.' }); return; }
      const request: CfoRequest = { requestId: crypto.randomUUID(), conversationId: get().conversationId, message: parsed.data.message, replyId, purchase, ...(income === undefined ? {} : { expectedAdditionalMonthlyIncomePaise: income }) };
      set(state => ({ messages: [...state.messages, { id: request.requestId, role: 'user', text: request.message, createdAt: new Date().toISOString(), status: 'pending', request }] }));
      await execute(request);
    },
    retry: async id => { if (get().busy) return; const message = get().messages.find(item => item.id === id); if (!message || message.role !== 'user' || message.status !== 'failed') return; set(state => ({ messages: state.messages.map(item => item.id === id && item.role === 'user' ? { ...item, status: 'pending' as const } : item) })); await execute(message.request); },
    reset: () => { if (get().busy) return; const id = crypto.randomUUID(); if (ownerKey) try { localStorage.setItem(ownerKey, id); } catch { /* Keep the new conversation in memory. */ } set({ conversationId: id, messages: [], error: null }); },
  };
});

function normalizeRequest(value: unknown): CfoRequest { const item = value as CfoRequest; return { ...item, replyId: item.replyId ?? undefined, purchase: item.purchase ?? undefined }; }
