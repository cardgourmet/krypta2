import { Group, Stack } from '@mantine/core';
import { IconSearch } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { type DroppedData, Dropzone } from '@/parcels/generic/Dropzone.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useBreadcrumbs } from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import { ListDetailsCardGrid } from '@/parcels/lists/ListDetails/ListDetailsCardGrid/ListDetailsCardGrid.tsx';
import { ListDetailsHeader } from '@/parcels/lists/ListDetails/ListDetailsHeader/ListDetailsHeader.tsx';
import { ListDetailsSettings } from '@/parcels/lists/ListDetails/ListDetailsSettings/ListDetailsSettings.tsx';
import { SearchRenderer } from '@/parcels/lists/ListDetails/SearchRenderer.tsx';
import type { ResolvedUserListResource, UserList, UserListWithResources } from '@/parcels/lists/types.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import { Route } from '@/routes/me/lists/$listId.tsx';

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

  const [isDraggedOver, setDraggedOver] = useState<boolean>(false);

  return (
    <div style={{ position: 'relative' }}>
      <title>{`${list.systemListType === 'favorites' ? t('overview.card.system.favorites') : list.name} – ${t('details.pageTitle')} – Cardgourmet`}</title>
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
              suggestAddCard={isDraggedOver}
            />
          )}
        </Stack>
      )}
    </div>
  );
}

function extractScryfallInfo(tcg: Tcg, data: DroppedData): string | undefined {
  if (tcg !== 'mtg') return undefined;

  const id = extractIdJustLikeMoxfieldDoes(data.html, data.uriList);
  return id ?? undefined;
}

// Previously we had a custom extracting function, but as soon as we saw how Moxfield does it
// we knew: We had to do it that way as well. The variable names are kept original.
const extractIdJustLikeMoxfieldDoes = (t: string, o: string) => {
  let n = null;

  const r = new RegExp(/src="(.*?)"/gi).exec(t);

  n = null == r ? void 0 : r[1];
  const l = n !== null ? n : o;
  if (l === null || l === undefined) return null;
  if (l.length <= 0) return null;

  const s = new RegExp(/\/([^/]*?)\.(jpg|png)\?/gi).exec(l);
  const c = s === null ? undefined : s[1];
  /*const d = new RegExp(/https:\/\/scryfall.com\/card\/(.+)\/(.+)\/.*!/gi).exec(l);
  const u = d === null ? undefined : d[1];
  const m = d === null ? undefined : d[2];*/

  return c;
};
