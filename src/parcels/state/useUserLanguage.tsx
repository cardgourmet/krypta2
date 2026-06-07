import { type UseStorageReturnValue, useLocalStorage } from '@mantine/hooks';
import { startTransition, useCallback } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { updateUserSettings } from '@/parcels/auth/api.ts';

const CGM_LANGUAGE = 'cgm-language';

export function useUserLanguage() {
  const { user, updateUser } = useAuth();

  const [language, setLanguage, deleteLanguage] = useLocalStorage<'en' | 'de'>({
    key: CGM_LANGUAGE,
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });
  const setLanguageWrapper = useCallback(
    (lang: 'en' | 'de') => {
      setLanguage(lang);

      if (!user?.id) return;
      startTransition(async () => {
        const res = await updateUserSettings({
          ...user?.settings,
          preferredLanguages: {
            ...user?.settings?.preferredLanguages,
            global: lang,
          },
        });

        if (res.data) updateUser(res.data);
      });
    },
    [setLanguage, updateUser, user],
  );

  return [language, setLanguageWrapper, deleteLanguage] as UseStorageReturnValue<'en' | 'de'>;
}
