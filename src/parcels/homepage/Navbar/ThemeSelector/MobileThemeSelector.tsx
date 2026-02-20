import {Combobox, Group, useCombobox, useMantineColorScheme} from '@mantine/core';
import {IconCheck, IconMoon, IconSun, IconSunMoon} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {ItemButton} from '@/parcels/homepage/Navbar/UserDisplay/MobileUserMenu.tsx';

export function MobileThemeSelector() {
  const { t } = useTranslation('nav', { keyPrefix: 'theme' });
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const combobox = useCombobox();
  const items = {
    dark: t('dark'),
    light: t('light'),
    auto: t('auto'),
  };
  const options = Object.entries(items).map(([key, value]) => (
    <Combobox.Option value={key} key={key}>
      <Group justify={'space-between'}>
        <Group>
          {key === 'dark' && <IconMoon size={18} color={'var(--gourmet-neutral-8)'} />}
          {key === 'light' && <IconSun size={18} color={'var(--gourmet-neutral-8)'} />}
          {key === 'auto' && <IconSunMoon size={18} color={'var(--gourmet-neutral-8)'} />}

          {value}
        </Group>
        {key === colorScheme && <IconCheck size={18} color={'var(--gourmet-neutral-8)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setColorScheme(optionValue as 'dark' | 'light' | 'auto');
        combobox.closeDropdown();
      }}
      store={combobox}
      position="bottom-start"
      withinPortal={false}
    >
      <Combobox.Target>
        <ItemButton
          title={t('theme')}
          icon={<IconMoon size={18} color={'var(--gourmet-neutral-8)'} />}
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
