import {Center, Group, SegmentedControl} from '@mantine/core';
import {IconColumns3, IconLayoutGrid} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/overview/CardOverviewSettings/TextDropdown/TextDropdown.tsx';
import {Route} from '@/routes/me/lists';
import styles from './DesktopListOverviewSettings.module.css';

export function DesktopListOverviewSettings() {
  const { t } = useTranslation('lists');
  const search = Route.useSearch();
  const navigate = useNavigate();

  const sortByItems = {
    name: 'Name',
    updatedAt: 'Last Updated',
    size: 'Size',
  };

  const sortDirItems = {
    asc: 'Ascending',
    desc: 'Descending',
    auto: 'Auto',
  };

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
            defaultSelected={search.sortBy}
            onSelect={(sel) => {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                from: '/me/lists',
                search: (prev) => ({ ...prev, sortBy: sel as 'name' | 'updatedAt' | 'size' }),
                replace: true,
              });
            }}
          />
          <TextDropdown
            items={sortDirItems}
            t={t}
            transPrefix={'sortdir'}
            defaultSelected={search.sortDir}
            onSelect={(sel) => {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                from: '/me/lists',
                search: (prev) => ({ ...prev, sortDir: sel as 'auto' | 'asc' | 'desc' }),
                replace: true,
              });
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
          value={search.display}
          onChange={(sel) => {
            // noinspection JSIgnoredPromiseFromCall
            navigate({
              from: '/me/lists',
              search: (prev) => ({ ...prev, display: sel as 'grid' | 'table' }),
              replace: true,
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
