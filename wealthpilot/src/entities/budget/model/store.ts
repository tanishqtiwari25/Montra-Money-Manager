import { createCollectionStore } from '@shared/lib';
import { budgetApi } from '../api/budget.mock';
export const useBudgets = createCollectionStore(() => budgetApi.list());
