import {Center, Combobox, Group, UnstyledButton, useCombobox} from '@mantine/core';
import {IconCheck, IconLanguage} from '@tabler/icons-react';
import {startTransition, useCallback, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './LanguageSelector.module.css';

export function LanguageSelector() {
  const { i18n } = useTranslation();
  const { t } = useTranslation('nav', { keyPrefix: 'language' });

  const [language, setLanguage] = useState<string>('en');
  const switchLanguage = useCallback(
    (lang: string) => {
      // noinspection JSIgnoredPromiseFromCall
      i18n.changeLanguage(lang);
    },
    [i18n.changeLanguage],
  );

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
            fw={key === language ? '600' : 'inherit'}
            cgmc={key === language ? 'neutral-9' : 'neutral-7'}
          >
            {value}
          </GourmetText>
        </Group>
        {key === language && <IconCheck size={18} color={'var(--gourmet-neutral-9)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setLanguage(optionValue);
        combobox.closeDropdown();

        startTransition(() => {
          switchLanguage(optionValue);
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
