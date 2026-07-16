import { Center, Group, Loader, Stack } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
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
import { ListDetailsSettings } from '@/parcels/lists/ListDetails/ListDetailsSettings/ListDetailsSettings.tsx';
import { SearchRenderer } from '@/parcels/lists/ListDetails/SearchRenderer.tsx';
import { ListDetailsSelectionDisplay } from '@/parcels/lists/ListDetailsSelectionDisplay/ListDetailsSelectionDisplay.tsx';
import type { ResolvedUserListResource, UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import type { DataUser } from '@/parcels/user/api.ts';
import { Route } from '@/routes/@{$user}/lists/$listId.tsx';

export function ListDetails({ owner, list, publicView }: { owner: DataUser; list: UserList; publicView: boolean }) {
  const { t } = useTranslation('lists');
  const search = Route.useSearch();
  const tcg = search.tcg;
  const { user } = useAuth();

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

  useEffect(() => {
    setSearchResources(localListWithResources?.resources?.user_search ?? []);
    setCardResources(localListWithResources?.resources?.card ?? []);
  }, [localListWithResources?.resources]);

  const { component, title } = useBreadcrumbs({
    subpage: `@${owner?.username}`,
    moreSubpages: [
      {
        label: t('details.header.breadcrumbs.lists'),
        href: `/@${owner?.username}/lists`,
      },
      {
        label: list.systemListType !== undefined ? t(`overview.card.system.${list.name}`) : list.name,
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
  const sortedCardResoures = useMemo(() => {
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

    return `${list.systemListType === 'favorites' ? t('overview.card.system.favorites') : list.name} – ${
      yourLists ? t('details.pageTitle') : t('details.pageTitleOther', { name: owner.username })
    } – Cardgourmet`;
  }, [list.name, list.systemListType, owner.username, t, user?.username]);

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
          {sortedCardResoures.length === 0 && sortedSearchResources.length === 0 && (
            <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
              {t('overview.card.noResources')}
            </GourmetText>
          )}
          {(sortedCardResoures.length > 0 || sortedSearchResources.length > 0) && (
            <Stack gap={'2rem'}>
              {sortedSearchResources.length > 0 && (
                <Stack>
                  <Group gap={'0.5rem'}>
                    <IconSearch size={22} color={list.color ?? 'var(--gourmet-neutral-9)'} />
                    <GourmetText cgmff={'title'} fz={'h3'} c={list.color ?? 'var(--gourmet-neutral-9)'}>
                      {t('details.savedSearches')}
                    </GourmetText>
                    <GourmetText cgmff={'ui'}>({sortedSearchResources.length})</GourmetText>
                  </Group>

                  <Stack gap={'0.5rem'}>
                    {sortedSearchResources.map((data) => {
                      return (
                        <SearchRenderer
                          key={data.listResource.resourceId}
                          list={localListWithResources}
                          data={data}
                          onRemoveFromList={(listId) => {
                            if (listId !== list.id) return;

                            const newSearchResources = [...searchResources];
                            for (let i = 0; i < newSearchResources.length; i++) {
                              if (newSearchResources[i].listResource.resourceId === data.listResource.resourceId) {
                                newSearchResources.splice(i, 1);
                                break;
                              }
                            }

                            setSearchResources(newSearchResources);
                          }}
                        />
                      );
                    })}
                  </Stack>
                </Stack>
              )}

              {sortedCardResoures.length > 0 && (
                <ListDetailsCardGrid
                  owner={owner}
                  list={list}
                  sortedCardResoures={sortedCardResoures}
                  cardResources={cardResources}
                  setCardResources={setCardResources}
                  listWithResources={localListWithResources}
                  suggestAddCard={isDraggedOver}
                  onAddToList={(res) => {
                    addResources([res]);
                  }}
                  onRemoveFromList={(resourceId, listId) => {
                    removeResources([resourceId], [listId]);
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
