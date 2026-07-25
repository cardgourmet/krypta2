import { Center, Group, SegmentedControl, Stack } from '@mantine/core';
import { IconColumns3, IconLayoutGrid } from '@tabler/icons-react';
import { useNavigate } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TextDropdown } from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import { SimpleSearchbar } from '@/parcels/search/bar/SimpleSearchbar/SimpleSearchbar.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Route } from '@/routes/@{$user}/lists';
import styles from './ListOverviewSettings.module.css';

export function ListOverviewSettings({ onChange }: { onChange?: () => void }) {
  const { t } = useTranslation('lists', { keyPrefix: 'overview.settings' });
  const search = Route.useSearch();
  const navigate = useNavigate();

  const { user } = useAuth();

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
    <Stack gap={'1rem'}>
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
                if (onChange) onChange();

                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  from: `/@{$user}/lists/`,
                  search: (prev) => ({ ...prev, sortBy: sel as 'name' | 'updatedAt' | 'size' }),
                  replace: true,
                  params: {
                    user: user?.username ?? '',
                  },
                });
              }}
            />
            <TextDropdown
              items={sortDirItems}
              t={t}
              transPrefix={'sortdir'}
              defaultSelected={search.sortDir}
              onSelect={(sel) => {
                if (onChange) onChange();

                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  from: `/@{$user}/lists/`,
                  search: (prev) => ({ ...prev, sortDir: sel as 'auto' | 'asc' | 'desc' }),
                  replace: true,
                  params: {
                    user: user?.username ?? '',
                  },
                });
              }}
            />
          </Group>
          <Group gap={'0.25rem'}>
            <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
              {t('common.filterBy')}
            </GourmetText>
            <TextDropdown
              items={{
                mtg: t('mtg'),
                pcg: t('pcg'),
                dlc: t('dlc'),
                all: t('all'),
              }}
              t={t}
              defaultSelected={search.tcg}
              onSelect={(sel) => {
                if (onChange) onChange();

                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  from: `/@{$user}/lists/`,
                  search: (prev) => ({ ...prev, tcg: sel as Tcg }),
                  replace: true,
                  params: {
                    user: user?.username ?? '',
                  },
                });
              }}
              miw={'14rem'}
            />
          </Group>
        </Group>

        <SimpleSearchbar
          onChange={(searchQuery) => {
            if (onChange) onChange();

            // noinspection JSIgnoredPromiseFromCall
            navigate({
              from: `/@{$user}/lists/`,
              search: { ...search, search: searchQuery },
              replace: true,
              params: {
                user: user?.username ?? '',
              },
            });
          }}
        />
      </Group>

      <Group justify={'end'}>
        <SegmentedControl
          classNames={{ root: styles.displayModeControl }}
          color={'var(--gourmet-blue-1)'}
          transitionDuration={100}
          transitionTimingFunction={'linear'}
          value={search.display}
          onChange={(sel) => {
            if (onChange) onChange();

            // noinspection JSIgnoredPromiseFromCall
            navigate({
              from: `/@{$user}/lists/`,
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
    </Stack>
  );
}
