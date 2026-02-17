import {Combobox, Group, useCombobox} from '@mantine/core';
import {IconCheck, IconLanguage} from '@tabler/icons-react';
import {useEffect, useEffectEvent, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {ItemButton} from '@/parcels/homepage/Navbar/UserDisplay/MobileUserMenu.tsx';

export function MobileLanguageSelector() {
  const { i18n } = useTranslation();
  const [language, setLanguage] = useState<string>('en');
  const switchLanguage = useEffectEvent((language: string) => {
    // noinspection JSIgnoredPromiseFromCall
    i18n.changeLanguage(language);
  });

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    switchLanguage(language);
  }, [language]);

  const combobox = useCombobox();
  const items = {
    de: 'Deutsch',
    en: 'English',
  };
  const options = Object.entries(items).map(([key, value]) => (
    <Combobox.Option value={key} key={key}>
      <Group justify={'space-between'}>
        <Group>{value}</Group>
        {key === language && <IconCheck size={18} color={'var(--gourmet-neutral-8)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setLanguage(optionValue);
        combobox.closeDropdown();
      }}
      store={combobox}
      position="bottom-start"
      withinPortal={false}
    >
      <Combobox.Target>
        <ItemButton
          title={'Sprache'}
          icon={<IconLanguage size={18} color={'var(--gourmet-neutral-8)'} />}
          onClick={() => {
            if (combobox.dropdownOpened) combobox.closeDropdown();
            else combobox.openDropdown();
          }}
        />
      </Combobox.Target>

      <Combobox.Dropdown>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
