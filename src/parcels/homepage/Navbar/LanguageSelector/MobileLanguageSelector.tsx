import { Combobox, Group, useCombobox } from '@mantine/core';
import { IconCheck, IconLanguage } from '@tabler/icons-react';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestAnimationFrameTransition } from '@/parcels/animation/requestAnimationFrameTransition.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { updateUserSettings } from '@/parcels/auth/api.ts';
import { ItemButton } from '@/parcels/homepage/Navbar/UserDisplay/MobileUserMenu/MobileUserMenu.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { useUserLanguage } from '@/parcels/state/useUserLanguage.tsx';

export function MobileLanguageSelector() {
  const { i18n } = useTranslation();
  const { t } = useTranslation('nav', { keyPrefix: 'language' });

  const { user, updateUser } = useAuth();
  const [language, setLanguage] = useUserLanguage();
  const [localLanguage, setLocalLanguage] = useState<string>(language);

  const switchLanguage = useCallback(
    (lang: string) => {
      // noinspection JSIgnoredPromiseFromCall
      i18n.changeLanguage(lang);
    },
    [i18n.changeLanguage],
  );
  useEffect(() => {
    switchLanguage(language);
    setLocalLanguage(language);
  }, [language, switchLanguage]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    switchLanguage(language);
  }, [language]);

  const combobox = useCombobox();
  const items = {
    de: t('de'),
    en: t('en'),
  };
  const options = Object.entries(items).map(([key, value]) => (
    <Combobox.Option value={key} key={key}>
      <Group justify={'space-between'}>
        <Group>{value}</Group>
        {key === localLanguage && <IconCheck size={18} color={'var(--gourmet-neutral-8)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(l) => {
        setLocalLanguage(l);
        setLanguage(l as 'en' | 'de');

        if (!user) return;

        requestAnimationFrameTransition(async () => {
          const res = await updateUserSettings({
            ...user?.settings,
            preferredLanguages: {
              ...user?.settings?.preferredLanguages,
              global: l as 'en' | 'de',
            },
          });

          if (res.error) {
            sendErrorNotification(res.error);
            return;
          }

          if (res.data) updateUser(res.data);
        });
      }}
      store={combobox}
      position="bottom-start"
      withinPortal={false}
    >
      <Combobox.Target>
        <ItemButton
          title={t('language')}
          icon={<IconLanguage size={18} color={'var(--gourmet-neutral-8)'} />}
          onClick={() => {
            if (combobox.dropdownOpened) combobox.closeDropdown();
            else combobox.openDropdown();
          }}
          color={'var(--gourmet-neutral-8)'}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
