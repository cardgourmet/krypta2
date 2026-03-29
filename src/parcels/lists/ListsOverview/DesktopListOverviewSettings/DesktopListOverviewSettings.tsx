import {Group} from '@mantine/core';
import {useNavigate} from '@tanstack/react-router';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/overview/CardOverviewSettings/TextDropdown/TextDropdown.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import {Route} from '@/routes/me/lists';

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
            defaultSelected={'mtg'}
            onSelect={(sel) => {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                from: '/me/lists',
                search: (prev) => ({ ...prev, tcg: sel as Tcg }),
                replace: true,
              });
            }}
            miw={'14rem'}
          />
        </Group>
      </Group>
    </Group>
  );
}
