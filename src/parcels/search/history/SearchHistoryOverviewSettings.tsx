import {Button, Center, Group, TextInput} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/overview/CardOverviewSettings/TextDropdown/TextDropdown.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import {Route} from '@/routes/me/history';
import styles from './SearchHistoryOverview.module.css';

export function SearchHistoryOverviewSettings() {
  const { t } = useTranslation('history');
  const search = Route.useSearch();
  const navigate = useNavigate();

  const sortDirItems = {
    asc: t('sortdir.asc'),
    desc: t('sortdir.desc'),
  };

  return (
    <Group justify={'space-between'}>
      <Group gap={'1rem'}>
        <Group gap={'0.25rem'}>
          <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
            {t('common.sortby')}
          </GourmetText>
          <TextDropdown
            items={sortDirItems}
            t={t}
            transPrefix={'sortdir'}
            defaultSelected={search.sortDir}
            onSelect={(sel) => {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                from: '/me/history',
                search: (prev) => ({ ...prev, sortDir: sel as 'asc' | 'desc' }),
                replace: true,
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
            }}
            t={t}
            defaultSelected={search.tcg}
            onSelect={(sel) => {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                from: '/me/history',
                search: (prev) => ({ ...prev, tcg: sel as Tcg }),
                replace: true,
              });
            }}
            miw={'14rem'}
          />
        </Group>
      </Group>

      {/* TODO: search input */}
      <Group gap={0} className={styles.searchBarWrapper}>
        <TextInput className={styles.searchBarInput} placeholder={'Search...'} />
        <Button className={styles.searchBarButton} color={'var(--gourmet-blue-1)'}>
          <Center>
            <IconSearch size={16} color={'var(--gourmet-neutral-1)'} />
          </Center>
        </Button>
      </Group>
    </Group>
  );
}
