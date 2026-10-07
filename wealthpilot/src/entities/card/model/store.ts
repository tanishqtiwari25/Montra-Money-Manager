import { createCollectionStore } from '@shared/lib';
import { cardApi } from '../api/card.mock';
export const useCards = createCollectionStore(() => cardApi.list());
