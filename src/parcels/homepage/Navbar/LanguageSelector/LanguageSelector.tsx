import { Center, Combobox, Group, UnstyledButton, useCombobox } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { IconCheck, IconLanguage } from '@tabler/icons-react';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CGM_THEME } from '@/parcels/auth/AuthContextProvider.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const { t } = useTranslation('nav', { keyPrefix: 'language' });

  const [language, setLanguage] = useLocalStorage<'en' | 'de'>({
    key: CGM_THEME,
    defaultValue: 'en',
    getInitialValueInEffect: true,
  });
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

  const combobox = useCombobox();
  const items = {
    de: t('de'),
    en: t('en'),
  };
  const options = Object.entries(items).map(([key, value]) => (
    <Combobox.Option value={key} key={key}>
      <Group justify={'space-between'}>
        <Group>
          <GourmetText
            cgmff={'ui'}
            fw={key === localLanguage ? '600' : 'inherit'}
            cgmc={key === localLanguage ? 'neutral-9' : 'neutral-7'}
          >
            {value}
          </GourmetText>
        </Group>
        {key === localLanguage && <IconCheck size={18} color={'var(--gourmet-neutral-9)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setLocalLanguage(optionValue);
        combobox.closeDropdown();

        // "If one frame is still not enough, use a double requestAnimationFrame"
        // - and so I did. (it actually works, with only one it doesn't)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            startTransition(() => {
              setLanguage(optionValue as 'de' | 'en');
            });
          });
        });
      }}
      store={combobox}
      position="bottom-start"
      withinPortal={false}
    >
      <Combobox.Target>
        <UnstyledButton
          className={styles.iconButton}
          onClick={() => {
            if (combobox.dropdownOpened) combobox.closeDropdown();
            else combobox.openDropdown();
          }}
        >
          <Center>
            <IconLanguage size={22} color={'var(--gourmet-neutral-8)'} />
          </Center>
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown miw={'10rem'}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
