import { Group, Stack } from '@mantine/core';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestAnimationFrameTransition } from '@/parcels/animation/requestAnimationFrameTransition.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { TextDropdown } from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import { groupBy } from '@/parcels/groupBy.ts';
import { TcgFilterPill } from '@/parcels/lists/ListDetails/TcgFilterPill.tsx';
import type { ResolvedUserListResource, UserList } from '@/parcels/lists/types.ts';
import { useListLoaderStore } from '@/parcels/lists/useListLoader.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { DataUser } from '@/parcels/user/api.ts';
import { Route } from '@/routes/@{$user}/lists/$listId.tsx';

export function ListDetailsSettings({
  owner,
  list,
  allResources,
}: {
  owner: DataUser;
  list: UserList;
  allResources: ResolvedUserListResource[];
}) {
  const { t } = useTranslation('lists', { keyPrefix: 'details.settings' });
  const { t: t2 } = useTranslation('lists', { keyPrefix: 'details.settings.sortBy' });
  const { t: t3 } = useTranslation('lists', { keyPrefix: 'details.settings.sortDir' });
  const search = Route.useSearch();

  // const [selectedTcg, setSelectedTcg] = useState<Tcg>(search.tcg ?? 'mtg');
  const [sortBy, setSortBy] = useState<string>(search.sort ?? 'addedAt');
  const [sortDir, setSortDir] = useState<string>(search.order ?? 'auto');

  const navigate = Route.useNavigate();

  const [selectedTcgs, setSelectedTcgs] = useState<Tcg[]>(search.tcgs ?? []);
  const sizeByTcg = useMemo(() => {
    const grouped = groupBy(allResources, (r) => r.listResource.game as Tcg);
    const obj = {} as Record<Tcg, number>;
    for (const groupedKey in grouped) {
      obj[groupedKey as Tcg] = grouped[groupedKey as Tcg]?.length;
    }

    return obj;
  }, [allResources]);

  const setOverlayLoading = useListLoaderStore((s) => s.setLoading);

  return (
    <Stack mb={'1.5rem'}>
      <Stack gap={'0.5rem'}>
        <Group gap={'0.5rem'}>
          <TcgFilterPill
            tcg={'all'}
            size={allResources.length}
            state={selectedTcgs.length === 0}
            onToggle={(state) => {
              if (state) {
                setSelectedTcgs([]);
                setOverlayLoading(true);

                requestAnimationFrameTransition(() => {
                  // noinspection JSIgnoredPromiseFromCall
                  navigate({
                    to: '/@{$user}/lists/$listId',
                    params: {
                      user: owner.username,
                      listId: list.slug,
                    },
                    search: (prev) => ({ ...prev, tcgs: undefined }),
                    replace: true,
                  });

                  setOverlayLoading(false);
                });
              }
            }}
            fallback
          />

          {Object.entries(sizeByTcg).map(([key, value]) => {
            return (
              <TcgFilterPill
                key={key}
                tcg={key as Tcg}
                size={value}
                state={selectedTcgs.includes(key as Tcg)}
                onToggle={(state) => {
                  let newTcgs: Tcg[];

                  if (state) {
                    newTcgs = [...selectedTcgs, key as Tcg];
                  } else {
                    newTcgs = selectedTcgs.filter((t) => t !== (key as Tcg));
                  }

                  setSelectedTcgs(newTcgs);
                  setOverlayLoading(true);

                  requestAnimationFrameTransition(() => {
                    // noinspection JSIgnoredPromiseFromCall
                    navigate({
                      to: '/@{$user}/lists/$listId',
                      params: {
                        user: owner.username,
                        listId: list.slug,
                      },
                      search: (prev) => ({ ...prev, tcgs: newTcgs.length === 0 ? undefined : newTcgs.join(',') }),
                      replace: true,
                    });

                    setOverlayLoading(false);
                  });
                }}
              />
            );
          })}
        </Group>
      </Stack>

      <Group>
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
              setOverlayLoading(true);

              requestAnimationFrameTransition(() => {
                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/@{$user}/lists/$listId',
                  params: {
                    user: owner.username,
                    listId: list.slug,
                  },
                  search: () => ({ ...search, sort: sel as 'name' | 'addedAt' }),
                  replace: true,
                });

                setOverlayLoading(false);
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
              setOverlayLoading(true);

              requestAnimationFrameTransition(() => {
                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/@{$user}/lists/$listId',
                  params: {
                    user: owner.username,
                    listId: list.slug,
                  },
                  search: () => ({ ...search, order: sel as 'asc' | 'desc' | 'auto' }),
                  replace: true,
                });

                setOverlayLoading(false);
              });
            }}
            miw={'14rem'}
          />
        </Group>
      </Group>
    </Stack>
  );
}
