import { useLocalStorage } from '@mantine/hooks';
import { CGM_THEME } from '@/parcels/auth/AuthContextProvider.tsx';

export function useLanguage() {
  return useLocalStorage<'en' | 'de'>({
    key: CGM_THEME,
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });
}
