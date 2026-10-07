import { createCollectionStore } from '@shared/lib';
import { transactionApi } from '../api/transaction.mock';
export const useTransactions = createCollectionStore(async () => (await transactionApi.list({ pageSize: 500 })).items);
