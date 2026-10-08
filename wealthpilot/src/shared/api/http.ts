import { API_BASE_URL } from '@shared/config';
import { ApiError, type RequestOptions } from './types';
import { getAccessToken, getSessionEpoch, refreshAccessToken } from './session';
type Metadata<T> = { data: T; etag: string | null };
function errorDetails(value: unknown): Record<string, unknown> { return value && typeof value === 'object' ? value as Record<string, unknown> : {}; }
async function request<T>(method: string, path: string, body?: unknown, options: RequestOptions = {}, retried = false): Promise<Metadata<T>> {
  if (options.signal?.aborted) throw new ApiError('ABORTED', 'Request cancelled.', 499);
  const controller = new AbortController();
  const abort = () => controller.abort(); options.signal?.addEventListener('abort', abort, { once: true });
  const timeout = setTimeout(() => controller.abort(), 45000);
  const token = getAccessToken();
  const ownerEpoch = getSessionEpoch();
  const identity = path.startsWith('/auth/');
  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');
  if (body !== undefined) headers.set('Content-Type', 'application/json');
  if (token && options.auth !== false) headers.set('Authorization', 'Bearer ' + token);
  if (identity && method === 'POST') headers.set('X-WealthPilot-CSRF', '1');
  if (options.idempotencyKey) headers.set('Idempotency-Key', options.idempotencyKey);
  if (options.etag) headers.set('If-Match', options.etag);
  try {
    const response = await fetch(API_BASE_URL + path, { method, headers, credentials: 'include', signal: controller.signal, ...(body === undefined ? {} : { body: JSON.stringify(body) }) });
    if (options.auth !== false && getSessionEpoch() !== ownerEpoch) throw new ApiError('ABORTED', 'The signed-in account changed. Reopen this page before continuing.', 499);
    if (response.status === 401 && !identity && options.auth !== false && !retried) {
      const renewed = await refreshAccessToken(token);
      if (getSessionEpoch() !== ownerEpoch) throw new ApiError('ABORTED', 'The signed-in account changed.', 499);
      if (renewed) return request<T>(method, path, body, options, true);
    }
    const raw = await response.text();
    let data: unknown;
    try { data = raw ? JSON.parse(raw) : undefined; } catch { throw new ApiError('NETWORK', 'The API returned an unreadable response. Check the API URL and server.', response.status); }
    if (!response.ok) {
      const details = errorDetails(data);
      const code = response.status === 401 ? 'UNAUTHORIZED' : response.status === 403 ? 'FORBIDDEN' : response.status === 404 ? 'NOT_FOUND' : response.status === 409 || response.status === 412 ? 'CONFLICT' : response.status === 429 ? 'RATE_LIMIT' : response.status >= 500 ? 'NETWORK' : 'VALIDATION';
      const fields = errorDetails(details.fieldErrors); const fieldMessage = Object.entries(fields).map(([key,value]) => key + ': ' + (Array.isArray(value) ? value.join(' ') : String(value))).join(' ');
      const message = (typeof details.message === 'string' ? details.message : 'Request failed (' + response.status + ').') + (fieldMessage ? ' ' + fieldMessage : '');
      throw new ApiError(code, message, response.status, details);
    }
    return { data: data as T, etag: response.headers.get('ETag') };
  } catch (cause: unknown) {
    if (cause instanceof ApiError) throw cause;
    if (controller.signal.aborted) throw new ApiError(options.signal?.aborted ? 'ABORTED' : 'NETWORK', options.signal?.aborted ? 'Request cancelled.' : 'The request timed out. Retry with the same details.', options.signal?.aborted ? 499 : 504);
    throw new ApiError('NETWORK', 'Cannot reach the API. Check the connection, API URL and allowed frontend origin.', 503);
  } finally { clearTimeout(timeout); options.signal?.removeEventListener('abort', abort); }
}
const intentions = new Map<string, { key: string; pending?: Promise<unknown> }>();
function canonical(value: unknown): unknown { if (Array.isArray(value)) return value.map(canonical); if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).sort(([a], [b]) => a.localeCompare(b)).map(([key, item]) => [key, canonical(item)])); return value; }
export function clearMutationIntents(): void { intentions.clear(); }
async function command<T>(path: string, body: unknown, options: RequestOptions = {}): Promise<T> {
  const fingerprint = path + ':' + (options.idempotencyKey ?? '') + ':' + JSON.stringify(canonical(body));
  let intent = intentions.get(fingerprint);
  if (!intent) { if (intentions.size >= 300) throw new ApiError('CONFLICT', 'Too many unresolved writes. Finish or retry pending actions before creating more.'); intent = { key: options.idempotencyKey ?? crypto.randomUUID() }; intentions.set(fingerprint, intent); }
  if (intent.pending) return intent.pending as Promise<T>;
  const active = intent;
  const pending = request<T>('POST', path, body, { ...options, idempotencyKey: active.key }).then(result => { if (intentions.get(fingerprint) === active) intentions.delete(fingerprint); return result.data; }).catch((cause: unknown) => { if (cause instanceof ApiError && [400, 403, 404, 422].includes(cause.status) && intentions.get(fingerprint) === active) intentions.delete(fingerprint); throw cause; }).finally(() => { active.pending = undefined; });
  active.pending = pending; return pending;
}
export const http = {
  get: async <T>(path: string, options?: RequestOptions) => (await request<T>('GET', path, undefined, options)).data,
  getWithMetadata: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: async <T>(path: string, body: unknown, options?: RequestOptions) => (await request<T>('POST', path, body, options)).data,
  command,
  patch: async <T>(path: string, body: unknown, options?: RequestOptions) => (await request<T>('PATCH', path, body, options)).data,
  delete: async <T>(path: string, options?: RequestOptions) => (await request<T>('DELETE', path, undefined, options)).data,
};
