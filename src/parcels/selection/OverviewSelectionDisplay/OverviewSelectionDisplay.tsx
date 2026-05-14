import {ActionIcon, Flex, Group, Stack, Tooltip} from '@mantine/core';
import {useClickOutside, useMediaQuery} from '@mantine/hooks';
import {IconEyeSearch, IconX} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {MorePagesDropdown} from '@/parcels/selection/OverviewSelectionDisplay/MorePagesDropdown/MorePagesDropdown.tsx';
import {SelectionProgress} from '@/parcels/selection/OverviewSelectionDisplay/SelectionProgress/SelectionProgress.tsx';
import {UseSelectionButton} from '@/parcels/selection/OverviewSelectionDisplay/UseSelectionButton/UseSelectionButton.tsx';
import {ViewSelectionMenu} from '@/parcels/selection/OverviewSelectionDisplay/ViewSelectionMenu/ViewSelectionMenu.tsx';
import {useTcgOverviewWorkStore} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkStore.ts';
import type {TcgSearchParams} from '@/parcels/tcg/types.ts';
import {type Tcg, useTcgByLocation} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './OverviewSelectionDisplay.module.css';

export function OverviewSelectionDisplay() {
  const { t } = useTranslation('selection');
  const smallScreen = useMediaQuery('(max-width: 580px)');

  const workData = useTcgOverviewWorkStore((state) => state.data);
  const isOverlayEnabled = useTcgOverviewWorkStore((state) => state.isSelectionOverlayEnabled);
  const clearSelection = useTcgOverviewWorkStore((state) => state.clearSelection);

  const tcg = useTcgByLocation() as Tcg;
  const navigate = useNavigate();

  const [menuOpened, setMenuOpened] = useState(false);
  const [eyeButton, setEyeButton] = useState<HTMLButtonElement | null>(null);
  const [dropdown, setDropdown] = useState<HTMLDivElement | null>(null);
  useClickOutside(() => setMenuOpened(false), null, [eyeButton, dropdown]);

  const cardAmount = workData?.selection?.elementIds?.length ?? 0;
  useEffect(() => {
    if (cardAmount === 0) {
      setMenuOpened(false);
    }
  }, [cardAmount]);

  const pageCardAmount = Object.keys(workData?.selection?.elementsByPage[workData.search.page] ?? []).length;

  return (
    <>
      {isOverlayEnabled && (
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
          <ViewSelectionMenu dropdownRef={setDropdown} menuOpened={menuOpened} setMenuOpened={setMenuOpened}>
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
                      {t('selection')}:
                    </GourmetText>
                    <GourmetText cgmff={'monospace'} c={'var(--gourmet-orange-1)'} fw={'500'} fz={'1.25rem'}>
                      {t('cards', { count: cardAmount })}
                    </GourmetText>

                    <Tooltip label={t('displaySelection')} openDelay={1000}>
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
                      text={t('currentPage')}
                      currentPage={workData?.search.page ?? 1}
                      onSelect={(sel) => {
                        // noinspection JSIgnoredPromiseFromCall
                        navigate({
                          to: `/$tcg/cards`,
                          search: (prev) => {
                            return { ...prev, page: Number(sel) } as Required<TcgSearchParams>;
                          },
                          params: {
                            tcg: tcg,
                          },
                          replace: true,
                        });
                      }}
                    />
                    <GourmetText>:</GourmetText>
                    <GourmetText pl={'0.5rem'} cgmff={'monospace'}>
                      {t('cards', { count: pageCardAmount })}
                    </GourmetText>
                  </Group>
                </Stack>
                <Group wrap={'nowrap'}>
                  <UseSelectionButton />
                  <Tooltip label={t('clearSelection')} openDelay={500}>
                    <ActionIcon
                      color={'var(--gourmet-neutral-3)'}
                      onClick={() => {
                        clearSelection();
                      }}
                    >
                      <IconX size={16} />
                    </ActionIcon>
                  </Tooltip>
                </Group>
              </Flex>
              <Stack gap={'0.25rem'}>
                <SelectionProgress sections={12} current={cardAmount} max={60} />
              </Stack>
            </Stack>
          </ViewSelectionMenu>
        </Group>
      )}
    </>
  );
}
