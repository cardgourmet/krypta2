import {useMantineColorScheme} from '@mantine/core';
import {IconMoon, IconSun, IconSunMoon} from '@tabler/icons-react';
import Dropdown from '@/parcels/overview/Dropdown/Dropdown.tsx';
import styles from './ThemeSelector.module.css';

export function ThemeSelector() {
  const { setColorScheme } = useMantineColorScheme();

  return (
    <Dropdown
      className={styles.iconButton}
      items={{
        dark: 'Dark Mode',
        light: 'Light Mode',
        system: 'Auto',
      }}
      defaultSelected={'dark'}
      renderButtonContent={(selected) => {
        return (
          <>
            {selected === 'dark' && <IconMoon size={22} color={'var(--gourmet-neutral-8)'} />}
            {selected === 'light' && <IconSun size={22} color={'var(--gourmet-neutral-8)'} />}
            {selected === 'system' && <IconSunMoon size={22} color={'var(--gourmet-neutral-8)'} />}
          </>
        );
      }}
      onSelect={(selected) => {
        if (selected === 'system') setColorScheme('auto');
        else setColorScheme(selected as 'light' | 'dark');
      }}
    />
  );
}
