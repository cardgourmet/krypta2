import {ActionIcon, Button, Flex, Group, Menu, Popover, Progress, Stack, Tooltip} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconAlertSquareRounded, IconBookmark, IconChevronRight, IconEyeSearch, IconList, IconPlus, IconStar, IconX,} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {MorePagesDropdown} from '@/parcels/selection/OverviewSelectionDisplay/MorePagesDropdown.tsx';
import type {TcgOverviewWorkAmbient} from '@/parcels/selection/TcgOverviewWorkContext.tsx';
import type {DlcSearchParams} from '@/parcels/tcg/dlc/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './OverviewSelectionDisplay.module.css';

export function OverviewSelectionDisplay({ context: workContext }: { context: TcgOverviewWorkAmbient }) {
  const smallScreen = useMediaQuery('(max-width: 580px)');
  const smallestScreen = useMediaQuery('(max-width: 500px)');

  const tcg = useTcgByLocation() as Tcg;
  const navigate = useNavigate();

  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

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
              <Tooltip label={'Auswahl anzeigen'} openDelay={500}>
                <ActionIcon className={styles.selectionShowButton}>
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
            <Menu
              width={260}
              position="top"
              opened={menuOpened}
              onChange={setMenuOpened}
              withArrow
              classNames={{ dropdown: styles.menuDropdown }}
            >
              <Menu.Target>
                <Button color={'var(--gourmet-orange-1'} className={styles.selectionButton}>
                  <GourmetText cgmff={'ui'} cgmc={'neutral-1'} fw={'500'}>
                    Auswahl verwenden für ...
                  </GourmetText>
                </Button>
              </Menu.Target>

              <Menu.Dropdown>
                <Menu.Item>
                  <Group gap={'0.5rem'}>
                    <IconStar size={18} />
                    <GourmetText cgmff={'ui'}>Als Favoriten markieren</GourmetText>
                  </Group>
                </Menu.Item>
                <Menu.Item>
                  <Group gap={'0.5rem'}>
                    <IconBookmark size={18} />
                    <GourmetText cgmff={'ui'}>Zu Lesezeichen hinzufügen</GourmetText>
                  </Group>
                </Menu.Item>

                <Menu
                  opened={submenuOpened}
                  onChange={setSubmenuOpened}
                  width={200}
                  trigger={'click-hover'}
                  position={smallestScreen ? 'top' : 'right-start'}
                  openDelay={120}
                  closeDelay={150}
                >
                  <Menu.Target>
                    <Menu.Item closeMenuOnClick={false} onClick={() => setSubmenuOpened((prev) => !prev)}>
                      <Group justify={'space-between'}>
                        <Group gap={'0.5rem'}>
                          <IconList size={18} />
                          <GourmetText cgmff={'ui'}>Zur Liste hinzufügen ..</GourmetText>
                        </Group>
                        <IconChevronRight size={18} />
                      </Group>
                    </Menu.Item>
                  </Menu.Target>

                  <Menu.Dropdown>
                    {['My MTG list 1', 'second List', 'dritte Liste', 'oh my goddness', 'oh my damn'].map(
                      (item, index) => (
                        <Menu.Item key={index}>
                          <Group gap={'0.5rem'}>
                            <GourmetText cgmff={'ui'}>{item}</GourmetText>
                          </Group>
                        </Menu.Item>
                      ),
                    )}

                    <Menu.Divider />

                    <Menu.Item>
                      <Group gap={'0.5rem'}>
                        <IconPlus size={18} />
                        <GourmetText cgmff={'ui'}>Neue Erstellen</GourmetText>
                      </Group>
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </Menu.Dropdown>
            </Menu>
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
    </Group>
  );
}

function generateProgress(sections: number, current: number, max: number) {
  const ratio = max > 0 ? current / max : 0;
  const toPaintCount = Math.max(0, Math.min(sections, Math.ceil(ratio * sections)));
  const toPaintIndex = toPaintCount - 1;

  let color = 'var(--gourmet-green-1)';
  if (ratio <= 0.5) {
    color = 'var(--gourmet-green-1)';
  } else if (ratio <= 0.75) {
    color = 'var(--gourmet-orange-1)';
  } else {
    color = 'var(--gourmet-red-01)';
  }

  return (
    <>
      <Group justify={'end'}>
        <Group gap={'0.25rem'}>
          <Group gap={'0.1rem'}>
            <GourmetText cgmff={'ui'} fw={'500'} c={color}>
              {current}
            </GourmetText>
            <GourmetText cgmff={'ui'}>/60</GourmetText>
          </Group>

          <Popover width={300} position="bottom" withArrow shadow="md">
            <Popover.Target>
              <ActionIcon className={styles.selectionInfoButton}>
                <IconAlertSquareRounded size={20} />
              </ActionIcon>
            </Popover.Target>

            <Popover.Dropdown>
              <Stack>
                <GourmetText>
                  Du darfst nur maximal <b>60</b> Karten gleichzeitig auswählen.
                </GourmetText>
                <GourmetText>
                  Falls du mehr auswählen möchtest, überlege zuerst, ob du eventuell lieber{' '}
                  <u>die gesamte Suche abspeichern</u> willst.
                </GourmetText>
              </Stack>
            </Popover.Dropdown>
          </Popover>
        </Group>
      </Group>
      <Group grow gap={'0.25rem'}>
        {Array.from(Array(sections).keys()).map((_, index) => {
          return <Progress key={index} color={color} size="xs" value={index <= toPaintIndex ? 100 : 0} />;
        })}
      </Group>
    </>
  );
}
