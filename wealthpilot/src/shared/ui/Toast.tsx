import { useEffect } from 'react';
import { create } from 'zustand';
import { CheckCircle2, X } from 'lucide-react';
interface ToastMessage { id: string; message: string; tone: 'success' | 'error' | 'info' }
const useToasts = create<{ items: ToastMessage[]; add: (item: ToastMessage) => void; remove: (id: string) => void }>(set => ({ items: [], add: item => set(state => ({ items: [...state.items, item].slice(-4) })), remove: id => set(state => ({ items: state.items.filter(item => item.id !== id) })) }));
export function toast(message: string, tone: ToastMessage['tone'] = 'success'): void { useToasts.getState().add({ id: crypto.randomUUID(), message, tone }); }
function ToastItem({ item }: { item: ToastMessage }) {
  const remove = useToasts(state => state.remove);
  useEffect(() => { const timer = setTimeout(() => remove(item.id), 6000); return () => clearTimeout(timer); }, [item.id, remove]);
  return <div role={item.tone === 'error' ? 'alert' : 'status'} className="flex items-start gap-3 rounded-control border border-line bg-panel p-4 text-sm text-ink shadow-card"><CheckCircle2 size={18} className={item.tone === 'error' ? 'text-[var(--negative)]' : 'text-[var(--positive)]'} /><span className="flex-1">{item.message}</span><button className="min-h-8 min-w-8" aria-label="Dismiss notification" onClick={() => remove(item.id)}><X size={16} /></button></div>;
}
export function ToastHost() { const items = useToasts(state => state.items); return <div aria-label="Notifications" className="fixed bottom-24 right-4 z-50 w-[calc(100%_-_2rem)] max-w-sm space-y-2 lg:bottom-6">{items.map(item => <ToastItem key={item.id} item={item} />)}</div>; }
