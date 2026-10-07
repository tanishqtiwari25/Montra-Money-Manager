import { createCollectionStore } from '@shared/lib';
import { categoryApi } from '../api/category.mock';
export const useCategories = createCollectionStore(() => categoryApi.list());
