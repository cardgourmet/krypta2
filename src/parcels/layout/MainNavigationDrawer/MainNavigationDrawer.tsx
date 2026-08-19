import { Divider, Group, Stack } from '@mantine/core';
import { IconBrandDiscord, IconBrandGithub, IconCat, IconGoGame, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { Logo } from '@/parcels/Logo';
import { NavItem } from '@/parcels/layout/NavItem/NavItem';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg';
import { TcgIcon } from '@/parcels/tcg/TcgIcon';
import { useTcg } from '@/parcels/tcg/TcgProvider';
import { tcgSearchParamsDefaults, tcgSetsParamsDefaults } from '@/parcels/tcg/types';
import styles from './MainNavigationDrawer.module.css';

export const MainNavigationDrawer = ({ onClose }: { onClose?: () => void }) => {
  const { tcg } = useTcg();

  return (
    <Stack align="start" gap="1rem">
      <ActionButton className={styles.absoluteCloseButton} onClick={onClose} size="sm">
        <IconX />
      </ActionButton>

      <div>
        <Group gap="0.25rem">
          <Logo height={32} width={32} />
          <Typeset style={{ fontFamily: 'var(--cgm-title-font-family)' }} size="lg" weight={600}>
            Cardgourmet
          </Typeset>
        </Group>
      </div>

      <section className={styles.navItems}>
        <NavItem asChild icon={<IconCat />}>
          <Link to="/about">Über uns</Link>
        </NavItem>
        <NavItem asChild icon={<IconGoGame />}>
          <Link to="/about">Games</Link>
        </NavItem>
        <NavItem asChild icon={<IconBrandDiscord />}>
          <Link to="/about">Discord</Link>
        </NavItem>
        <NavItem asChild icon={<IconBrandGithub />}>
          <a href="https://github.com/cardgourmet">GitHub</a>
        </NavItem>

        <Divider color="var(--cgm-border-tertiary)" my="0.5rem" />

        {(['mtg', 'pcg', 'dlc'] as const).map((tcg) => (
          <NavItem
            icon={<TcgIcon tcg={tcg} />}
            key={tcg}
            subitems={
              <>
                <NavItem asChild>
                  <Link params={{ tcg }} search={{ ...tcgSetsParamsDefaults }} to="/$tcg/sets">
                    Sets
                  </Link>
                </NavItem>
                <NavItem asChild>
                  <Link params={{ tcg }} search={{ ...tcgSearchParamsDefaults }} to="/$tcg/cards">
                    Karten
                  </Link>
                </NavItem>
                <NavItem asChild>
                  <Link params={{ tcg }} to="/$tcg/kitchen">
                    Suchküche
                  </Link>
                </NavItem>
              </>
            }
          >
            {getNameByTcg(tcg)}
          </NavItem>
        ))}
      </section>
    </Stack>
  );
};
