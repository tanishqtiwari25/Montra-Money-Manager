import { create } from 'zustand';
import { errorMessage } from '@shared/lib';
import { userApi } from '../api/user.mock';
import type { UserProfile } from './types';
interface UserState { profile: UserProfile | null; loading: boolean; error: string | null; load: (force?: boolean) => Promise<void>; setProfile: (profile: UserProfile) => void }
export const useUser = create<UserState>((set, get) => ({
  profile: null, loading: false, error: null,
  load: async (force = false) => {
    if (get().loading || (get().profile && !force)) return;
    set({ loading: true, error: null });
    try { set({ profile: await userApi.get(), loading: false }); }
    catch (error: unknown) { set({ error: errorMessage(error), loading: false }); }
  },
  setProfile: profile => set({ profile, error: null }),
}));
