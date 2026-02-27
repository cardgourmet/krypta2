import {Button, Group, ScrollArea, SimpleGrid, Stack} from '@mantine/core';
import {IconEyeSearch, IconX} from '@tabler/icons-react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {EntryImage} from '@/parcels/selection/OverviewSelectionDisplay/EntryImage/EntryImage.tsx';
import type {TcgOverviewWorkData} from '@/parcels/selection/TcgOverviewWorkContext.tsx';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ViewSelectionPages.module.css';

export function ViewSelectionPages({ setMenuOpened }: { setMenuOpened: (open: boolean) => void }) {
  const tcg = useTcgByLocation() as Tcg;
  const workContext = useTcgOverviewWorkContext();

  return (
    <Stack>
      <Stack gap={'0.25rem'}>
        <Group justify={'space-between'}>
          <Group gap={'0.5rem'}>
            <IconEyeSearch color={'var(--gourmet-neutral-9'} />
            <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fz={'1.15rem'} fw={'500'}>
              View Selection
            </GourmetText>
          </Group>
          <Button onClick={() => setMenuOpened(false)} classNames={{ root: styles.closeButton }}>
            <IconX size={18} color={'var(--gourmet-neutral-8)'} />
          </Button>
        </Group>

        <GourmetText cgmff={'ui'}>Click any element to remove it from the selection.</GourmetText>
      </Stack>

      <ScrollArea
        h={'50dvh'}
        classNames={{ viewport: styles.scrollAreaViewport }}
        offsetScrollbars={'y'}
        scrollbarSize={'0.25rem'}
        pr={'0.2rem'}
      >
        <Stack gap={'2.5rem'} p={'0.25rem 0.25rem'}>
          {workContext?.data
            && dataEntriesByPage(workContext?.data).map(({ page, entries }) => {
              return (
                <Stack key={page}>
                  <Group justify={'space-between'}>
                    <Group gap={'0.5rem'}>
                      <GourmetText cgmff={'ui'} fz={'1.15rem'}>
                        Page {page}
                      </GourmetText>
                      <span className={styles.badge}>{entries.length}</span>
                    </Group>

                    <Button
                      classNames={{ root: styles.clearFromPageButton }}
                      onClick={() => {
                        workContext?.removeSelection([...entries.map((e) => e.card.id)], Number(page));
                      }}
                    >
                      <Group>
                        <IconX size={16} color={'var(--gourmet-neutral-8)'} />
                        <GourmetText cgmff={'ui'}>Clear page</GourmetText>
                      </Group>
                    </Button>
                  </Group>

                  <SimpleGrid cols={4} spacing={'xs'}>
                    {entries.map((entry, index) => {
                      return <EntryImage key={index} tcg={tcg} entry={entry} page={Number(page)} work={workContext} />;
                    })}
                  </SimpleGrid>
                </Stack>
              );
            })}
        </Stack>
      </ScrollArea>
    </Stack>
  );
}

function dataEntriesByPage(workData: TcgOverviewWorkData) {
  return Object.entries(workData.selection.elementsByPage).map(([page, entryIds]) => {
    return { page: page, entries: entryIds.map((id) => workData.selection.elementDataById[id]) };
  });
}
