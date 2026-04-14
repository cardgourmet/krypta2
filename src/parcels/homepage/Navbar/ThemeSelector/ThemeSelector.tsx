import {Center, Combobox, Group, UnstyledButton, useCombobox, useMantineColorScheme} from '@mantine/core';
import {IconCheck, IconMoon, IconSun, IconSunMoon} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import styles from './ThemeSelector.module.css';

export function ThemeSelector() {
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
          <GourmetText
            cgmff={'ui'}
            fw={key === colorScheme ? '600' : 'inherit'}
            cgmc={key === colorScheme ? 'neutral-9' : 'neutral-7'}
          >
            {value}
          </GourmetText>
        </Group>
        {key === colorScheme && <IconCheck size={18} color={'var(--gourmet-neutral-9)'} />}
      </Group>
    </Combobox.Option>
  ));

  return (
    <Combobox
      onOptionSubmit={(optionValue) => {
        setColorScheme(optionValue as 'light' | 'dark' | 'auto');
        combobox.closeDropdown();
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
            {colorScheme === 'dark' && <IconMoon size={22} color={'var(--gourmet-neutral-8)'} />}
            {colorScheme === 'light' && <IconSun size={22} color={'var(--gourmet-neutral-8)'} />}
            {colorScheme === 'auto' && <IconSunMoon size={22} color={'var(--gourmet-neutral-8)'} />}
          </Center>
        </UnstyledButton>
      </Combobox.Target>

      <Combobox.Dropdown miw={'8rem'}>
        <Combobox.Options>{options}</Combobox.Options>
      </Combobox.Dropdown>
    </Combobox>
  );
}
