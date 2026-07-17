import { Button, Group, ScrollArea, SimpleGrid, Stack } from '@mantine/core';
import { IconEyeSearch, IconX } from '@tabler/icons-react';
import { useTranslation } from 'react-i18next';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { TcgWorkData } from '@/parcels/selection/createTcgWorkStore.tsx';
import { EntryImage } from '@/parcels/selection/OverviewSelectionDisplay/EntryImage/EntryImage.tsx';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './ViewSelectionPages.module.css';

export function ViewSelectionPages({ setMenuOpened }: { setMenuOpened: (open: boolean) => void }) {
  const { t } = useTranslation('selection');

  const tcg = useTcgByLocation() as Tcg;

  const workData = useOverviewWorkStore((state) => state.data);
  const setSelectionWithCheck = useOverviewWorkStore((state) => state.setSelectionWithCheck);

  return (
    <Stack>
      <Stack gap={'0.25rem'}>
        <Group justify={'space-between'}>
          <Group gap={'0.5rem'}>
            <IconEyeSearch color={'var(--gourmet-neutral-9'} />
            <GourmetText cgmff={'ui'} cgmc={'neutral-9'} fz={'1.15rem'} fw={'500'}>
              {t('viewSelection')}
            </GourmetText>
          </Group>
          <Button onClick={() => setMenuOpened(false)} classNames={{ root: styles.closeButton }}>
            <IconX size={18} color={'var(--gourmet-neutral-8)'} />
          </Button>
        </Group>

        <GourmetText cgmff={'ui'}>{t('selectionMenuInfo')}</GourmetText>
      </Stack>

      <ScrollArea
        h={'40dvh'}
        classNames={{ viewport: styles.scrollAreaViewport }}
        offsetScrollbars={'y'}
        scrollbarSize={'0.25rem'}
        pr={'0.2rem'}
      >
        <Stack gap={'2.5rem'} p={'0.25rem 0.25rem'}>
          {workData
            && dataEntriesByPage(workData).map(({ page, entries }) => {
              return (
                <Stack key={page}>
                  <Group justify={'space-between'}>
                    <Group gap={'0.5rem'}>
                      <GourmetText cgmff={'ui'} fz={'1.15rem'}>
                        {t('page')} {page}
                      </GourmetText>
                      <span className={styles.badge}>{entries.length}</span>
                    </Group>

                    <Button
                      classNames={{ root: styles.clearFromPageButton }}
                      onClick={() => {
                        setSelectionWithCheck([...entries.map((e) => e.card.print.id)], false);
                      }}
                    >
                      <Group>
                        <IconX size={16} color={'var(--gourmet-neutral-8)'} />
                        <GourmetText cgmff={'ui'}>{t('clearPage')}</GourmetText>
                      </Group>
                    </Button>
                  </Group>

                  <SimpleGrid cols={4} spacing={'xs'}>
                    {entries.map((entry, index) => {
                      return <EntryImage key={index} tcg={tcg} entry={entry} />;
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

function dataEntriesByPage(workData: TcgWorkData<TcgSearchDataCard, unknown>) {
  return Object.entries(workData.selection.elementsByPage).map(([page, entryIds]) => {
    return { page: page, entries: entryIds.map((id) => workData.selection.elementDataById[id]) };
  });
}
