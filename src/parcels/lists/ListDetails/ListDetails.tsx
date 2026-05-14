import {Group, Stack} from '@mantine/core';
import {IconSearch} from '@tabler/icons-react';
import {useEffect, useMemo, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {ListDetailsCardGrid} from '@/parcels/lists/ListDetails/ListDetailsCardGrid/ListDetailsCardGrid.tsx';
import {ListDetailsHeader} from '@/parcels/lists/ListDetails/ListDetailsHeader/ListDetailsHeader.tsx';
import {ListDetailsSettings} from '@/parcels/lists/ListDetails/ListDetailsSettings/ListDetailsSettings.tsx';
import {SearchRenderer} from '@/parcels/lists/ListDetails/SearchRenderer.tsx';
import type {ResolvedUserListResource, UserList, UserListWithResources} from '@/parcels/lists/types.ts';
import {useTcg} from '@/parcels/tcg/TcgProvider.tsx';
import {Route} from '@/routes/me/lists/$listId.tsx';

export function ListDetails() {
  const { t } = useTranslation('lists');
  const search = Route.useSearch();
  const { list: listRes, listResources: listResourcesRes } = Route.useLoaderData();

  const [list, setList] = useState<UserList>(listRes.data as UserList);
  const listWithResources = useMemo(() => {
    return {
      list: list,
      resources: listResourcesRes.data,
      size: (listResourcesRes?.data?.card?.length ?? 0) + (listResourcesRes?.data?.user_search?.length ?? 0),
    } as UserListWithResources;
  }, [list, listResourcesRes.data]);
  const [searchResources, setSearchResources] = useState<ResolvedUserListResource[]>(
    listResourcesRes?.data?.user_search ?? [],
  );
  const [cardResources, setCardResources] = useState<ResolvedUserListResource[]>(listResourcesRes?.data?.card ?? []);

  useEffect(() => {
    setList(listRes.data as UserList);
  }, [listRes.data]);
  useEffect(() => {
    setSearchResources(listResourcesRes?.data?.user_search ?? []);
    setCardResources(listResourcesRes?.data?.card ?? []);
  }, [listResourcesRes?.data]);

  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: t('details.header.breadcrumbs.lists'),
        href: '/me/lists',
      },
      {
        label: list.systemListType !== undefined ? t(`overview.card.system.${list.name}`) : list.name,
      },
    ],
  });

  const { tcg } = useTcg();
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

  return (
    <div>
      <title>{`${list.systemListType === 'favorites' ? t('overview.card.system.favorites') : list.name} – ${t('details.pageTitle')} – Cardgourmet`}</title>

      {listRes.error !== undefined && <GourmetText>{listRes.error.key}</GourmetText>}

      {component}
      <ListDetailsHeader tcg={tcg} list={list} title={title?.label ?? ''} setList={setList} />

      <ListDetailsSettings list={list} />

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
                      list={listWithResources}
                      data={data}
                      tcg={search.tcg ?? tcg}
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
              list={list}
              sortedCardResoures={sortedCardResoures}
              cardResources={cardResources}
              setCardResources={setCardResources}
              listWithResources={listWithResources}
            />
          )}
        </Stack>
      )}
    </div>
  );
}
