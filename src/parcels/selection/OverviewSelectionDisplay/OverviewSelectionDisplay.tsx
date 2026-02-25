import {ActionIcon, Button, Group, Menu, Popover, Progress, Stack, Tooltip} from '@mantine/core';
import {IconAlertSquareRounded, IconBookmark, IconEyeSearch, IconList, IconPlus, IconStar, IconX,} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import type {TcgOverviewWorkAmbient} from '@/parcels/selection/TcgOverviewWorkContext.tsx';
import {MorePagesDropdown} from '@/parcels/selection/OverviewSelectionDisplay/MorePagesDropdown.tsx';
import type {DlcSearchParams} from '@/parcels/tcg/dlc/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './OverviewSelectionDisplay.module.css';

export function OverviewSelectionDisplay({ context: workContext }: { context: TcgOverviewWorkAmbient }) {
  const tcg = useTcgByLocation() as Tcg;
  const navigate = useNavigate();

  const [menuOpened, setMenuOpened] = useState(false);

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
        gap={'0.1rem'}
      >
        <Group wrap={'nowrap'} justify={'space-between'}>
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
              width={300}
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

                <Menu.Sub openDelay={120} closeDelay={150}>
                  <Menu.Sub.Target>
                    <Menu.Sub.Item>
                      <Group gap={'0.5rem'}>
                        <IconList size={18} />
                        <GourmetText cgmff={'ui'}>Zur Liste hinzufügen ..</GourmetText>
                      </Group>
                    </Menu.Sub.Item>
                  </Menu.Sub.Target>

                  <Menu.Sub.Dropdown>
                    <Menu.Item>
                      <Group gap={'0.5rem'}>
                        <GourmetText cgmff={'ui'}>My MTG list 1</GourmetText>
                      </Group>
                    </Menu.Item>
                    <Menu.Item>
                      <Group gap={'0.5rem'}>
                        <GourmetText cgmff={'ui'}>second List</GourmetText>
                      </Group>
                    </Menu.Item>
                    <Menu.Item>
                      <Group gap={'0.5rem'}>
                        <GourmetText cgmff={'ui'}>dritte Liste</GourmetText>
                      </Group>
                    </Menu.Item>
                    <Menu.Item>
                      <Group gap={'0.5rem'}>
                        <GourmetText cgmff={'ui'}>oh my goddness</GourmetText>
                      </Group>
                    </Menu.Item>
                    <Menu.Item>
                      <Group gap={'0.5rem'}>
                        <GourmetText cgmff={'ui'}>oh my damn</GourmetText>
                      </Group>
                    </Menu.Item>

                    <Menu.Divider />

                    <Menu.Item>
                      <Group gap={'0.5rem'}>
                        <IconPlus size={18} />
                        <GourmetText cgmff={'ui'}>Neue Erstellen</GourmetText>
                      </Group>
                    </Menu.Item>
                  </Menu.Sub.Dropdown>
                </Menu.Sub>
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
        </Group>
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
