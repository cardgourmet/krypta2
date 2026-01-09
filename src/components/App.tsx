import { useMediaQuery } from '@mantine/hooks';
import { IconMenu2, IconMoon, IconSearch, IconUser, IconX } from '@tabler/icons-react';
import { Link, Outlet } from '@tanstack/react-router';
import { useState } from 'react';
import { DLCIcon } from '@/helpers/icons/games/dlc/Icon.tsx';
import { MTGIcon } from '@/helpers/icons/games/mtg/Icon.tsx';
import { PCGIcon } from '@/helpers/icons/games/pcg/Icon.tsx';
import { Logo } from '@/helpers/icons/Logo.tsx';
import styles from './App.module.css';

function App() {
  const smallScreen = useMediaQuery('(max-width: 720px)');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <>
      <nav className={`${styles.mobileSidebar} ${sidebarOpen ? styles.shown : ''}`}>
        <div className={styles.mobileSidebarTop}>
          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
            }}
          >
            <IconX size={20} />
          </button>
        </div>

        <div className={styles.mobileSidebarBottom}>
          <Link to="/mtg" className={styles.mobileSidebarLink} onClick={() => setSidebarOpen(false)}>
            <MTGIcon height={24} width={24} color={'#9ba6b1'} />
            <p>Magic: The Gathering</p>
          </Link>
          <Link to="/pcg" className={styles.mobileSidebarLink} onClick={() => setSidebarOpen(false)}>
            <PCGIcon height={24} width={24} color={'#9ba6b1'} />
            <p>Pokémon Card Game</p>
          </Link>
          <Link
            to="/dlc"
            className={`${styles.mobileSidebarLink} ${styles.active}`}
            onClick={() => setSidebarOpen(false)}
          >
            <DLCIcon height={24} width={24} color={'#9ba6b1'} />
            <p>Disney Lorcana</p>
          </Link>
        </div>
      </nav>

      {!smallScreen && (
        <nav className={styles.sidebar}>
          <Link to="/" className={styles.sidebarLogo}>
            <Logo height={30} width={30} style={{ color: '#b6c2cf' }} />
          </Link>

          <div>
            <Link to="/mtg" className={styles.sidebarButton}>
              <MTGIcon height={24} width={24} />
            </Link>
            <Link to="/pcg" className={styles.sidebarButton}>
              <PCGIcon height={24} width={24} />
            </Link>
            <Link to="/dlc" className={styles.sidebarButton} data-state={'enabled'}>
              <DLCIcon height={24} width={24} />
            </Link>
          </div>
        </nav>
      )}

      {!smallScreen && (
        <nav className={styles.navbar}>
          <div className={styles.navbarLeft}>
            <p>Über uns</p>
            <p>Dokumentation</p>
          </div>

          <div className={styles.navbarSearch}>
            <p>Search</p>
            <p>?</p>
          </div>

          <div className={styles.navbarRight}>
            <IconMoon size={18} color={'#9ba6b1'} />
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

      <div className={styles.mainContent}>
        <Outlet />
      </div>
    </>
  );
}

export default App;
