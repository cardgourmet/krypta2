import { Center, Group, Loader, Space, Stack } from '@mantine/core';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { requestAnimationFrameTransition } from '@/parcels/animation/requestAnimationFrameTransition.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { Dropzone } from '@/parcels/generic/Dropzone.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { groupBy } from '@/parcels/groupBy.ts';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { CONTEXT_LIST_MAIN, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { getAllResourcesFromList } from '@/parcels/lists/api.ts';
import { extractScryfallInfo } from '@/parcels/lists/ListDetails/extractScryfallInfo.ts';
import { ListDetailsCardGrid } from '@/parcels/lists/ListDetails/ListDetailsCardGrid/ListDetailsCardGrid.tsx';
import { ListDetailsHeader } from '@/parcels/lists/ListDetails/ListDetailsHeader/ListDetailsHeader.tsx';
import { ListDetailsQueryStack } from '@/parcels/lists/ListDetails/ListDetailsQueryStack/ListDetailsQueryStack.tsx';
import { ListDetailsSettings } from '@/parcels/lists/ListDetails/ListDetailsSettings/ListDetailsSettings.tsx';
import { TcgFilterPill } from '@/parcels/lists/ListDetails/TcgFilterPill.tsx';
import type { ResolvedUserListResource, UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { useUserLimits } from '@/parcels/lists/useInList.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { ListDetailsSelectionDisplay } from '@/parcels/selection/ListDetailsSelectionDisplay/ListDetailsSelectionDisplay.tsx';
import { SelectionProgress } from '@/parcels/selection/OverviewSelectionDisplay/SelectionProgress/SelectionProgress.tsx';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { DataUser } from '@/parcels/user/api.ts';
import { Route } from '@/routes/@{$user}/lists/$listId.tsx';

export function ListDetails({ owner, list, publicView }: { owner: DataUser; list: UserList; publicView: boolean }) {
  const { t } = useTranslation('lists');
  const search = Route.useSearch();
  const { user } = useAuth();

  const navigate = Route.useNavigate();

  const [resourcesLoading, setResourcesLoading] = useState<boolean>(false);
  const [localListWithResources, setLocalListWithResources] = useState<UserListWithResources>({
    list: list,
  });
  const thisAndThatResources = useMemo(() => {
    return Object.values(localListWithResources.resources ?? {})
      .flatMap((res) => {
        return res.map((r) => [r.listResource, ...(r.otherListResources ?? [])]);
      })
      .flat();
  }, [localListWithResources.resources]);

  useActiveLists(CONTEXT_LIST_MAIN, thisAndThatResources);
  const { list_resources_per_list } = useUserLimits(user);

  useEffect(() => {
    setResourcesLoading(true);
    startTransition(async () => {
      const res = await getAllResourcesFromList(list.userId, list.id);

      setResourcesLoading(false);
      if (res.error) {
        sendErrorNotification(res.error);
        return;
      }

      const listWithResources = {
        list: list,
        resources: res.data,
        size: (res?.data?.card?.length ?? 0) + (res?.data?.user_search?.length ?? 0),
      } as UserListWithResources;
      setLocalListWithResources(listWithResources);
    });
  }, [list]);

  const [searchResources, setSearchResources] = useState<ResolvedUserListResource[]>(
    localListWithResources?.resources?.user_search ?? [],
  );
  const [cardResources, setCardResources] = useState<ResolvedUserListResource[]>(
    localListWithResources?.resources?.card ?? [],
  );
  const allResources = useMemo(() => {
    return [...searchResources, ...cardResources];
  }, [cardResources, searchResources]);

  const setData = useListDetailsWorkStore((state) => state.setData);
  useEffect(() => {
    const search = localListWithResources?.resources?.user_search ?? [];
    const card = localListWithResources?.resources?.card ?? [];

    setSearchResources(search);
    setCardResources(card);

    const allResources = [...search, ...card];
    setData({
      page: 1,
      rawElements: allResources.map((r) => ({ id: r.listResource.resourceId, element: r })),
      other: {},
    });
  }, [localListWithResources?.resources, setData]);

  const { component, title } = useBreadcrumbs({
    subpage: `@${owner?.username}`,
    moreSubpages: [
      {
        label: t('details.header.breadcrumbs.lists'),
        href: `/@${owner?.username}/lists`,
      },
      {
        label:
          list.systemListType !== undefined
            ? t(`overview.card.system.${localListWithResources.list.name}`)
            : localListWithResources.list.name,
      },
    ],
  });

  const sortResources = useCallback(
    (res: ResolvedUserListResource[]) => {
      return [...res].sort((a, b) => {
        if (search.sort === 'addedAt') {
          const dateA = a.listResource.updatedAt ? new Date(a.listResource.updatedAt).getTime() : 0;
          const dateB = b.listResource.updatedAt ? new Date(b.listResource.updatedAt).getTime() : 0;
          return (dateA - dateB) * (search.order === 'asc' ? 1 : -1);
        }
        if (search.sort === 'name') {
          const nameA = a.resourceData.name as string;
          const nameB = b.resourceData.name as string;

          return nameA.localeCompare(nameB) * (search.order === 'desc' ? -1 : 1);
        }
        return 0;
      });
    },
    [search.order, search.sort],
  );

  const [isDraggedOver, setDraggedOver] = useState<boolean>(false);
  const pageTitle = useMemo(() => {
    const yourLists = owner.username === user?.username;

    return `${list.systemListType === 'favorites' ? t('overview.card.system.favorites') : localListWithResources.list.name} – ${
      yourLists ? t('details.pageTitle') : t('details.pageTitleOther', { name: owner.username })
    } – Cardgourmet`;
  }, [localListWithResources.list.name, list.systemListType, owner.username, t, user?.username]);

  // TODO: extract this to list details settings
  // TODO: have loading spinner when settings change
  const [selectedTcgs, setSelectedTcgs] = useState<Tcg[]>(search.tcgs ?? []);
  const sizeByTcg = useMemo(() => {
    const grouped = groupBy(allResources, (r) => r.listResource.game as Tcg);
    const obj = {} as Record<Tcg, number>;
    for (const groupedKey in grouped) {
      obj[groupedKey as Tcg] = grouped[groupedKey as Tcg]?.length;
    }

    return obj;
  }, [allResources]);

  const sortedSearchResources = useMemo(() => {
    const sorted = sortResources(searchResources);
    if (!selectedTcgs || selectedTcgs.length === 0) return sorted;

    return sorted.filter((r) => selectedTcgs.includes(r.listResource.game as Tcg));
  }, [searchResources, sortResources, selectedTcgs]);
  const sortedCardResources = useMemo(() => {
    const sorted = sortResources(cardResources);
    if (!selectedTcgs || selectedTcgs.length === 0) return sorted;

    return sorted.filter((r) => selectedTcgs.includes(r.listResource.game as Tcg));
  }, [cardResources, sortResources, selectedTcgs]);

  return (
    <div style={{ position: 'relative' }}>
      <title>{pageTitle}</title>
      <Dropzone
        onEnter={() => {
          setDraggedOver(true);
        }}
        onLeave={() => {
          setDraggedOver(false);
        }}
        onDrop={(data) => {
          console.log(data);
          setDraggedOver(false);

          const id = extractScryfallInfo('mtg', data);
          console.log('found scryfall id', id);
        }}
      />

      {component}
      <ListDetailsHeader
        owner={owner}
        list={localListWithResources.list}
        title={title?.label ?? ''}
        onUpdate={(newList) => {
          if (localListWithResources.list.name !== newList.name) {
            navigate({
              to: '/@{$user}/lists/$listId',
              params: {
                listId: newList.name,
              },
              replace: true,
            });
          }

          setLocalListWithResources({
            ...localListWithResources,
            list: newList,
          });
        }}
        publicView={publicView}
      />

      <Stack gap={'0.5rem'}>
        {user?.id === owner.id && (
          <SelectionProgress sections={12} current={thisAndThatResources.length} max={list_resources_per_list} />
        )}

        <Group gap={'0.5rem'}>
          <TcgFilterPill
            tcg={'all'}
            size={thisAndThatResources.length}
            state={selectedTcgs.length === 0}
            onToggle={(state) => {
              if (state) {
                setSelectedTcgs([]);

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
                  });
                }}
              />
            );
          })}
        </Group>

        <Space h={'1.5rem'} />
      </Stack>

      <ListDetailsSettings owner={owner} list={list} />

      {resourcesLoading && (
        <Center>
          <Loader size={18} />
        </Center>
      )}

      {!resourcesLoading && (
        <>
          {sortedCardResources.length === 0 && sortedSearchResources.length === 0 && (
            <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
              {t('overview.card.noResources')}
            </GourmetText>
          )}
          {(sortedCardResources.length > 0 || sortedSearchResources.length > 0) && (
            <Stack gap={'2rem'}>
              {sortedSearchResources.length > 0 && (
                <ListDetailsQueryStack
                  owner={owner}
                  list={localListWithResources.list}
                  listWithResources={localListWithResources}
                  sortedSearchResources={sortedSearchResources}
                  setSearchResources={setSearchResources}
                />
              )}

              {sortedCardResources.length > 0 && (
                <ListDetailsCardGrid
                  owner={owner}
                  list={localListWithResources.list}
                  listWithResources={localListWithResources}
                  sortedCardResoures={sortedCardResources}
                  setCardResources={setCardResources}
                  suggestAddCard={isDraggedOver}
                  selectionIndexShift={sortedSearchResources.length}
                />
              )}

              {user && (
                <ListDetailsSelectionDisplay
                  list={localListWithResources}
                  onRemoveFromList={(res) => {
                    const toRemoveIds = new Set(res.map((r) => r.resourceId));

                    const newCardResources = cardResources.filter(
                      (resource) => !toRemoveIds.has(resource.listResource.resourceId),
                    );
                    const newSearchResources = searchResources.filter(
                      (resource) => !toRemoveIds.has(resource.listResource.resourceId),
                    );

                    setCardResources(newCardResources);
                    setSearchResources(newSearchResources);
                  }}
                />
              )}
            </Stack>
          )}
        </>
      )}
    </div>
  );
}
