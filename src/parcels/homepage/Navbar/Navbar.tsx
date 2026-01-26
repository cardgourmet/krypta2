import { Button, Combobox, Drawer, Group, TextInput, useCombobox, useMantineColorScheme } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import {
  IconCaretDownFilled,
  IconCheck,
  IconLanguage,
  IconMenu2,
  IconMoon,
  IconSearch,
  IconSun,
  IconSunMoon,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/parcels/Logo.tsx';
import Dropdown from '@/parcels/overview/Dropdown/Dropdown.tsx';
import Searchbar from '@/parcels/search/Searchbar/Searchbar.tsx';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import styles from './Navbar.module.css';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const smallScreen = useMediaQuery('(max-width: 720px)');
  const { setColorScheme } = useMantineColorScheme();

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

  const [mobileSearchOpened, { open, close }] = useDisclosure(false);

  const combobox = useCombobox();
  const [value, setValue] = useState<string | null>('dlc');

  return (
    <>
      <Drawer
        classNames={{
          content: styles.searchBarDrawer,
        }}
        size="100%"
        opened={mobileSearchOpened}
        onClose={close}
        withCloseButton={false}
      >
        <Group>
          <TextInput
            leftSection={
              <Combobox
                store={combobox}
                width={200}
                position="bottom-start"
                onOptionSubmit={(val) => {
                  setValue(val);
                  combobox.closeDropdown();
                }}
              >
                <Combobox.Target>
                  <Button
                    classNames={{ root: styles.testButtonRoot }}
                    onClick={() => {
                      combobox.toggleDropdown();
                    }}
                  >
                    {value === 'dlc' && <DLCIcon width={20} height={20} color={'var(--gourmet-neutral-8)'} />}
                    {value === 'mtg' && <MTGIcon width={20} height={20} color={'var(--gourmet-neutral-8)'} />}
                    {value === 'pcg' && <PCGIcon width={20} height={20} color={'var(--gourmet-neutral-8)'} />}
                    <IconCaretDownFilled width={14} height={14} color={'var(--gourmet-neutral-8)'} />
                  </Button>
                </Combobox.Target>

                <Combobox.Dropdown>
                  <Combobox.Options>
                    {Object.entries({
                      mtg: 'Magic: The Gathering',
                      dlc: 'Disney Lorcana',
                      pcg: 'Pokémon Card Game',
                    }).map(([tcg, name], index) => (
                      <Combobox.Option value={tcg} key={index} active={value === tcg}>
                        <Group justify={'space-between'}>
                          {name}
                          {tcg === value && <IconCheck size={16} />}
                        </Group>
                      </Combobox.Option>
                    ))}
                  </Combobox.Options>
                </Combobox.Dropdown>
              </Combobox>
            }
            rightSection={
              <Button classNames={{ root: styles.testButtonRoot }}>
                <IconX size={16} color={'var(--gourmet-neutral-8)'} />
              </Button>
            }
            classNames={{
              root: styles.testInputRoot,
              input: styles.testInput,
              section: styles.testInputSection,
            }}
          />
          <Button onClick={close}>
            <IconX size={16} color={'var(--gourmet-neutral-8)'} />
          </Button>
        </Group>
        Hallo Welt
      </Drawer>

      {!smallScreen && (
        <nav className={styles.navbar}>
          <div className={styles.navbarSearch}>
            <Searchbar />
          </div>

          <div className={styles.navbarRight}>
            <Dropdown
              className={styles.iconButton}
              items={{
                de: 'Deutsch',
                en: 'English',
              }}
              defaultSelected={language}
              renderButtonContent={() => <IconLanguage size={22} color={'var(--gourmet-neutral-8)'} />}
              onSelect={(selected) => {
                setLanguage(selected);
              }}
            />
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
            <button type="button">Anmelden / Registrieren</button>
          </div>
        </nav>
      )}
      {smallScreen && (
        <nav className={styles.mobileNavbar}>
          <div style={{ flex: 1 }}>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(true);
              }}
            >
              <IconMenu2 size={18} color={'var(--gourmet-neutral-8)'} />
            </button>
            <button type="button" onClick={open}>
              <IconSearch size={18} color={'var(--gourmet-neutral-8)'} />
            </button>
          </div>
          <div>
            <Link to="/" style={{ margin: 'auto' }}>
              <Logo height={30} width={30} style={{ color: 'var(--gourmet-neutral-9)' }} />
            </Link>
          </div>
          <div style={{ flex: 1, justifyContent: 'flex-end' }}>
            <button type="button">
              <IconUser size={18} color={'var(--gourmet-neutral-8)'} />
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
