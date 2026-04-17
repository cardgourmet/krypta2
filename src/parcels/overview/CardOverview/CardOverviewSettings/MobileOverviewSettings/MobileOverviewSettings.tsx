import {Button, Center, Group, SegmentedControl, Stack, Text, UnstyledButton} from '@mantine/core';
import {IconColumns3, IconLayoutGrid, IconToolsKitchen2, IconToolsKitchen2Off, IconX} from '@tabler/icons-react';
import type {TFunction} from 'i18next';
import {startTransition, useState} from 'react';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import type {OverviewSettings} from '@/parcels/overview/CardOverview/CardOverview.tsx';
import styles from '@/parcels/overview/CardOverview/CardOverviewSettings/CardOverviewSettings.module.css';
import type {DisplayMode, SortDirection, TcgSearchParams, TcgSortBy, TcgUniqueBy} from '@/parcels/tcg/types.ts';
import type {ApplyFn} from '@/parcels/types.ts';

export function MobileOverviewSettings({
  t,
  items,
  toolsEnabled,
  setToolsEnabled,
  setSettingsWrapper,
  initialOverviewSettings,
  close,
  setIsDisplayLoading,
}: {
  t: TFunction<string>;
  items: { sortBy: Record<string, string>; sortDir: Record<string, string>; uniqueBy: Record<string, string> };
  toolsEnabled: boolean;
  setToolsEnabled: (enabled: boolean) => void;
  setSettingsWrapper: (update: ApplyFn<TcgSearchParams>) => void;
  initialOverviewSettings: OverviewSettings;
  close: () => void;
  setIsDisplayLoading: (isLoading: boolean) => void;
}) {
  const [settings, setSettings] = useState<OverviewSettings>({ ...initialOverviewSettings });

  return (
    <Stack>
      <Group justify={'space-between'}>
        <Text ff={'var(--cgm-content-font-family)'} tt={'uppercase'} fw={'bold'}>
          {t('common.settings')}
        </Text>
        <Button onClick={close} style={{ padding: 0, border: 'none', background: 'none' }}>
          <IconX size={18} color={'var(--gourmet-neutral-8)'} />
        </Button>
      </Group>

      <Group justify={'space-between'}>
        <Group gap={'1rem'}>
          <Group gap={'0.25rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.sortby')}
            </GourmetText>
            <TextDropdown
              items={items.sortBy}
              t={t}
              transPrefix={'sortby'}
              defaultSelected={settings.sortBy}
              onSelect={(sel) => {
                setSettings({ ...settings, sortBy: sel as TcgSortBy });

                startTransition(() => {
                  setSettingsWrapper((prev) => {
                    return { ...prev, sortBy: sel as TcgSortBy };
                  });
                });
              }}
            />
            <TextDropdown
              items={items.sortDir}
              t={t}
              transPrefix={'sortdir'}
              defaultSelected={settings.sortDirection}
              onSelect={(sel) => {
                setSettings({ ...settings, sortDirection: sel as SortDirection });

                startTransition(() => {
                  setSettingsWrapper((prev) => {
                    return { ...prev, sortDirection: sel as SortDirection };
                  });
                });
              }}
            />
          </Group>
          <Group gap={'0.25rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.show')}
            </GourmetText>
            <TextDropdown
              items={items.uniqueBy}
              t={t}
              transPrefix={'uniqueby'}
              defaultSelected={settings.uniqueBy}
              onSelect={(sel) => {
                setSettings({ ...settings, uniqueBy: sel as TcgUniqueBy });

                startTransition(() => {
                  setSettingsWrapper((prev) => {
                    return { ...prev, uniqueBy: sel as TcgUniqueBy };
                  });
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
              height: '1.6875rem',
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
            transitionDuration={0}
            value={settings.display}
            onChange={(sel) => {
              setSettings({ ...settings, display: sel as DisplayMode });
              setIsDisplayLoading(true);

              startTransition(() => {
                setSettingsWrapper((prev) => {
                  return { ...prev, display: sel as DisplayMode };
                });
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
    </Stack>
  );
}
