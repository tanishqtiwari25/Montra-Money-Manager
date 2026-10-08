import { create } from 'zustand';
import { errorMessage } from '@shared/lib';
import { userApi } from '../api/user.api';
import type { UserProfile } from './types';
interface UserState { generation: number; reset: () => void; profile: UserProfile | null; loading: boolean; error: string | null; load: (force?: boolean) => Promise<void>; setProfile: (profile: UserProfile) => void }
export const useUser = create<UserState>((set, get) => ({
  generation: 0, reset: () => set(state => ({ generation: state.generation + 1, profile: null, loading: false, error: null })), profile: null, loading: false, error: null,
  load: async (force = false) => {
    if (get().loading || (get().profile && !force)) return;
    const generation = get().generation; set({ loading: true, error: null });
    try { const profile = await userApi.get(); if (get().generation === generation) set({ profile, loading: false }); }
    catch (error: unknown) { if (get().generation === generation) set({ error: errorMessage(error), loading: false }); }
  },
  setProfile: profile => set({ profile, error: null }),
}));
