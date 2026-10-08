import { create } from 'zustand';
import { ApiError, configureAuthentication, setAccessToken, clearMutationIntents } from '@shared/api';
import { errorMessage } from '@shared/lib';
import { authApi } from '../api/auth.api';
import type { AuthIdentity, AuthResponse, LoginInput, RegisterInput } from './types';
interface AuthState { status: 'checking' | 'authenticated' | 'guest' | 'error'; identity: AuthIdentity | null; recoveryCode: string | null; error: string | null; epoch: number; initialize: (retry?: boolean) => Promise<void>; login: (input: LoginInput) => Promise<void>; register: (input: RegisterInput) => Promise<void>; logout: () => Promise<void>; dismissRecovery: () => void }
let boot: Promise<void> | null = null;
let initialized = false;
async function refreshSession(): Promise<AuthResponse> {
  if (typeof navigator !== 'undefined' && navigator.locks) return navigator.locks.request('wealthpilot-auth-refresh', () => authApi.refresh());
  return authApi.refresh();
}
export const useAuth = create<AuthState>((set, get) => {
  const accept = (result: AuthResponse) => { setAccessToken(result.token); clearMutationIntents(); set(state => ({ status: 'authenticated', identity: { fullName: result.fullName, username: result.username }, recoveryCode: result.recoveryCode, error: null, epoch: state.epoch + 1 })); };
  const leave = () => { setAccessToken(null); clearMutationIntents(); set(state => ({ status: 'guest', identity: null, recoveryCode: null, epoch: state.epoch + 1 })); };
  configureAuthentication({ refresh: async () => { const result = await refreshSession(); return result.token; }, expired: leave });
  return { status: 'checking', identity: null, recoveryCode: null, error: null, epoch: 0,
    initialize: async (retry = false) => {
      if (boot) return boot;
      if (initialized && !retry) return;
      initialized = true; const epoch = get().epoch; set({ status: 'checking', error: null });
      boot = (async () => { try { const result = await refreshSession(); if (get().epoch === epoch) accept(result); } catch (cause: unknown) { if (get().epoch !== epoch) return; if (cause instanceof ApiError && [400, 401, 403].includes(cause.status)) leave(); else set({ status: 'error', error: errorMessage(cause) }); } finally { boot = null; } })();
      return boot;
    },
    login: async input => { if (boot) await boot; const response = await authApi.login(input); initialized = true; accept(response); },
    register: async input => { if (boot) await boot; const response = await authApi.register(input); initialized = true; accept(response); },
    logout: async () => { try { if (boot) await boot; await authApi.logout(); leave(); } catch (cause: unknown) { set({ error: 'Logout could not be confirmed by the server. ' + errorMessage(cause) }); throw cause; } },
    dismissRecovery: () => set({ recoveryCode: null }),
  };
});
