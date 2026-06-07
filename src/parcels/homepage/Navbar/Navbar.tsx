import { Drawer, Group } from '@mantine/core';
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { IconMenu2, IconSearch, IconUser } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useRef } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { EmailChangedBanner } from '@/parcels/homepage/Navbar/EmailChangedBanner/EmailChangedBanner.tsx';
import { LanguageSelector } from '@/parcels/homepage/Navbar/LanguageSelector/LanguageSelector.tsx';
import { ThemeSelector } from '@/parcels/homepage/Navbar/ThemeSelector/ThemeSelector.tsx';
import { UnverifiedBanner } from '@/parcels/homepage/Navbar/UnverifiedBanner/UnverifiedBanner.tsx';
import { MobileUserMenu } from '@/parcels/homepage/Navbar/UserDisplay/MobileUserMenu/MobileUserMenu.tsx';
import { UserDisplay } from '@/parcels/homepage/Navbar/UserDisplay/UserDisplay.tsx';
import { UserIcon } from '@/parcels/homepage/Navbar/UserDisplay/UserIcon/UserIcon.tsx';
import { VerifiedBanner } from '@/parcels/homepage/Navbar/VerifiedBanner/VerifiedBanner.tsx';
import { Logo } from '@/parcels/Logo.tsx';
import { MobileSearchbar } from '@/parcels/search/bar/MobileSearchbar/MobileSearchbar.tsx';
import Searchbar from '@/parcels/search/bar/Searchbar/Searchbar.tsx';
import { useLocalUserStateStore } from '@/parcels/state/LocalUserStateStore.tsx';
import styles from './Navbar.module.css';

interface NavbarProps {
  setSidebarOpen: (open: boolean) => void;
}

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const location = useLocation();
  const locationHref = location.href;

  const smallScreen = useMediaQuery('(max-width: 800px)');
  const { user } = useAuth();
  const emailWasChanged = useLocalUserStateStore((state) => state.emailWasChanged);
  const wasVerified = useLocalUserStateStore((state) => state.wasVerified);

  const [mobileSearchOpened, { open: openSearch, close: closeSearch }] = useDisclosure(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mobileProfileOpened, { open: openProfile, close: closeProfile }] = useDisclosure(false);

  return (
    <>
      <Drawer
        position={'left'}
        classNames={{
          content: styles.searchBarDrawer,
        }}
        ref={containerRef}
        size="100%"
        opened={mobileSearchOpened}
        onClose={openSearch}
        withCloseButton={false}
      >
        <MobileSearchbar close={closeSearch} containerRef={containerRef} />
      </Drawer>

      <Drawer
        position={'right'}
        classNames={{
          content: styles.profileDrawer,
        }}
        size="100%"
        opened={mobileProfileOpened}
        onClose={closeProfile}
        withCloseButton={false}
      >
        <MobileUserMenu close={closeProfile} />
      </Drawer>

      {!smallScreen && (
        <>
          {emailWasChanged && <EmailChangedBanner />}
          {wasVerified && <VerifiedBanner />}
          {!wasVerified && user?.state === 'unverified' && <UnverifiedBanner user={user} />}
          <nav className={styles.navbar}>
            <div className={styles.navbarSearch}>
              {locationHref !== '/' && (
                <Searchbar
                  inputStyles={{
                    minWidth: '32dvw',
                  }}
                />
              )}
            </div>

            <div className={styles.navbarRight}>
              <Group gap={'0.25rem'}>
                <LanguageSelector />
                <ThemeSelector />
              </Group>

              <UserDisplay style={{ marginLeft: '0.5rem' }} />
            </div>
          </nav>
        </>
      )}
      {smallScreen && (
        <>
          {wasVerified && <VerifiedBanner />}
          {!wasVerified && user?.state === 'unverified' && <UnverifiedBanner user={user} />}
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
              <button type="button" onClick={openSearch}>
                <IconSearch size={18} color={'var(--gourmet-neutral-8)'} />
              </button>
            </div>
            <div>
              <Link to="/" style={{ margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Logo height={42} width={42} style={{ color: 'var(--gourmet-neutral-9)' }} />
              </Link>
            </div>
            <div style={{ flex: 1, justifyContent: 'flex-end' }}>
              {user && <UserIcon onClick={openProfile} />}
              {!user && (
                <button type="button" onClick={openProfile}>
                  <IconUser size={18} color={'var(--gourmet-neutral-8)'} />
                </button>
              )}
            </div>
          </nav>
        </>
      )}
    </>
  );
}
