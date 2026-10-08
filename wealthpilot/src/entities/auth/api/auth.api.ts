import { http, waitForRefresh, type IdentityView } from '@shared/api';
import type { AuthResponse, LoginInput, RegisterInput, RecoverInput } from '../model/types';
const publicOptions = { auth: false };
async function cookieCommand<T>(operation: () => Promise<T>): Promise<T> {
  await waitForRefresh();
  if (typeof navigator !== 'undefined' && navigator.locks) return navigator.locks.request('wealthpilot-auth-refresh', operation);
  return operation();
}
export const authApi = {
  login: (input: LoginInput) => cookieCommand(() => http.post<AuthResponse>('/auth/login', input, publicOptions)),
  register: (input: RegisterInput) => cookieCommand(() => http.post<AuthResponse>('/auth/register', input, publicOptions)),
  refresh: () => http.post<AuthResponse>('/auth/refresh', {}, publicOptions),
  logout: () => cookieCommand(() => http.post<void>('/auth/logout', {}, publicOptions)),
  me: () => http.get<IdentityView>('/auth/me'),
  recover: (input: RecoverInput) => cookieCommand(() => http.post<{ recoveryCode?: string | null }>('/auth/recover', input, publicOptions)),
  password: (input: { currentPassword: string; newPassword: string }) => cookieCommand(() => http.post<{ recoveryCode: string }>('/auth/password', input)),
};
