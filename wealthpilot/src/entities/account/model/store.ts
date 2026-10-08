import { createCollectionStore } from '@shared/lib';
import { accountApi } from '../api/account.api';
export const useAccounts = createCollectionStore(() => accountApi.list());
