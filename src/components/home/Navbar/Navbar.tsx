import { useMediaQuery } from '@mantine/hooks';
import {
  IconArrowBack,
  IconArrowDown,
  IconArrowUp,
  IconChevronDown,
  IconClockHour8,
  IconLanguage,
  IconMenu2,
  IconMoon,
  IconQuestionMark,
  IconSearch,
  IconStar,
  IconSun,
  IconSunMoon,
  IconUser,
  IconX,
} from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import IconDropdown from '@/components/dlc/IconDropdown/IconDropdown.tsx';
import { DLCIcon } from '@/helpers/icons/games/dlc/Icon.tsx';
import { Logo } from '@/helpers/icons/Logo.tsx';
import styles from './Navbar.module.css';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const smallScreen = useMediaQuery('(max-width: 720px)');

  return (
    <>
      {!smallScreen && (
        <nav className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <p>Über uns</p>
            <p>Dokumentation</p>
          </div>

          <div className={styles.searchOverlay} />
          <div className={styles.navbarSearch}>
            <div className={styles.searchbar}>
              <IconSearch size={20} color={'#9ba6b1'} className={styles.searchIcon} />
              <input
                type="text"
                onFocus={() => {
                  // TODO: display div around

                  console.log('Focus!');
                }}
              />
              <button type="button">
                <IconQuestionMark size={18} color={'#9ba6b1'} />
              </button>
              <div className={styles.searchModal}>
                <div className={styles.content}>
                  <div className={styles.gameSelector}>
                    <DLCIcon width={20} height={20} color={'#9ba6b1'} />
                    <p>DISNEY LORCANA</p>
                    <IconChevronDown size={18} color={'#9ba6b1'} />
                  </div>
                  <div className={styles.recent}>
                    <p>ZULETZT</p>
                    <ul>
                      {[
                        'ink:amber and type:hero',
                        'name:mickey name:mouse oracle:wunder oracle:haus ink:steel is:inkwell',
                        'ability="Deep Freeze" and o:"chosen characters"',
                        'name:mickey name:mouse oracle:wunder oracle:haus ink:steel is:inkwell',
                        'ability="Deep Freeze" and o:"chosen characters"',
                      ].map((query, index) => (
                        <li key={index}>
                          <div className={styles.recentItemLeft}>
                            <IconClockHour8 size={22} color={'#9ba6b1'} />
                            <p>{query}</p>
                          </div>
                          <div className={styles.recentItemRight}>
                            <IconStar size={16} color={'#9ba6b1'} />
                            <IconX size={16} color={'#9ba6b1'} />
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className={styles.footer}>
                  <div className={styles.controls}>
                    <div>
                      <p>Navigieren</p>
                      <kbd>
                        <IconArrowUp size={18} color={'#9ba6b1'} />
                      </kbd>
                      <kbd>
                        <IconArrowDown size={18} color={'#9ba6b1'} />
                      </kbd>
                    </div>
                    <div>
                      <p>Suche starten</p>
                      <kbd>
                        <IconArrowBack size={18} color={'#9ba6b1'} />
                      </kbd>
                    </div>
                    <div>
                      <p>Schließen</p>
                      <kbd>esc</kbd>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.navbarRight}>
            <IconDropdown
              items={{
                de: 'Deutsch',
                en: 'English',
              }}
              icons={{ _: <IconLanguage size={22} color={'#9ba6b1'} /> }}
              defaultSelected={'de'}
              dynamicIcons={false}
            />
            <IconDropdown
              icons={{
                dark: <IconMoon size={22} color={'#9ba6b1'} />,
                light: <IconSun size={22} color={'#9ba6b1'} />,
                system: <IconSunMoon size={22} color={'#9ba6b1'} />,
              }}
              items={{
                dark: 'Dark Mode',
                light: 'Light Mode',
                system: 'Auto',
              }}
              defaultSelected={'dark'}
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
              <IconMenu2 size={18} color={'#9ba6b1'} />
            </button>
            <button type="button">
              <IconSearch size={18} color={'#9ba6b1'} />
            </button>
          </div>
          <div>
            <Link to="/" style={{ margin: 'auto' }}>
              <Logo height={30} width={30} style={{ color: '#b6c2cf' }} />
            </Link>
          </div>
          <div style={{ flex: 1, justifyContent: 'flex-end' }}>
            <button type="button">
              <IconUser size={18} color={'#9ba6b1'} />
            </button>
          </div>
        </nav>
      )}
    </>
  );
}
