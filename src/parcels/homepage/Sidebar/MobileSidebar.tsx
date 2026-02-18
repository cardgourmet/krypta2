import {Button, Group, Text} from '@mantine/core';
import {IconX} from '@tabler/icons-react';
import {Link} from '@tanstack/react-router';
import {DLCIcon} from '@/parcels/tcg/dlc/Icon.tsx';
import {MTGIcon} from '@/parcels/tcg/mtg/Icon.tsx';
import {PCGIcon} from '@/parcels/tcg/pcg/Icon.tsx';
import {useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './MobileSidebar.module.css';

export function MobileSidebar({ close }: { close: () => void }) {
  const tcg = useTcgByLocation();

  return (
    <>
      <Group justify={'space-between'}>
        <Text ff={'var(--cgm-content-font-family)'} tt={'uppercase'} fw={'bold'}>
          Navigation
        </Text>
        <Button onClick={close} classNames={{ root: styles.closeButton }}>
          <IconX size={18} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Group>

      <div className={styles.mobileSidebarBottom}>
        <Link
          to="/$tcg"
          params={{ tcg: 'mtg' }}
          className={`${styles.mobileSidebarLink} ${tcg === 'mtg' ? styles.active : ''}`}
          onClick={close}
        >
          <MTGIcon height={24} width={24} color={'var(--gourmet-neutral-9)'} />
          <p>Magic: The Gathering</p>
        </Link>
        <Link
          to="/$tcg"
          params={{ tcg: 'pcg' }}
          className={`${styles.mobileSidebarLink} ${tcg === 'pcg' ? styles.active : ''}`}
          onClick={close}
        >
          <PCGIcon height={24} width={24} color={'var(--gourmet-neutral-9)'} />
          <p>Pokémon Card Game</p>
        </Link>
        <Link
          to="/$tcg"
          params={{ tcg: 'dlc' }}
          className={`${styles.mobileSidebarLink} ${tcg === 'dlc' ? styles.active : ''}`}
          onClick={close}
        >
          <DLCIcon height={24} width={24} color={'var(--gourmet-neutral-9)'} />
          <p>Disney Lorcana</p>
        </Link>
      </div>
    </>
  );
}
