import {Center, Group, SegmentedControl} from '@mantine/core';
import {IconColumns3, IconLayoutGrid} from '@tabler/icons-react';
import {useTranslation} from 'react-i18next';
import styles from '@/parcels/lists/ListsOverview/ListsOverview.module.css';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/overview/CardOverviewSettings/TextDropdown/TextDropdown.tsx';

export function DesktopListOverviewSettings() {
  const { t } = useTranslation('lists');

  const sortByItems = {
    name: 'Name',
    updatedAt: 'Last Updated',
    size: 'Size',
  };
  const defaultSortBy = 'name';

  const sortDirItems = {
    asc: 'Ascending',
    desc: 'Descending',
    auto: 'Auto',
  };
  const defaultSortDirection = 'auto';

  const defaultDisplayMode = 'grid';

  return (
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
            defaultSelected={defaultSortBy}
            onSelect={() => {
              /*setSettingsWrapper((prev) => {
                return { ...prev, sortBy: sel as TcgSortBy };
              });*/
            }}
          />
          <TextDropdown
            items={sortDirItems}
            t={t}
            transPrefix={'sortdir'}
            defaultSelected={defaultSortDirection}
            onSelect={() => {
              /*setSettingsWrapper((prev) => {
                return { ...prev, sortDirection: sel as SortDirection };
              });*/
            }}
          />
        </Group>
      </Group>
      <Group>
        <SegmentedControl
          classNames={{ root: styles.displayModeControl }}
          color={'var(--gourmet-blue-1)'}
          transitionDuration={100}
          transitionTimingFunction={'linear'}
          value={defaultDisplayMode}
          onChange={() => {
            /*setSettingsWrapper((prev) => {
              return { ...prev, display: sel as DisplayMode };
            });*/
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
