import { Center, Loader, Stack } from '@mantine/core';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { Dropzone } from '@/parcels/generic/Dropzone.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { CONTEXT_LIST_MAIN, useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { getAllResourcesFromList } from '@/parcels/lists/api.ts';
import { extractScryfallInfo } from '@/parcels/lists/ListDetails/extractScryfallInfo.ts';
import { ListDetailsCardGrid } from '@/parcels/lists/ListDetails/ListDetailsCardGrid/ListDetailsCardGrid.tsx';
import { ListDetailsHeader } from '@/parcels/lists/ListDetails/ListDetailsHeader/ListDetailsHeader.tsx';
import { ListDetailsQueryStack } from '@/parcels/lists/ListDetails/ListDetailsQueryStack/ListDetailsQueryStack.tsx';
import { ListDetailsSettings } from '@/parcels/lists/ListDetails/ListDetailsSettings/ListDetailsSettings.tsx';
import type { ResolvedUserListResource, UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { useUserLimits } from '@/parcels/lists/useInList.tsx';
import { ListLoader } from '@/parcels/lists/useListLoader.tsx';
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
  const { list_resources_per_list } = useUserLimits(user);

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

  const selectedTcgs = search.tcgs;
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
  const sortedAllResources = useMemo(() => {
    return [...sortedSearchResources, ...sortedCardResources];
  }, [sortedCardResources, sortedSearchResources]);

  const setData = useListDetailsWorkStore((state) => state.setData);
  const clearSelection = useListDetailsWorkStore((state) => state.clearSelection);
  useEffect(() => {
    const search = localListWithResources?.resources?.user_search ?? [];
    const card = localListWithResources?.resources?.card ?? [];

    setSearchResources(search);
    setCardResources(card);
  }, [localListWithResources?.resources?.card, localListWithResources?.resources?.user_search]);
  useEffect(() => {
    clearSelection();
    setData({
      page: 1,
      rawElements: sortedAllResources.map((r) => ({ id: r.listResource.resourceId, element: r })),
      other: {
        forceReset: true,
      },
    });
  }, [sortedAllResources, setData, clearSelection]);

  const loading = resourcesLoading || ((localListWithResources.size ?? 0) > 0 && allResources.length === 0);

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
        list={localListWithResources}
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

      {user?.id === owner.id && (
        <Stack mb={'0.5rem'} gap={'0.25rem'}>
          <SelectionProgress sections={12} current={allResources.length} max={list_resources_per_list} />
        </Stack>
      )}
      <ListDetailsSettings owner={owner} list={list} allResources={allResources} />

      {loading && (
        <Center>
          <Loader size={18} />
        </Center>
      )}

      {!loading && (
        <Stack pos={'relative'}>
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

          <ListLoader />
        </Stack>
      )}
    </div>
  );
}
