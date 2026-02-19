import {Center, Group, SegmentedControl, UnstyledButton} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconColumns3, IconLayoutGrid, IconToolsKitchen2, IconToolsKitchen2Off} from '@tabler/icons-react';
import {useEffect, useMemo, useRef, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/overview/CardOverviewSettings/TextDropdown/TextDropdown.tsx';
import {
  type DlcSearchDisplaySettings,
  type DlcSearchParams,
  type DlcSearchQuerySettings,
  type DlcSortBy,
  dlcSortBys,
  type DlcUniqueBy,
  dlcUniqueBys,
} from '@/parcels/tcg/dlc/types.ts';
import {
  type MtgSearchDisplaySettings,
  type MtgSearchParams,
  type MtgSearchQuerySettings,
  type MtgSortBy,
  mtgSortBys,
  type MtgUniqueBy,
  mtgUniqueBys,
} from '@/parcels/tcg/mtg/types.ts';
import {
  type PcgSearchDisplaySettings,
  type PcgSearchParams,
  type PcgSearchQuerySettings,
  type PcgSortBy,
  pcgSortBys,
  type PcgUniqueBy,
  pcgUniqueBys,
} from '@/parcels/tcg/pcg/types.ts';
import {type DisplayMode, type SortDirection, sortDirections, type TcgSortBy, type TcgUniqueBy,} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import styles from './CardOverviewSettings.module.css';

type CardOverviewSettingsProps = {
  tcg: Tcg;
  querySettings: MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings;
  displaySettings: MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings;
  setSettings: (update: ApplyFn<MtgSearchParams | DlcSearchParams | PcgSearchParams>) => void;
};

export default function CardOverviewSettings({
  tcg,
  querySettings,
  displaySettings,
  setSettings,
}: CardOverviewSettingsProps) {
  const { t } = useTranslation('cards', { keyPrefix: `${tcg}` });
  function fillTranslation(prefix: string, elements: string[]) {
    const items: Record<string, string> = {};
    elements.forEach((sortBy) => {
      items[sortBy as string] = t(`${prefix}.${(sortBy as string).toLowerCase()}`);
    });
    return items;
  }

  const smallScreen = useMediaQuery('(max-width: 800px)');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    if (isSidebarOpen) {
      // Disable scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isSidebarOpen]);

  const sidebarRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if ((sidebarRef.current?.offsetLeft ?? -1) < 0) return;
      if (isSidebarOpen && !sidebarRef.current?.contains(event.target as Element)) {
        setIsSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });

  const setSettingsWrapper: typeof setSettings = (update) => {
    setIsSidebarOpen(false);

    setSettings(update);
  };

  const sortBys: readonly DlcSortBy[] | readonly PcgSortBy[] | readonly MtgSortBy[] = useMemo(() => {
    if (tcg === 'pcg') {
      return pcgSortBys;
    } else if (tcg === 'mtg') {
      return mtgSortBys;
    } else {
      return dlcSortBys;
    }
  }, [tcg]);
  const uniqueBys: readonly DlcUniqueBy[] | readonly PcgUniqueBy[] | readonly MtgUniqueBy[] = useMemo(() => {
    if (tcg === 'pcg') {
      return pcgUniqueBys;
    } else if (tcg === 'mtg') {
      return mtgUniqueBys;
    } else {
      return dlcUniqueBys;
    }
  }, [tcg]);
  const sortByItems = fillTranslation('sortby', sortBys as string[]);
  const sortDirItems = fillTranslation('sortdir', sortDirections as readonly SortDirection[] as string[]);
  const uniqueByItems = fillTranslation('uniqueby', uniqueBys as string[]);

  const [toolsEnabled, setToolsEnabled] = useState<boolean>(true);

  return (
    <div className={styles.settings}>
      {!smallScreen && (
        <Group justify={'space-between'}>
          <Group gap={'1rem'}>
            <Group gap={'0.25rem'}>
              <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
                {t('common.sortby')}
              </GourmetText>
              <TextDropdown
                items={sortByItems}
                t={t}
                transPrefix={'sortby'}
                defaultSelected={querySettings.sortBy}
                onSelect={(sel) => {
                  setSettingsWrapper((prev) => {
                    return { ...prev, sortBy: sel as TcgSortBy };
                  });
                }}
              />
              <TextDropdown
                items={sortDirItems}
                t={t}
                transPrefix={'sortdir'}
                defaultSelected={querySettings.sortDirection}
                onSelect={(sel) => {
                  setSettingsWrapper((prev) => {
                    return { ...prev, sortDirection: sel as SortDirection };
                  });
                }}
              />
            </Group>
            <Group gap={'0.25rem'}>
              <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
                {t('common.show')}
              </GourmetText>
              <TextDropdown
                items={uniqueByItems}
                t={t}
                transPrefix={'uniqueby'}
                defaultSelected={querySettings.uniqueBy}
                onSelect={(sel) => {
                  setSettingsWrapper((prev) => {
                    return { ...prev, uniqueBy: sel as TcgUniqueBy };
                  });
                }}
              />
            </Group>
          </Group>
          <Group>
            <UnstyledButton
              style={{
                backgroundColor: toolsEnabled ? 'var(--gourmet-blue-1)' : 'var(--gourmet-neutral-2)',
                borderRadius: '4px',
                border: toolsEnabled
                  ? '1px solid color-mix(in srgb, var(--gourmet-blue-1), white 10%)'
                  : '1px solid var(--gourmet-neutral-3)',
                height: '1.625rem',
              }}
              p={'0 0.5rem'}
              onClick={() => setToolsEnabled(!toolsEnabled)}
            >
              <Group justify={'center'} align={'center'} w={'100%'} h={'100%'} gap={'0.25rem'}>
                {toolsEnabled && <IconToolsKitchen2 size={16} color={'var(--gourmet-neutral-0)'} />}
                {!toolsEnabled && <IconToolsKitchen2Off size={16} color={'var(--gourmet-neutral-5)'} />}

                <GourmetText
                  cgmff={'ui'}
                  fz="0.9rem"
                  fw={'500'}
                  c={toolsEnabled ? 'var(--gourmet-neutral-0)' : 'var(--gourmet-neutral-5)'}
                >
                  Tools
                </GourmetText>
              </Group>
            </UnstyledButton>
            <SegmentedControl
              classNames={{ root: styles.displayModeControl }}
              color={'var(--gourmet-blue-1)'}
              transitionDuration={100}
              transitionTimingFunction={'linear'}
              value={displaySettings.display}
              onChange={(sel) => {
                setSettingsWrapper((prev) => {
                  return { ...prev, display: sel as DisplayMode };
                });
              }}
              data={[
                {
                  value: 'grid',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconLayoutGrid size={16} />
                      <span>{t('displaymode.grid')}</span>
                    </Center>
                  ),
                },
                {
                  value: 'table',
                  label: (
                    <Center style={{ gap: 10 }}>
                      <IconColumns3 size={16} />
                      <span>{t('displaymode.table')}</span>
                    </Center>
                  ),
                },
              ]}
            />
          </Group>
        </Group>
      )}

      {/*{smallScreen && (
        <div>
          <div className={`${styles.settingsSidebar} ${isSidebarOpen ? styles.shown : ''}`} ref={sidebarRef}>
            <div className={styles.settingsSidebarHeader}>
              <button type="button" onClick={() => setIsSidebarOpen(false)}>
                <IconX size={20} />
              </button>
            </div>
            <div className={styles.settingsSidebarContent}>
              <div>
                <p>{t('common.sortby')}</p>
                <Dropdown
                  items={sortByItems}
                  defaultSelected={querySettings.sortBy}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, sortBy: selected as DlcSortBy | PcgSortBy | MtgSortBy };
                    });
                  }}
                />
                <Dropdown
                  items={sortDirItems}
                  defaultSelected={querySettings.sortDirection}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, sortDirection: selected as SortDirection };
                    });
                  }}
                />
              </div>
              <div>
                <p>{t('common.show')}</p>
                <Dropdown
                  items={uniqueByItems}
                  defaultSelected={querySettings.uniqueBy}
                  onSelect={(selected) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, pageSize: selected as DlcUniqueBy | PcgUniqueBy | MtgUniqueBy };
                    });
                  }}
                />
              </div>
              <div>
                <p>{t('common.as')}</p>
                <Dropdown
                  items={displayModeItems}
                  defaultSelected={displaySettings.display}
                  onSelect={(selected: string) => {
                    setSettingsWrapper((prev) => {
                      return { ...prev, display: selected as DisplayMode };
                    });
                  }}
                />
              </div>
            </div>
          </div>
          <button type="button" className={styles.iconButton} onClick={() => setIsSidebarOpen(true)}>
            <IconAdjustmentsHorizontal />
          </button>
        </div>
      )}*/}
    </div>
  );
}
