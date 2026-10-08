import { create } from 'zustand';
import { errorMessage } from './errors';
export interface CollectionState<T> {
  generation: number; reset: () => void; items: T[]; loading: boolean; loaded: boolean; error: string | null;
  load: (force?: boolean) => Promise<void>;
  upsert: (item: T) => void;
  remove: (id: string) => void;
}
export function createCollectionStore<T extends { id: string }>(fetchItems: () => Promise<T[]>) {
  return create<CollectionState<T>>((set, get) => ({
    generation: 0, reset: () => set(state => ({ generation: state.generation + 1, items: [], loaded: false, loading: false, error: null })), items: [], loading: false, loaded: false, error: null,
    load: async (force = false) => {
      if (get().loading || (get().loaded && !force)) return;
      const generation = get().generation; set({ loading: true, error: null });
      try { const items = await fetchItems(); if (get().generation === generation) set({ items, loaded: true, loading: false }); }
      catch (error: unknown) { if (get().generation === generation) set({ error: errorMessage(error), loading: false }); }
    },
    upsert: item => set(state => ({ items: state.items.some(value => value.id === item.id) ? state.items.map(value => value.id === item.id ? item : value) : [...state.items, item] })),
    remove: id => set(state => ({ items: state.items.filter(item => item.id !== id) })),
  }));
}
