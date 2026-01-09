import { useMediaQuery } from '@mantine/hooks';
import { IconMenu2, IconMoon, IconSearch, IconUser } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
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
    </>
  );
}
