import {showNotification} from '@mantine/notifications';
import {useCallback} from 'react';

export function useGourmetNotification() {
  const show = useCallback((title: string, msg: string, type: 'success' | 'error') => {
    showNotification({
      color: type === 'success' ? 'var(--gourmet-green-1)' : 'var(--gourmet-red-01)',
      title: title,
      message: msg,
      position: 'bottom-right',
      autoClose: false,
    });
  }, []);

  return { show };
}
