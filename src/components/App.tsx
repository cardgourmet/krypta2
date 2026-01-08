import { useMediaQuery } from '@mantine/hooks';
import { Link, Outlet } from '@tanstack/react-router';
import { LucideMenu, LucideMoon, LucideSearch, LucideUserRound } from 'lucide-react';
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
      {sidebarOpen && (
        <nav className={styles.mobileSidebar}>
          <div className={styles.mobileSidebarTop}>
            <Link to="/" className={styles.sidebarLogo}>
              <Logo height={24} width={24} style={{ color: '#9ba6b1' }} />
            </Link>
            <button
              type="button"
              onClick={() => {
                setSidebarOpen(false);
              }}
            >
              Close
            </button>
          </div>

          <div className={styles.mobileSidebarBottom}>
            <div>
              <a href="/mtg">
                <MTGIcon height={24} width={24} color={'#9ba6b1'} />
              </a>
              <p>Magic: The Gathering</p>
            </div>

            <div>
              <a href="/pcg">
                <PCGIcon height={24} width={24} color={'#9ba6b1'} />
              </a>
              <p>Pokémon Card Game</p>
            </div>
            <div>
              <a href="/dlc">
                <DLCIcon height={24} width={24} color={'#9ba6b1'} />
              </a>
              <p>Disney Lorcana</p>
            </div>
          </div>
        </nav>
      )}
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
            <LucideMoon size={18} color={'#9ba6b1'} />
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
              <LucideMenu size={18} color={'#9ba6b1'} />
            </button>
            <button type="button">
              <LucideSearch size={18} color={'#9ba6b1'} />
            </button>
          </div>
          <div>
            <Link to="/" style={{ margin: 'auto' }}>
              <Logo height={30} width={30} style={{ color: '#b6c2cf' }} />
            </Link>
          </div>
          <div style={{ flex: 1, justifyContent: 'flex-end' }}>
            <button type="button">
              <LucideUserRound size={18} color={'#9ba6b1'} />
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
