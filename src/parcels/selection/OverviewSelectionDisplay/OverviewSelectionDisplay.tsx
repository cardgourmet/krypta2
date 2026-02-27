import {ActionIcon, Button, Flex, Group, Menu, ScrollArea, SimpleGrid, Stack, Tooltip, UnstyledButton,} from '@mantine/core';
import {useClickOutside, useMediaQuery} from '@mantine/hooks';
import {IconEyeSearch, IconX} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useRef, useState} from 'react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {FlipButton} from '@/parcels/overview/CardGrid/FlipButton/FlipButton.tsx';
import {FlipImage} from '@/parcels/overview/CardGrid/FlipImage/FlipImage.tsx';
import {type CardProperties, createProps} from '@/parcels/overview/CardGrid/ImageCard/createProps.ts';
import {generateProgress} from '@/parcels/selection/OverviewSelectionDisplay/generateProgress.tsx';
import {MorePagesDropdown} from '@/parcels/selection/OverviewSelectionDisplay/MorePagesDropdown.tsx';
import {UseSelectionButton} from '@/parcels/selection/OverviewSelectionDisplay/UseSelectionButton.tsx';
import type {TcgOverviewWorkData, TcgOverviewWorkSpace} from '@/parcels/selection/TcgOverviewWorkContext.tsx';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import type {DlcSearchParams} from '@/parcels/tcg/dlc/types.ts';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './OverviewSelectionDisplay.module.css';

export function OverviewSelectionDisplay({ context: workContext }: { context: TcgOverviewWorkSpace }) {
  const smallScreen = useMediaQuery('(max-width: 580px)');
  const context = useTcgOverviewWorkContext();

  const tcg = useTcgByLocation() as Tcg;
  const navigate = useNavigate();

  const [menuOpened, setMenuOpened] = useState(false);
  const [eyeButton, setEyeButton] = useState<HTMLButtonElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);
  useClickOutside(() => setMenuOpened(false), null, [eyeButton, dropdown]);

  return (
    <Group
      style={{
        position: 'sticky',
        bottom: '1rem',
        marginTop: '1rem',
        zIndex: 'var(--sticky-layer)',
        pointerEvents: 'none',
      }}
      justify={'center'}
      align={'center'}
    >
      <Menu
        shadow="md"
        width={'min(42rem, 95dvw)'}
        position={'top'}
        opened={menuOpened}
        transitionProps={{ transition: 'fade-up', duration: 150 }}
        floatingStrategy={'fixed'}
      >
        <Menu.Target>
          <Stack
            style={{
              border: '2px solid var(--cgm-navbar-border)',
              borderRadius: '4px',
              backgroundColor: 'var(--cgm-navbar-bg)',
              padding: '1rem',
              boxShadow: '2px 4px 8px #000000',
              pointerEvents: 'auto',
            }}
            w={'36rem'}
            maw={'36rem'}
            gap={smallScreen ? '0.5rem' : '0.1rem'}
          >
            <Flex
              wrap={'nowrap'}
              justify={'space-between'}
              direction={smallScreen ? 'column' : 'row'}
              gap={smallScreen ? 'lg' : ''}
            >
              <Stack gap={'0'}>
                <Group gap={'0.5rem'}>
                  <GourmetText cgmff={'ui'} fz={'1.25rem'} cgmc={'neutral-9'}>
                    Auswahl:
                  </GourmetText>
                  <GourmetText cgmff={'ui'} c={'var(--gourmet-orange-1)'} fw={'500'} fz={'1.25rem'}>
                    {workContext.data.selection.elementIds.length} Karten
                  </GourmetText>

                  <Tooltip label={'Auswahl anzeigen'} openDelay={1000}>
                    <ActionIcon
                      className={styles.selectionShowButton}
                      onClick={() => setMenuOpened((prev) => !prev)}
                      ref={setEyeButton}
                    >
                      <IconEyeSearch size={20} color={'var(--gourmet-neutral-7'} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
                <Group gap={'0.1rem'}>
                  <MorePagesDropdown
                    text={'Aktuelle Seite'}
                    currentPage={workContext.data.search.page}
                    onSelect={(sel) => {
                      // noinspection JSIgnoredPromiseFromCall
                      navigate({
                        to: `/$tcg/cards`,
                        search: (prev) => {
                          return { ...prev, page: Number(sel) } as Required<DlcSearchParams>;
                        },
                        params: {
                          tcg: tcg,
                        },
                        replace: true,
                      });
                    }}
                  />
                  <GourmetText>:</GourmetText>
                  <GourmetText pl={'0.5rem'}>
                    {Object.keys(workContext.data.selection.elementsByPage[workContext.data.search.page] ?? []).length}{' '}
                    Karten
                  </GourmetText>
                </Group>
              </Stack>
              <Group wrap={'nowrap'}>
                <UseSelectionButton />
                <Tooltip label={'Auswahl aufheben'} openDelay={500}>
                  <ActionIcon
                    color={'var(--gourmet-neutral-3)'}
                    onClick={() => {
                      workContext.clearSelection();
                    }}
                  >
                    <IconX size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            </Flex>
            <Stack gap={'0.25rem'}>{generateProgress(12, workContext.data.selection.elementIds.length, 60)}</Stack>
          </Stack>
        </Menu.Target>

        <Menu.Dropdown className={styles.menuDropdown} ref={setDropdown}>
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
                {dataEntriesByPage(workContext.data).map(({ page, entries }) => {
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
                          return <EntryImage key={index} tcg={tcg} entry={entry} page={Number(page)} work={context} />;
                        })}
                      </SimpleGrid>
                    </Stack>
                  );
                })}
              </Stack>
            </ScrollArea>
          </Stack>
        </Menu.Dropdown>
      </Menu>
    </Group>
  );
}

function EntryImage({
  tcg,
  entry,
  page,
  work,
}: {
  tcg: Tcg;
  entry: TcgSearchDataCard;
  page: number;
  work: TcgOverviewWorkSpace | null;
}) {
  const [flipped, setFlipped] = useState(false);
  const flipRef = useRef<HTMLDivElement>(null);
  const prop = createProps(tcg, entry) as CardProperties;

  const imageRef = useRef<HTMLImageElement>(null);
  const backfaceImageRef = useRef<HTMLImageElement>(null);

  return (
    <div className={styles.card}>
      <div style={{ width: '100%', height: '100%' }}>
        <UnstyledButton
          style={{ display: 'flex', width: '100%', height: '100%' }}
          onClick={() => {
            work?.removeSelection([entry.card.id], page);
          }}
        >
          <FlipImage
            frontFace={{
              imageRef: imageRef,
              name: prop.name,
              thumbnailUrl: prop.thumbnailUrl ?? prop.backupImageUrl,
              backupImageUrl: prop.backupImageUrl,
              setImageLoaded: () => {},
            }}
            backFace={{
              imageRef: backfaceImageRef,
              name: prop.name,
              thumbnailUrl: prop.backfaceThumbnailUrl ?? prop.backupImageUrl,
              backupImageUrl: prop.backupImageUrl,
              setImageLoaded: () => {},
            }}
            flipRef={flipRef}
          />
        </UnstyledButton>
      </div>

      {prop.backfaceThumbnailUrl && <FlipButton flipped={flipped} setFlipped={setFlipped} flipRef={flipRef} />}
    </div>
  );
}

function dataEntriesByPage(workData: TcgOverviewWorkData) {
  return Object.entries(workData.selection.elementsByPage).map(([page, entryIds]) => {
    return { page: page, entries: entryIds.map((id) => workData.selection.elementDataById[id]) };
  });
}
