import { createCollectionStore } from '@shared/lib';
import { accountApi } from '../api/account.mock';
export const useAccounts = createCollectionStore(() => accountApi.list());
