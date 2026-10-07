import { createCollectionStore } from '@shared/lib';
import { goalApi } from '../api/goal.mock';
export const useGoals = createCollectionStore(() => goalApi.list());
