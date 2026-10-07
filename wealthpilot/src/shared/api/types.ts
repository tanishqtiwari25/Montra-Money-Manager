export interface RequestOptions { signal?: AbortSignal }
export interface PageQuery { page?: number; pageSize?: number }
export interface Page<T> { items: T[]; total: number; page: number; pageSize: number }
export type ApiErrorCode = 'VALIDATION' | 'NOT_FOUND' | 'NETWORK' | 'ABORTED' | 'CONFLICT';
export class ApiError extends Error {
  constructor(public readonly code: ApiErrorCode, message: string, public readonly status = 400) {
    super(message); this.name = 'ApiError';
  }
}
export function paginate<T>(items: T[], query: PageQuery = {}): Page<T> {
  const page = Math.max(1, Math.trunc(Number.isFinite(query.page) ? query.page! : 1));
  const pageSize = Math.min(500, Math.max(1, Math.trunc(Number.isFinite(query.pageSize) ? query.pageSize! : 50)));
  return { items: items.slice((page - 1) * pageSize, page * pageSize), total: items.length, page, pageSize };
}
