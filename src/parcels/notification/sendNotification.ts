import { type NotificationData, notifications } from '@mantine/notifications';
import type { ReactElement } from 'react';

export function sendNotification(
  state: 'success' | 'error',
  element: ReactElement,
  position?: NotificationData['position'],
) {
  notifications.show({
    autoClose: 3_000,
    color: state === 'success' ? 'var(--gourmet-green-1)' : 'var(--gourmet-red-01)',
    message: element,
    position: position,
  });
}
