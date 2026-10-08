import { createCollectionStore } from '@shared/lib';
import { budgetApi } from '../api/budget.api';
export const useBudgets = createCollectionStore(() => budgetApi.list());
