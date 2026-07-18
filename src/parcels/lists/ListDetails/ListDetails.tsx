import { Center, Loader, Stack } from '@mantine/core';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { Dropzone } from '@/parcels/generic/Dropzone.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { getAllResourcesFromList } from '@/parcels/lists/api.ts';
import { extractScryfallInfo } from '@/parcels/lists/ListDetails/extractScryfallInfo.ts';
import { ListDetailsCardGrid } from '@/parcels/lists/ListDetails/ListDetailsCardGrid/ListDetailsCardGrid.tsx';
import { ListDetailsHeader } from '@/parcels/lists/ListDetails/ListDetailsHeader/ListDetailsHeader.tsx';
import { ListDetailsQueryStack } from '@/parcels/lists/ListDetails/ListDetailsQueryStack/ListDetailsQueryStack.tsx';
import { ListDetailsSettings } from '@/parcels/lists/ListDetails/ListDetailsSettings/ListDetailsSettings.tsx';
import type { ResolvedUserListResource, UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { CardRemoveNotification } from '@/parcels/notification/CardRemoveNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import { ListDetailsSelectionDisplay } from '@/parcels/selection/ListDetailsSelectionDisplay/ListDetailsSelectionDisplay.tsx';
import { useListDetailsWorkStore } from '@/parcels/selection/useListDetailsWorkStore.tsx';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import type { DataUser } from '@/parcels/user/api.ts';
import { Route } from '@/routes/@{$user}/lists/$listId.tsx';

export function ListDetails({ owner, list, publicView }: { owner: DataUser; list: UserList; publicView: boolean }) {
  const { t } = useTranslation('lists');
  const search = Route.useSearch();
  const tcg = search.tcg;
  const { user } = useAuth();

  const navigate = Route.useNavigate();

  const [resourcesLoading, setResourcesLoading] = useState<boolean>(false);
  const [localListWithResources, setLocalListWithResources] = useState<UserListWithResources>({
    list: list,
  });

  const listResources = useMemo(() => {
    return Object.values(localListWithResources.resources ?? {}).flatMap((v) => {
      return v.flatMap((e) => [...(e.otherListResources ?? []), e.listResource]);
    });
  }, [localListWithResources.resources]);
  const { removeResources, addResources } = useActiveLists(undefined, listResources);

  useEffect(() => {
    setResourcesLoading(true);
    startTransition(async () => {
      const res = await getAllResourcesFromList(list.userId, list.id, tcg);

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
  }, [list, tcg]);

  const [searchResources, setSearchResources] = useState<ResolvedUserListResource[]>(
    localListWithResources?.resources?.user_search ?? [],
  );
  const [cardResources, setCardResources] = useState<ResolvedUserListResource[]>(
    localListWithResources?.resources?.card ?? [],
  );

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

  const sortedSearchResources = useMemo(() => {
    return [...searchResources].sort((a, b) => {
      if (search.sort === 'addedAt') {
        const dateA = a.listResource.updatedAt ? new Date(a.listResource.updatedAt).getTime() : 0;
        const dateB = b.listResource.updatedAt ? new Date(b.listResource.updatedAt).getTime() : 0;
        return (dateA - dateB) * (search.order === 'asc' ? 1 : -1);
      }
      if (search.sort === 'name') {
        const queryA = (a.listResource.resourceMeta?.query ?? '') as string;
        const queryB = (b.listResource.resourceMeta?.query ?? '') as string;

        return queryA.localeCompare(queryB) * (search.order === 'desc' ? -1 : 1);
      }

      return 0;
    });
  }, [search.order, search.sort, searchResources]);
  const sortedCardResources = useMemo(() => {
    return [...cardResources].sort((a, b) => {
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
  }, [cardResources, search.order, search.sort]);

  const [isDraggedOver, setDraggedOver] = useState<boolean>(false);
  const pageTitle = useMemo(() => {
    const yourLists = owner.username === user?.username;

    return `${list.systemListType === 'favorites' ? t('overview.card.system.favorites') : localListWithResources.list.name} – ${
      yourLists ? t('details.pageTitle') : t('details.pageTitleOther', { name: owner.username })
    } – Cardgourmet`;
  }, [localListWithResources.list.name, list.systemListType, owner.username, t, user?.username]);

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

          const id = extractScryfallInfo(tcg, data);
          console.log('found scryfall id', id);
        }}
      />

      {component}
      <ListDetailsHeader
        owner={owner}
        tcg={tcg}
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
                  sortedCardResoures={sortedCardResources}
                  cardResources={cardResources}
                  setCardResources={setCardResources}
                  listWithResources={localListWithResources}
                  suggestAddCard={isDraggedOver}
                  onAddToList={(res) => {
                    addResources([res]);
                  }}
                  onRemoveFromList={(res, data) => {
                    removeResources([res.resourceId], [res.listId]);

                    sendNotification(
                      'error',
                      <CardRemoveNotification
                        tcg={res.game as Tcg}
                        list={localListWithResources.list}
                        card={data as unknown as TcgDataCard}
                        language={'en'}
                      />,
                    );
                  }}
                />
              )}

              {user && <ListDetailsSelectionDisplay list={list} />}
            </Stack>
          )}
        </>
      )}
    </div>
  );
}
