import { createCollectionStore } from '@shared/lib';
import { cardApi } from '../api/card.api';
export const useCards = createCollectionStore(() => cardApi.list());
