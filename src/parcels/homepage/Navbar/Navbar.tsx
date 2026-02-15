import {Drawer} from '@mantine/core';
import {useDisclosure, useMediaQuery} from '@mantine/hooks';
import {IconMenu2, IconSearch, IconUser} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {useRef} from 'react';
import {LanguageSelector} from '@/parcels/homepage/Navbar/LanguageSelector.tsx';
import {ThemeSelector} from '@/parcels/homepage/Navbar/ThemeSelector.tsx';
import {UserDisplay} from '@/parcels/homepage/Navbar/UserDisplay.tsx';
import {Logo} from '@/parcels/Logo.tsx';
import {MobileSearchbar} from '@/parcels/search/bar/MobileSearchbar/MobileSearchbar.tsx';
import Searchbar from '@/parcels/search/bar/Searchbar/Searchbar.tsx';
import styles from './Navbar.module.css';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const smallScreen = useMediaQuery('(max-width: 720px)');

  const [mobileSearchOpened, { open, close }] = useDisclosure(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  return (
    <>
      <Drawer
        classNames={{
          content: styles.searchBarDrawer,
        }}
        ref={containerRef}
        size="100%"
        opened={mobileSearchOpened}
        onClose={close}
        withCloseButton={false}
      >
        <MobileSearchbar close={close} containerRef={containerRef} />
      </Drawer>

      {!smallScreen && (
        <nav className={styles.navbar}>
          <div className={styles.navbarSearch}>
            <Searchbar />
          </div>

          <div className={styles.navbarRight}>
            <LanguageSelector />
            <ThemeSelector />

            <UserDisplay />
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
