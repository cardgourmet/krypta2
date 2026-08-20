import { Divider, Group, Stack } from '@mantine/core';
import { IconBrandDiscord, IconBrandGithub, IconCat, IconGoGame, IconHome, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { ActionButton } from '@/parcels/generic/ActionButton/ActionButton';
import { Typeset } from '@/parcels/generic/Typeset/Typeset';
import { Logo } from '@/parcels/Logo';
import { NavItem } from '@/parcels/layout/NavItem/NavItem';
import { getNameByTcg } from '@/parcels/tcg/getNameByTcg';
import { TcgIcon } from '@/parcels/tcg/TcgIcon';
import { tcgSearchParamsDefaults, tcgSetsParamsDefaults } from '@/parcels/tcg/types';
import styles from './MainNavigationDrawer.module.css';

export const MainNavigationDrawer = ({ onClose }: { onClose?: () => void }) => {
  return (
    <Stack align="start" gap="1rem">
      <ActionButton className={styles.absoluteCloseButton} onClick={onClose} size="sm">
        <IconX />
      </ActionButton>

      <div>
        <Group gap="0.25rem">
          <Logo color="var(--cgm-color-brand)" height={32} width={32} />
          <Typeset style={{ fontFamily: 'var(--cgm-title-font-family)' }} size="lg" weight={600}>
            Cardgourmet
          </Typeset>
        </Group>
      </div>

      <section className={styles.navItems}>
        <NavItem asChild icon={<IconHome />}>
          <Link to="/">Home</Link>
        </NavItem>
        <NavItem asChild icon={<IconCat />}>
          <Link to="/about">About Us</Link>
        </NavItem>
        <NavItem asChild icon={<IconGoGame />}>
          <a href="https://games.cardgourmet.com">Games</a>
        </NavItem>
        <NavItem asChild icon={<IconBrandDiscord />}>
          <a href="https://discord.gg/5KQ6fh3nus" rel="noreferrer" target="_blank">
            Discord
          </a>
        </NavItem>
        <NavItem asChild icon={<IconBrandGithub />}>
          <a href="https://github.com/cardgourmet" rel="noreferrer" target="_blank">
            GitHub
          </a>
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
                    Cards
                  </Link>
                </NavItem>
                <NavItem asChild>
                  <Link params={{ tcg }} to="/$tcg/kitchen">
                    Search Kitchen
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
