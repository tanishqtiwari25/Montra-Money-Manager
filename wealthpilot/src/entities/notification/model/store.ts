import { createCollectionStore } from '@shared/lib';
import { notificationApi } from '../api/notification.mock';
export const useNotifications = createCollectionStore(() => notificationApi.list());
