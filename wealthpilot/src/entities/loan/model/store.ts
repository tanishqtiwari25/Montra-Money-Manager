import { createCollectionStore } from '@shared/lib';
import { loanApi } from '../api/loan.api';
export const useLoans = createCollectionStore(() => loanApi.list());
