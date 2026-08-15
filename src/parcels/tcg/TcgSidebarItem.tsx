import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuTrigger,
} from '@radix-ui/react-dropdown-menu';
import { IconCards, IconFolders, IconSoup } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { ActionButton } from '../generic/ActionButton/ActionButton';
import { Menu } from '../generic/Menu/Menu';
import { Typeset } from '../generic/Typeset/Typeset';
import { getNameByTcg } from './getNameByTcg';
import { TcgIcon } from './TcgIcon';
import { tcgSearchParamsDefaults, tcgSetsParamsDefaults } from './types';
import { type Tcg, useTcgByLocation } from './useTcgByLocation';

export const TcgSidebarItem = ({ tcg }: { tcg: Tcg }) => {
  const isActive = tcg === useTcgByLocation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ActionButton accent={isActive ? 'brand' : 'neutral'} variant={isActive ? 'primary' : 'tertiary'}>
          <TcgIcon style={{ fontSize: '1.5rem' }} tcg={tcg} />
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
              <DropdownMenuLabel>{getNameByTcg(tcg)}</DropdownMenuLabel>
            </Typeset>

            <Menu.DropdownItem asChild icon={<IconFolders />}>
              <Link params={{ tcg }} search={{ ...tcgSetsParamsDefaults }} to="/$tcg/sets">
                Sets
              </Link>
            </Menu.DropdownItem>
            <Menu.DropdownItem asChild icon={<IconCards />}>
              <Link params={{ tcg }} search={{ ...tcgSearchParamsDefaults }} to="/$tcg/cards">
                Karten
              </Link>
            </Menu.DropdownItem>
            <Menu.DropdownItem asChild icon={<IconSoup />}>
              <Link params={{ tcg }} to="/$tcg/kitchen">
                Suchküche
              </Link>
            </Menu.DropdownItem>
          </Menu>
        </DropdownMenuContent>
      </DropdownMenuPortal>
    </DropdownMenu>
  );
};
