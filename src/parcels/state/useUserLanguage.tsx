import { type UseStorageReturnValue, useLocalStorage } from '@mantine/hooks';
import { useCallback } from 'react';

const CGM_LANGUAGE = 'cgm-language';

export function useUserLanguage() {
  // const { user, updateUser } = useAuth();

  const [language, setLanguage, deleteLanguage] = useLocalStorage<'en' | 'de'>({
    key: CGM_LANGUAGE,
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });
  const setLanguageWrapper = useCallback(
    (lang: 'en' | 'de') => {
      setLanguage(lang);

      /*if (!user?.id) return;
      startTransition(async () => {
        const res = await updateUserSettings({
          ...user?.settings,
          preferredLanguages: {
            ...user?.settings?.preferredLanguages,
            global: lang,
          },
        });

        if (res.data) updateUser(res.data);
      });*/
    },
    [setLanguage],
  );

  return [language, setLanguageWrapper, deleteLanguage] as UseStorageReturnValue<'en' | 'de'>;
}
