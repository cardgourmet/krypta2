import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconCards, IconFolders, IconSoup } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { clsx } from 'clsx';
import type { Extend, Structure } from '@/parcels/composition/extend';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Badge } from '@/parcels/generic/Badge/Badge';
import { Menu } from '@/parcels/generic/Menu/Menu';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { Logo } from '@/parcels/Logo';
import { TcgIcon } from '@/parcels/tcg/TcgIcon';
import { tcgSearchParamsDefaults, tcgSetsParamsDefaults } from '@/parcels/tcg/types';
import styles from './Sidebar.module.css';

export const Sidebar = ({ className }: Extend<Structure>) => {
  return (
    <nav className={clsx(styles.base, className)}>
      <div className={styles.logoContainer}>
        <Link className={styles.logoLink} title="Start" to="/">
          <Logo height={40} width={40} />
        </Link>
      </div>

      <div className={styles.tcgsContainer}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <ActionButton>
              <TcgIcon style={{ fontSize: '1.5rem' }} tcg="mtg" />
            </ActionButton>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent asChild align="start" side="right" sideOffset={-4}>
              <Menu>
                <Typeset
                  asChild
                  size="sm"
                  style={{ fontFamily: 'var(--cgm-title-font-family)', padding: '0.25rem 0.75rem' }}
                  weight={600}
                >
                  <DropdownMenuLabel>Magic: The Gathering</DropdownMenuLabel>
                </Typeset>

                <Menu.DropdownItem asChild icon={<IconFolders />}>
                  <Link params={{ tcg: 'mtg' }} search={{ ...tcgSetsParamsDefaults }} to="/$tcg/sets">
                    Sets
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconCards />}>
                  <Link params={{ tcg: 'mtg' }} search={{ ...tcgSearchParamsDefaults }} to="/$tcg/cards">
                    Karten
                  </Link>
                </Menu.DropdownItem>
                <Menu.DropdownItem asChild icon={<IconSoup />}>
                  <Link params={{ tcg: 'mtg' }} to="/$tcg/kitchen">
                    Suchküche
                  </Link>
                </Menu.DropdownItem>
              </Menu>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>

      <div className={styles.brandContainer}>
        <div className={styles.brand}>
          <span style={{ display: 'none', letterSpacing: '0.1em' }}>Cardgourmet</span>{' '}
          <Badge color="purple">Beta</Badge>
        </div>
      </div>
    </nav>
  );
};
