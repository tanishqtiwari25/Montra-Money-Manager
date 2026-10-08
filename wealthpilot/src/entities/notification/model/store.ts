import { createCollectionStore } from '@shared/lib';
import { notificationApi } from '../api/notification.api';
export const useNotifications = createCollectionStore(() => notificationApi.list());
