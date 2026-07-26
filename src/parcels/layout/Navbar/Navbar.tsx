import { Drawer } from '@mantine/core';
import { IconMenu3, IconSearch, IconUser } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';
import { useState } from 'react';
import type { Extend, Structure } from '@/parcels/composition/extend';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Button } from '@/parcels/generic/Button/Button';
import { Logo } from '@/parcels/Logo';
import { LanguageSelectorDropdown } from '@/parcels/settings/LanguageSelectorDropdown/LanguageSelectorDropdown';
import { ThemeSelectorDropdown } from '@/parcels/settings/ThemeSelectorDropdown/ThemeSelectorDropdown';
import { UserDrawer } from '@/parcels/user/UserDrawer/UserDrawer';
import { UserDropdown } from '@/parcels/user/UserDropdown/UserDropdown';
import styles from './Navbar.module.css';

export const Navbar = ({ className }: Extend<Structure>) => {
  const [isUserDrawerActive, setUserDrawerActive] = useState(false);

  return (
    <>
      <nav className={clsx(styles.base, className)}>
        <div className={styles.mobileContent}>
          <div className={styles.actionsContainer}>
            <ActionButton title="Navigation öffnen">
              <IconMenu3 />
            </ActionButton>

            <ActionButton>
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

            <ActionButton onClick={() => setUserDrawerActive(true)}>
              <IconUser />
            </ActionButton>
          </div>
        </div>

        <div className={styles.desktopContent}>
          <LanguageSelectorDropdown />
          <ThemeSelectorDropdown />
          <UserDropdown />
        </div>
      </nav>

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
