import { Drawer } from '@mantine/core';
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import {
  IconBrandDiscord,
  IconBrandGithub,
  IconCaretDownFilled,
  IconCat,
  IconGoGame,
  IconMenu3,
  IconSearch,
} from '@tabler/icons-react';
import { Link, useRouter } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { useEffect, useState } from 'react';
import type { Extend, Structure } from '@/parcels/composition/extend';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Button } from '@/parcels/generic/Button/Button';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { Logo } from '@/parcels/Logo';
import { NewSearchbar } from '@/parcels/search/bar/NewSearchbar/NewSearchbar';
import { SearchDrawer } from '@/parcels/search/SearchDrawer/SearchDrawer';
import { LanguageSelectorDropdown } from '@/parcels/settings/LanguageSelectorDropdown/LanguageSelectorDropdown';
import { ThemeSelectorDropdown } from '@/parcels/settings/ThemeSelectorDropdown/ThemeSelectorDropdown';
import { UserDrawer } from '@/parcels/user/UserDrawer/UserDrawer';
import { UserDropdown } from '@/parcels/user/UserDropdown/UserDropdown';
import { UserNavbarTriggerContent } from '@/parcels/user/UserNavbarTriggerContent';
import { MainNavigationDrawer } from '../MainNavigationDrawer/MainNavigationDrawer';
import styles from './Navbar.module.css';

export const Navbar = ({ className }: Extend<Structure>) => {
  const router = useRouter();

  const [isMainDrawerActive, setMainDrawerActive] = useState(false);
  const [isSearchDrawerActive, setSearchDrawerActive] = useState(false);
  const [isUserDrawerActive, setUserDrawerActive] = useState(false);

  useEffect(() =>
    router.subscribe('onBeforeNavigate', () => {
      setMainDrawerActive(false);
      setSearchDrawerActive(false);
      setUserDrawerActive(false);
    }),
  );

  return (
    <>
      <nav className={clsx(styles.base, className)}>
        <div className={styles.mobileContent}>
          <div className={styles.actionsContainer}>
            <ActionButton onClick={() => setMainDrawerActive(true)} title="Navigation öffnen">
              <IconMenu3 />
            </ActionButton>

            <ActionButton onClick={() => setSearchDrawerActive(true)}>
              <IconSearch />
            </ActionButton>
          </div>

          <Link className={styles.logoLink} title="Start" to="/">
            <Logo height={40} width={40} />
          </Link>

          <div className={styles.actionsContainer}>
            <Button style={{ marginRight: 'auto', paddingInline: '0.4375rem' }} variant="tertiary">
              <Badge color="purple" style={{ textTransform: 'uppercase' }}>
                Beta
              </Badge>
            </Button>

            <ActionButton onClick={() => setUserDrawerActive(true)} style={{ paddingInline: 0 }}>
              <UserNavbarTriggerContent />
            </ActionButton>
          </div>
        </div>

        <div className={styles.desktopContent}>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  accent="beta"
                  size="sm"
                  style={{ fontFamily: 'var(--cgm-title-font-family)', fontWeight: 600 }}
                  trailingIcon={<IconCaretDownFilled />}
                  variant="tertiary"
                >
                  Cardgourmet
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent asChild align="start" sideOffset={-4}>
                <Menu>
                  <Menu.DropdownItem asChild icon={<IconCat />}>
                    <Link to="/about">About Us</Link>
                  </Menu.DropdownItem>
                  <Menu.DropdownItem asChild icon={<IconGoGame />}>
                    <a href="https://games.cardgourmet.com">Games</a>
                  </Menu.DropdownItem>
                  <Menu.DropdownItem asChild icon={<IconBrandDiscord />}>
                    <a href="https://discord.gg/5KQ6fh3nus" rel="noreferrer" target="_blank">
                      Discord
                    </a>
                  </Menu.DropdownItem>
                  <Menu.DropdownItem asChild icon={<IconBrandGithub />}>
                    <a href="https://github.com/cardgourmet" rel="noreferrer" target="_blank">
                      GitHub
                    </a>
                  </Menu.DropdownItem>
                </Menu>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <NewSearchbar />

          <div className={styles.actionsContainer} style={{ justifyContent: 'flex-end' }}>
            <LanguageSelectorDropdown />
            <ThemeSelectorDropdown />
            <UserDropdown />
          </div>
        </div>
      </nav>

      <Drawer
        onClose={() => setMainDrawerActive(false)}
        opened={isMainDrawerActive}
        position="left"
        styles={{ content: { background: 'var(--cgm-background-surface)' } }}
        withCloseButton={false}
      >
        <MainNavigationDrawer onClose={() => setMainDrawerActive(false)} />
      </Drawer>

      <Drawer
        onClose={() => setSearchDrawerActive(false)}
        opened={isSearchDrawerActive}
        position="left"
        styles={{ content: { background: 'var(--cgm-background-surface)' } }}
        withCloseButton={false}
      >
        <SearchDrawer onClose={() => setSearchDrawerActive(false)} />
      </Drawer>

      <Drawer
        onClose={() => setUserDrawerActive(false)}
        opened={isUserDrawerActive}
        position="right"
        styles={{ content: { background: 'var(--cgm-background-surface)' } }}
        withCloseButton={false}
      >
        <UserDrawer onClose={() => setUserDrawerActive(false)} />
      </Drawer>
    </>
  );
};
