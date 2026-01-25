import { useMantineColorScheme } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconLanguage, IconMenu2, IconMoon, IconSearch, IconSun, IconSunMoon, IconUser } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Logo } from '@/parcels/Logo.tsx';
import Dropdown from '@/parcels/overview/Dropdown/Dropdown.tsx';
import Searchbar from '@/parcels/search/Searchbar/Searchbar.tsx';
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

  return (
    <>
      {!smallScreen && (
        <nav className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <p>Über uns</p>
            <p>Dokumentation</p>
          </div>

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
              renderButtonContent={() => <IconLanguage size={22} color={'var(--gourmet-neutral-dark-9)'} />}
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
                    {selected === 'dark' && <IconMoon size={22} color={'var(--gourmet-neutral-dark-9)'} />}
                    {selected === 'light' && <IconSun size={22} color={'var(--gourmet-neutral-dark-9)'} />}
                    {selected === 'system' && <IconSunMoon size={22} color={'var(--gourmet-neutral-dark-9)'} />}
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
              <IconMenu2 size={18} color={'var(--gourmet-neutral-dark-9)'} />
            </button>
            <button type="button">
              <IconSearch size={18} color={'var(--gourmet-neutral-dark-9)'} />
            </button>
          </div>
          <div>
            <Link to="/" style={{ margin: 'auto' }}>
              <Logo height={30} width={30} style={{ color: 'var(--gourmet-neutral-dark-10)' }} />
            </Link>
          </div>
          <div style={{ flex: 1, justifyContent: 'flex-end' }}>
            <button type="button">
              <IconUser size={18} color={'var(--gourmet-neutral-dark-9)'} />
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
