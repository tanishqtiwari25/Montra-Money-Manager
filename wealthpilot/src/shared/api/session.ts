import { ApiError } from './types';
let token: string | null = null;
let refresh: (() => Promise<string | null>) | null = null;
let expired: (() => void) | null = null;
let refreshing: Promise<string | null> | null = null;
let generation = 0;
let ownerGeneration = 0;
export function setAccessToken(value: string | null): void { token = value; generation += 1; ownerGeneration += 1; }
export function getSessionEpoch(): number { return ownerGeneration; }
export function getAccessToken(): string | null { return token; }
export async function waitForRefresh(): Promise<void> { try { await refreshing; } catch { /* A logout/login may replace an expired or offline session. */ } }
export function configureAuthentication(hooks: { refresh: () => Promise<string | null>; expired: () => void }): void { refresh = hooks.refresh; expired = hooks.expired; }
export async function refreshAccessToken(staleToken: string | null): Promise<string | null> {
  if (token && token !== staleToken) return token;
  if (refreshing) return refreshing;
  const epoch = generation;
  refreshing = (async () => {
    try { const value = await refresh?.(); if (generation !== epoch) return token; token = value ?? null; generation += 1; return token; }
    catch (cause: unknown) { if (generation === epoch && cause instanceof ApiError && [400, 401, 403].includes(cause.status)) expired?.(); throw cause; }
    finally { refreshing = null; }
  })();
  return refreshing;
}
