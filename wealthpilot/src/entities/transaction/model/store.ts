import { createCollectionStore } from '@shared/lib';
import { transactionApi } from '../api/transaction.api';
export const useTransactions = createCollectionStore(async () => { const items = []; let page = 1; for (;;) { const result = await transactionApi.list({ page, pageSize: 500 }); items.push(...result.items); if (items.length >= result.total || result.items.length === 0) return items; page += 1; } });
