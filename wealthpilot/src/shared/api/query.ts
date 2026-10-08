export function queryString(values: object): string { const params = new URLSearchParams(); for (const [key, value] of Object.entries(values)) if (value !== undefined && value !== null && value !== '') params.set(key, String(value)); const query = params.toString(); return query ? '?' + query : ''; }
// Optional DTO fields use null on the wire and undefined in the existing UI models.
export function normalize<T>(value: unknown): T { if (Array.isArray(value)) return value.map(item => normalize(item)) as T; if (value && typeof value === 'object') return Object.fromEntries(Object.entries(value).filter(([,item]) => item !== null).map(([key,item]) => [key, normalize(item)])) as T; return value as T; }
export const resourceId = (id: string) => encodeURIComponent(id);
