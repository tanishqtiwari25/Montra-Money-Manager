import { createCollectionStore } from '@shared/lib';
import { loanApi } from '../api/loan.mock';
export const useLoans = createCollectionStore(() => loanApi.list());
