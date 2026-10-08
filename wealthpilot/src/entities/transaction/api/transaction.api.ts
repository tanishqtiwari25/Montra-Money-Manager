import { http, normalize, queryString, resourceId, ApiError } from '@shared/api';
import { IS_DEMO } from '@shared/config';
import type { TransactionApi, Transaction } from '../model/types';
import { transactionApi as demo } from './transaction.mock';
const versions = new Map<string, string>();
export function clearTransactionVersions(): void { versions.clear(); }
const real: TransactionApi = {
 list: async (query = {}, options) => normalize(await http.get('/transactions' + queryString(query), options)),
 get: async (id, options) => { const result = await http.getWithMetadata<Transaction>('/transactions/' + resourceId(id), options); if (result.etag) versions.set(id, result.etag); else versions.delete(id); return normalize(result.data); },
 create: async (input, options) => normalize(await http.command('/transactions', input, options)),
 update: async (id, input, options) => { const etag = options?.etag ?? versions.get(id); if (!etag) throw new ApiError('CONFLICT', 'Reload this transaction before editing. The API must expose the ETag header.'); const result = await http.patch<Transaction>('/transactions/' + resourceId(id), input, { ...options, etag }); versions.delete(id); return normalize(result); },
 remove: async (id, options) => { if (!options?.etag && !versions.has(id)) await real.get(id, options); const etag = options?.etag ?? versions.get(id); if (!etag) throw new ApiError('CONFLICT', 'Cannot safely delete: the API must expose the ETag header. Reload and retry.'); await http.delete('/transactions/' + resourceId(id), { ...options, etag }); versions.delete(id); return { id }; },
};
export const transactionApi = IS_DEMO ? demo : real;
