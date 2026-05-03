import {Button, Center, Group, TextInput} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import {Route} from '@/routes/me/history';
import styles from './SearchHistoryOverviewSettings.module.css';

export function SearchHistoryOverviewSettings() {
  const { t } = useTranslation('history');
  const search = Route.useSearch();
  const navigate = useNavigate();

  const sortDirItems = {
    asc: t('sortdir.asc'),
    desc: t('sortdir.desc'),
  };
  const [searchQuery, setSearchQuery] = useState('');

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
                to: '/me/history',
                search: () => ({ ...search, sortDir: sel as 'asc' | 'desc' }),
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
                to: '/me/history',
                search: () => ({ ...search, tcg: sel as Tcg }),
              });
            }}
            miw={'14rem'}
          />
        </Group>
      </Group>

      <Group gap={0} className={styles.searchBarWrapper}>
        <TextInput
          className={styles.searchBarInput}
          placeholder={t('searchbarPlaceholder')}
          onChange={(event) => setSearchQuery(event.currentTarget.value)}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                to: '/me/history',
                search: { ...search, page: 1, search: searchQuery },
              });
            }
          }}
        />
        <Button
          className={styles.searchBarButton}
          color={'var(--gourmet-blue-1)'}
          onClick={() => {
            // noinspection JSIgnoredPromiseFromCall
            navigate({
              to: '/me/history',
              search: { ...search, page: 1, search: searchQuery },
            });
          }}
        >
          <Center>
            <IconSearch size={16} color={'var(--gourmet-neutral-1)'} />
          </Center>
        </Button>
      </Group>
    </Group>
  );
}
