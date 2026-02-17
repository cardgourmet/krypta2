import {Combobox, Group, useCombobox, useMantineColorScheme} from '@mantine/core';
import {IconCheck, IconMoon, IconSun, IconSunMoon} from '@tabler/icons-react';
import {ItemButton} from '@/parcels/homepage/Navbar/UserDisplay/MobileUserDisplay.tsx';

export function MobileThemeSelector() {
  const { colorScheme, setColorScheme } = useMantineColorScheme();

  const combobox = useCombobox();
  const items = {
    dark: 'Dark Mode',
    light: 'Light Mode',
    auto: 'Auto',
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
          title={'Farbschema'}
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
