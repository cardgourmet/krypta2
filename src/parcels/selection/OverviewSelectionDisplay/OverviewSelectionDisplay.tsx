import {ActionIcon, Flex, Group, Stack, Tooltip} from '@mantine/core';
import {useClickOutside, useMediaQuery} from '@mantine/hooks';
import {IconEyeSearch, IconX} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {MorePagesDropdown} from '@/parcels/selection/OverviewSelectionDisplay/MorePagesDropdown/MorePagesDropdown.tsx';
import {SelectionProgress} from '@/parcels/selection/OverviewSelectionDisplay/SelectionProgress/SelectionProgress.tsx';
import {UseSelectionButton} from '@/parcels/selection/OverviewSelectionDisplay/UseSelectionButton/UseSelectionButton.tsx';
import {ViewSelectionMenu} from '@/parcels/selection/OverviewSelectionDisplay/ViewSelectionMenu/ViewSelectionMenu.tsx';
import type {TcgOverviewWorkSpace} from '@/parcels/selection/TcgOverviewWorkContext.tsx';
import type {DlcSearchParams} from '@/parcels/tcg/dlc/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './OverviewSelectionDisplay.module.css';

export function OverviewSelectionDisplay({ context: workContext }: { context: TcgOverviewWorkSpace }) {
  const smallScreen = useMediaQuery('(max-width: 580px)');

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
      <ViewSelectionMenu setDropdown={setDropdown} menuOpened={menuOpened} setMenuOpened={setMenuOpened}>
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
          <Stack gap={'0.25rem'}>
            <SelectionProgress sections={12} current={workContext.data.selection.elementIds.length} max={60} />
          </Stack>
        </Stack>
      </ViewSelectionMenu>
    </Group>
  );
}
