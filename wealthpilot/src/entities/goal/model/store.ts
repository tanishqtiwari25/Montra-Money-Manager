import { createCollectionStore } from '@shared/lib';
import { goalApi } from '../api/goal.api';
export const useGoals = createCollectionStore(() => goalApi.list());
