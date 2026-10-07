import axios from 'axios';
import { ApiError, type RequestOptions } from './types';
const client = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL ?? '/api', timeout: 15000 });
async function request<T>(method: 'GET' | 'POST' | 'PATCH' | 'DELETE', path: string, body?: unknown, options: RequestOptions = {}): Promise<T> {
  try { return (await client.request<T>({ method, url: path, data: body, signal: options.signal })).data; }
  catch (error: unknown) {
    if (axios.isCancel(error)) throw new ApiError('ABORTED', 'Request cancelled.', 499);
    if (axios.isAxiosError(error)) {
      const status = error.response?.status ?? 503;
      throw new ApiError(status === 404 ? 'NOT_FOUND' : status === 409 ? 'CONFLICT' : status < 500 ? 'VALIDATION' : 'NETWORK', 'Request failed. Please try again.', status);
    }
    throw new ApiError('NETWORK', 'An unexpected request error occurred.', 503);
  }
}
export const http = {
  get: <T>(path: string, options?: RequestOptions) => request<T>('GET', path, undefined, options),
  post: <T>(path: string, body: unknown, options?: RequestOptions) => request<T>('POST', path, body, options),
  patch: <T>(path: string, body: unknown, options?: RequestOptions) => request<T>('PATCH', path, body, options),
  delete: <T>(path: string, options?: RequestOptions) => request<T>('DELETE', path, undefined, options),
};
