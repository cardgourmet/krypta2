import {Center, Group, SegmentedControl, UnstyledButton} from '@mantine/core';
import {IconColumns3, IconLayoutGrid, IconToolsKitchen2, IconToolsKitchen2Off} from '@tabler/icons-react';
import type {TFunction} from 'i18next';
import {startTransition, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import type {OverviewSettings} from '@/parcels/overview/CardOverview/CardOverview.tsx';
import styles from '@/parcels/overview/CardOverview/CardOverviewSettings/CardOverviewSettings.module.css';
import type {DisplayMode, SortDirection, TcgSearchParams, TcgSortBy, TcgUniqueBy} from '@/parcels/tcg/types.ts';
import type {ApplyFn} from '@/parcels/types.ts';

export function DesktopOverviewSettings({
  t,
  items,
  toolsEnabled,
  setToolsEnabled,
  setSettingsWrapper,
  initialOverviewSettings,
  setIsDisplayLoading,
}: {
  t: TFunction<string>;
  items: { sortBy: Record<string, string>; sortDir: Record<string, string>; uniqueBy: Record<string, string> };
  toolsEnabled: boolean;
  setToolsEnabled: (enabled: boolean) => void;
  setSettingsWrapper: (update: ApplyFn<TcgSearchParams>) => void;
  initialOverviewSettings: OverviewSettings;
  setIsDisplayLoading: (isLoading: boolean) => void;
}) {
  const { user } = useAuth();
  const [toolsButtonEnabled, setToolsButtonEnabled] = useState(toolsEnabled ?? true);

  const [settings, setSettings] = useState<OverviewSettings>({ ...initialOverviewSettings });

  return (
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
        {user && (
          <UnstyledButton
            style={{
              backgroundColor: toolsButtonEnabled ? 'var(--gourmet-blue-1)' : 'var(--gourmet-neutral-2)',
              borderRadius: '4px',
              border: toolsButtonEnabled
                ? '1px solid color-mix(in srgb, var(--gourmet-blue-1), white 10%)'
                : '1px solid var(--gourmet-neutral-3)',
              height: '1.6875rem',
            }}
            p={'0 0.5rem'}
            onClick={() => {
              setToolsButtonEnabled(!toolsButtonEnabled);

              startTransition(() => {
                setToolsEnabled(!toolsButtonEnabled);
              });
            }}
          >
            <Group justify={'center'} align={'center'} w={'100%'} h={'100%'} gap={'0.25rem'}>
              {toolsButtonEnabled && <IconToolsKitchen2 size={16} color={'var(--gourmet-neutral-0)'} />}
              {!toolsButtonEnabled && <IconToolsKitchen2Off size={16} color={'var(--gourmet-neutral-5)'} />}

              <GourmetText
                cgmff={'ui'}
                fz="0.9rem"
                fw={'500'}
                c={toolsButtonEnabled ? 'var(--gourmet-neutral-0)' : 'var(--gourmet-neutral-5)'}
              >
                Tools
              </GourmetText>
            </Group>
          </UnstyledButton>
        )}
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
  );
}
