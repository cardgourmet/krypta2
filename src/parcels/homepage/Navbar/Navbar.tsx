import { Divider, Drawer, Group, UnstyledButton } from '@mantine/core';
import { useDisclosure, useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { IconMenu2, IconSearch, IconUser } from '@tabler/icons-react';
import { Link, useLocation } from '@tanstack/react-router';
import { useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { create } from 'zustand/react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { BetaButton } from '@/parcels/homepage/Home/BetaButton/BetaButton.tsx';
import { CGM_NEW_HERE } from '@/parcels/homepage/Home/Home.tsx';
import { NewHereModal } from '@/parcels/homepage/Home/NewHereModal/NewHereModal.tsx';
import { CatMenu } from '@/parcels/homepage/Navbar/CatMenu/CatMenu.tsx';
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

export const useNavbarStore = create<{ mobileSearchOpen: boolean; setMobileSearchOpen: (b: boolean) => void }>(
  (set) => ({
    mobileSearchOpen: false,
    setMobileSearchOpen: (b: boolean) => {
      set({ mobileSearchOpen: b });
    },
  }),
);

export default function Navbar({ setSidebarOpen }: NavbarProps) {
  const { t } = useTranslation('nav');
  const location = useLocation();
  const locationHref = location.href;

  const smallScreen = useMediaQuery('(max-width: 800px)');
  const { user } = useAuth();
  const emailWasChanged = useLocalUserStateStore((state) => state.emailWasChanged);
  const wasVerified = useLocalUserStateStore((state) => state.wasVerified);

  const { mobileSearchOpen, setMobileSearchOpen } = useNavbarStore();
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [mobileProfileOpened, { open: openProfile, close: closeProfile }] = useDisclosure(false);

  const [helpOpened, setHelpOpened] = useState(false);
  const [newHere] = useLocalStorage({
    key: CGM_NEW_HERE,
    defaultValue: true,
    getInitialValueInEffect: true,
  });

  return (
    <>
      <Drawer
        position={'left'}
        classNames={{
          content: styles.searchBarDrawer,
        }}
        ref={containerRef}
        size="100%"
        opened={mobileSearchOpen}
        onClose={() => setMobileSearchOpen(false)}
        withCloseButton={false}
      >
        <MobileSearchbar close={() => setMobileSearchOpen(false)} containerRef={containerRef} />
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
          <nav
            className={styles.navbar}
            style={{
              gridTemplateColumns: locationHref !== '/' ? '1fr auto 1fr' : '1fr 1fr auto',
            }}
          >
            {locationHref !== '/' && (
              <div className={styles.navbarSearch}>
                <Searchbar
                  inputStyles={{
                    minWidth: '32dvw',
                  }}
                />
              </div>
            )}

            <div className={styles.navbarRight}>
              {locationHref === '/' && (
                <>
                  <Group gap={'1.5rem'} wrap={'nowrap'}>
                    {!newHere && (
                      <>
                        <NewHereModal opened={helpOpened} setOpened={setHelpOpened} />

                        <UnstyledButton
                          onClick={() => {
                            setHelpOpened(true);
                          }}
                          className={styles.iconButton}
                        >
                          <GourmetText style={{ textWrap: 'nowrap' }}>{t('needHelp')}</GourmetText>
                        </UnstyledButton>
                      </>
                    )}
                    <Link to={'/about'} style={{ textDecoration: 'none' }} className={styles.iconButton}>
                      <GourmetText style={{ textWrap: 'nowrap' }}>{t('about')}</GourmetText>
                    </Link>
                    <a
                      href={'https://games.cardgourmet.com'}
                      style={{ textDecoration: 'none' }}
                      className={styles.iconButton}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <GourmetText>Games</GourmetText>
                    </a>
                    <a
                      href={'https://discord.gg/5KQ6fh3nus'}
                      style={{ textDecoration: 'none' }}
                      className={styles.iconButton}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <GourmetText>Discord</GourmetText>
                    </a>
                    <a
                      href={'https://github.com/cardgourmet'}
                      style={{ textDecoration: 'none' }}
                      className={styles.iconButton}
                      target="_blank"
                      rel="noreferrer noopener"
                    >
                      <GourmetText>Github</GourmetText>
                    </a>
                  </Group>
                  <Divider orientation={'vertical'} color={'var(--gourmet-neutral-4)'} ml={'2rem'} mr={'1rem'} />
                </>
              )}
              <Group gap={'0.25rem'} wrap={'nowrap'}>
                {locationHref !== '/' && <CatMenu />}
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
              <button type="button" onClick={() => setMobileSearchOpen(true)}>
                <IconSearch size={18} color={'var(--gourmet-neutral-8)'} />
              </button>
            </div>
            <div>
              <Group gap={'0rem'} style={{ position: 'relative' }}>
                <Link
                  to="/"
                  style={{ margin: 'auto', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                >
                  <Logo height={42} width={42} style={{ color: 'var(--gourmet-neutral-9)' }} />
                </Link>
                <BetaButton
                  fz={'0.75rem'}
                  style={{
                    position: 'absolute',
                    right: '-3.25rem',
                  }}
                />
              </Group>
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
