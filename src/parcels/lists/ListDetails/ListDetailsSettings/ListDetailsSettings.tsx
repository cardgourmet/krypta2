import {Group, Stack} from '@mantine/core';
import {useNavigate} from '@tanstack/react-router';
import {startTransition, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import type {UserList} from '@/parcels/lists/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import {Route} from '@/routes/me/lists/$listId.tsx';

export function ListDetailsSettings({list}: { list: UserList }) {
  const {t} = useTranslation('lists', {keyPrefix: 'details.settings'});
  const {t: t2} = useTranslation('lists', {keyPrefix: 'details.settings.sortBy'});
  const {t: t3} = useTranslation('lists', {keyPrefix: 'details.settings.sortDir'});
  const search = Route.useSearch();

  const [selectedTcg, setSelectedTcg] = useState<Tcg>(search.tcg ?? 'mtg');
  const [sortBy, setSortBy] = useState<string>(search.sort ?? 'addedAt');
  const [sortDir, setSortDir] = useState<string>(search.order ?? 'auto');

  const navigate = useNavigate();
  return (
    <Stack mb={'1.5rem'}>
      <Group>
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
            defaultSelected={selectedTcg}
            onSelect={(sel) => {
              setSelectedTcg(sel as Tcg);

              startTransition(() => {
                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/me/lists/$listId',
                  params: {
                    listId: list.slug,
                  },
                  search: (prev) => ({...prev, tcg: sel as Tcg}),
                  replace: true,
                });
              });
            }}
            miw={'14rem'}
          />
        </Group>

        <Group gap={'0.25rem'}>
          <GourmetText cgmff="ui" cgmc={'neutral-9'} fw={'500'}>
            {t('common.sortBy')}
          </GourmetText>
          <TextDropdown
            items={{
              name: t('sortBy.name'),
              addedAt: t('sortBy.addedAt'),
            }}
            t={t2}
            defaultSelected={sortBy}
            onSelect={(sel) => {
              setSortBy(sel);

              startTransition(() => {
                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/me/lists/$listId',
                  params: {
                    listId: list.slug,
                  },
                  search: () => ({...search, sort: sel as 'name' | 'addedAt'}),
                  replace: true,
                });
              });
            }}
            miw={'14rem'}
          />
          <TextDropdown
            items={{
              asc: t('sortDir.asc'),
              desc: t('sortDir.desc'),
              auto: t('sortDir.auto'),
            }}
            t={t3}
            defaultSelected={sortDir}
            onSelect={(sel) => {
              setSortDir(sel);

              startTransition(() => {
                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/me/lists/$listId',
                  params: {
                    listId: list.slug,
                  },
                  search: () => ({...search, order: sel as 'asc' | 'desc' | 'auto'}),
                  replace: true,
                });
              });
            }}
            miw={'14rem'}
          />
        </Group>
      </Group>
    </Stack>
  );
}
