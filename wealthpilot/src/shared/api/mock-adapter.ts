import { ApiError, type RequestOptions } from './types';
const PREFIX = 'wealthpilot.demo.v1.';
let failureCount = 0;
const resetters = new Set<() => void>();
const resources = new Map<string, { read: () => unknown[]; initial: () => unknown[]; write: (items: unknown[]) => void }>();
const views = new Map<string, () => unknown>();
export function readMockResource<T>(key: string): { items: T[]; initial: T[] } | null {
  const resource = resources.get(key);
  return resource ? { items: resource.read() as T[], initial: resource.initial() as T[] } : null;
}
export function registerMockView<T>(key: string, read: () => T): void { views.set(key, read); }
export function readMockView<T>(key: string): T | null { const read = views.get(key); return read ? structuredClone(read()) as T : null; }
export function writeMockResource<T>(key: string, items: T[]): void {
  const resource = resources.get(key);
  if (!resource) throw new ApiError('NETWORK', 'Demo dataset not initialized. Reload the application.', 503);
  resource.write(structuredClone(items));
}
export function failNextMockRequests(count = 1): void { failureCount = Math.max(0, count); }
export function resetMockData(): void {
  failureCount = 0;
  resetters.forEach(reset => reset());
  try {
    if (typeof localStorage === 'undefined') return;
    const keys = Array.from({ length: localStorage.length }, (_, i) => localStorage.key(i));
    keys.forEach(key => { if (key?.startsWith(PREFIX)) localStorage.removeItem(key); });
  } catch { /* Storage can be unavailable. */ }
}
export function mockCollection<T>(key: string, seed: () => T[]) {
  let memory: T[] | undefined;
  const read = (): T[] => {
    if (!memory) {
      try {
        const raw = typeof localStorage !== 'undefined' ? localStorage.getItem(PREFIX + key) : null;
        memory = raw ? JSON.parse(raw) as T[] : seed();
        if (!Array.isArray(memory)) memory = seed();
      } catch { memory = seed(); }
    }
    return structuredClone(memory);
  };
  const write = (value: T[]): void => {
    memory = structuredClone(value);
    try { localStorage.setItem(PREFIX + key, JSON.stringify(value)); } catch { /* In-memory fallback. */ }
  };
  resetters.add(() => { memory = undefined; });
  resources.set(key, { read, initial: seed, write: items => write(items as T[]) });
  return { read, write };
}
export async function mockRequest<T>(operation: () => T, options: RequestOptions = {}, delay = 350): Promise<T> {
  if (options.signal?.aborted) throw new ApiError('ABORTED', 'Request cancelled.', 499);
  await new Promise<void>((resolve, reject) => {
    const abort = () => {
      clearTimeout(timer);
      options.signal?.removeEventListener('abort', abort);
      reject(new ApiError('ABORTED', 'Request cancelled.', 499));
    };
    const timer = setTimeout(() => { options.signal?.removeEventListener('abort', abort); resolve(); }, delay);
    options.signal?.addEventListener('abort', abort, { once: true });
  });
  if (options.signal?.aborted) throw new ApiError('ABORTED', 'Request cancelled.', 499);
  if (failureCount > 0) { failureCount--; throw new ApiError('NETWORK', 'Demo request failed. Please retry.', 503); }
  return structuredClone(operation());
}
export function requireRecord<T extends { id: string }>(items: T[], id: string): T {
  const item = items.find(candidate => candidate.id === id);
  if (!item) throw new ApiError('NOT_FOUND', 'This item no longer exists.', 404);
  return item;
}
export function requirePaise(value: number, label = 'Amount', allowZero = false): void {
  if (!Number.isSafeInteger(value) || value < (allowZero ? 0 : 1)) {
    throw new ApiError('VALIDATION', label + ' must be a ' + (allowZero ? 'non-negative' : 'positive') + ' integer in paise.');
  }
}
export function requireDate(value: string): void {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value) || !Number.isFinite(Date.parse(value + 'T00:00:00+05:30')) ||
    new Date(value + 'T00:00:00Z').toISOString().slice(0, 10) !== value) {
    throw new ApiError('VALIDATION', 'Enter a valid calendar date.');
  }
}
