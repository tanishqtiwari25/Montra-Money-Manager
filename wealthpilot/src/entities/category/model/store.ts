import { createCollectionStore } from '@shared/lib';
import { categoryApi } from '../api/category.api';
export const useCategories = createCollectionStore(() => categoryApi.list());
