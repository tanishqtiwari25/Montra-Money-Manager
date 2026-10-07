import { create } from 'zustand';
import { errorMessage } from './errors';
export interface CollectionState<T> {
  items: T[]; loading: boolean; loaded: boolean; error: string | null;
  load: (force?: boolean) => Promise<void>;
  upsert: (item: T) => void;
  remove: (id: string) => void;
}
export function createCollectionStore<T extends { id: string }>(fetchItems: () => Promise<T[]>) {
  return create<CollectionState<T>>((set, get) => ({
    items: [], loading: false, loaded: false, error: null,
    load: async (force = false) => {
      if (get().loading || (get().loaded && !force)) return;
      set({ loading: true, error: null });
      try { set({ items: await fetchItems(), loaded: true, loading: false }); }
      catch (error: unknown) { set({ error: errorMessage(error), loading: false }); }
    },
    upsert: item => set(state => ({ items: state.items.some(value => value.id === item.id) ? state.items.map(value => value.id === item.id ? item : value) : [...state.items, item] })),
    remove: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
  }));
}
