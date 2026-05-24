import { Accordion, Button, Group, Stack, Text } from '@mantine/core';
import { IconCards, IconDeviceVisionPro, IconFolders, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { DLCIcon } from '@/parcels/tcg/dlc/Icon.tsx';
import { MTGIcon } from '@/parcels/tcg/mtg/Icon.tsx';
import { PCGIcon } from '@/parcels/tcg/pcg/Icon.tsx';
import { tcgSearchParamsDefaults, tcgSetsParamsDefaults } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
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
        <TcgButton tcg={'mtg'} activeTcg={tcg} close={close} />
        <TcgButton tcg={'pcg'} activeTcg={tcg} close={close} />
        <TcgButton tcg={'dlc'} activeTcg={tcg} close={close} />
      </div>
    </>
  );
}

function TcgButton({ tcg, activeTcg, close }: { tcg: Tcg; activeTcg: Tcg | undefined; close: () => void }) {
  const isActive = tcg === activeTcg;
  const iconSize = 26;

  return (
    <Accordion className={`${styles.mobileSidebarAccordion} ${isActive ? styles.active : ''}`}>
      <Accordion.Item key={tcg} value={tcg}>
        <Accordion.Control>
          <Group>
            {tcg === 'mtg' && <MTGIcon height={iconSize} width={iconSize} color={'var(--gourmet-neutral-9)'} />}
            {tcg === 'pcg' && <PCGIcon height={iconSize} width={iconSize} color={'var(--gourmet-neutral-9)'} />}
            {tcg === 'dlc' && <DLCIcon height={iconSize} width={iconSize} color={'var(--gourmet-neutral-9)'} />}

            <GourmetText cgmff={'ui'} cgmc={isActive ? 'neutral-0' : 'neutral-8'} fz={'1.1rem'} fw={500}>
              {tcg === 'mtg' && 'Magic: The Gathering'}
              {tcg === 'pcg' && 'Pokémon Card Game'}
              {tcg === 'dlc' && 'Disney Lorcana'}
            </GourmetText>
          </Group>
        </Accordion.Control>
        <Accordion.Panel>
          <Stack pt={'0.5rem'} pl={'0.15rem'} gap={'1.5rem'}>
            <Link
              to={'/$tcg/sets'}
              params={{ tcg: tcg }}
              search={{ ...tcgSetsParamsDefaults }}
              className={styles.mobileSidebarLink}
              onClick={close}
            >
              <Group gap={'0.75rem'}>
                <IconFolders size={22} />
                <GourmetText>Sets</GourmetText>
              </Group>
            </Link>
            <Link
              to={'/$tcg/cards'}
              params={{ tcg: tcg }}
              search={{ ...tcgSearchParamsDefaults }}
              className={styles.mobileSidebarLink}
              onClick={close}
            >
              <Group gap={'0.75rem'}>
                <IconCards size={22} />
                <GourmetText>Cards</GourmetText>
              </Group>
            </Link>
            <Link to={'/$tcg/cuisine'} params={{ tcg: tcg }} className={styles.mobileSidebarLink} onClick={close}>
              <Group gap={'0.75rem'}>
                <IconDeviceVisionPro size={22} />
                <GourmetText>Search Cuisine</GourmetText>
              </Group>
            </Link>
          </Stack>
        </Accordion.Panel>
      </Accordion.Item>
    </Accordion>
  );
}
