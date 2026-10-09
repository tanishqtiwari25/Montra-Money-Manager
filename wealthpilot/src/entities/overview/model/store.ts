import { create } from 'zustand';
import { errorMessage } from '@shared/lib';
import type { DashboardView } from '@shared/api';
import { overviewApi } from '../api/overview.api';
interface State { dashboard: DashboardView | null; loading: boolean; error: string | null; generation: number; reset: () => void; load: (force?: boolean) => Promise<void> }
export const useOverview = create<State>((set, get) => ({ dashboard: null, loading: false, error: null, generation: 0, reset: () => set(state => ({ generation: state.generation + 1, dashboard: null, loading: false, error: null })), load: async (force = false) => { if ((get().loading && !force) || (get().dashboard && !force)) return; const generation = get().generation + 1; set({ generation, loading: true, error: null }); try { const dashboard = await overviewApi.dashboard(); if (get().generation === generation) set({ dashboard, loading: false }); } catch (cause: unknown) { if (get().generation === generation) set({ error: errorMessage(cause), loading: false }); } } }));

