import {Divider, Group, SimpleGrid, Stack} from '@mantine/core';
import {IconCards, IconLabelFilled, IconSearch, IconStar} from '@tabler/icons-react';
import {useNavigate} from '@tanstack/react-router';
import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {TextDropdown} from '@/parcels/generic/TextDropdown/TextDropdown.tsx';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {CardRenderer} from '@/parcels/lists/ListDetails/CardRenderer.tsx';
import {SearchRenderer} from '@/parcels/lists/ListDetails/SearchRenderer.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {formatRelativeTimestamp} from '@/parcels/lists/ListsOverview/formatRelativeTimestamp.ts';
import {DeleteListButton} from '@/parcels/lists/ListsOverview/ListRenderer/DeleteListButton/DeleteListButton.tsx';
import {EditListButton} from '@/parcels/lists/ListsOverview/ListRenderer/EditListButton/EditListButton.tsx';
import {VisibilityBadge} from '@/parcels/lists/ListsOverview/ListRenderer/ListElementHeader/ListElementHeader.tsx';
import type {ResolvedUserListResource, UserList, UserListWithResources} from '@/parcels/lists/types.ts';
import {useTcg} from '@/parcels/tcg/TcgProvider.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import {paramDefaults} from '@/routes/me/lists';
import {Route} from '@/routes/me/lists/$listId.tsx';

export function ListDetails() {
  const { t, i18n } = useTranslation('lists');
  const search = Route.useSearch();
  const { list: listRes, listResources: listResourcesRes } = Route.useLoaderData();

  const [list, setList] = useState<UserList>(listRes.data as UserList);

  const [searchResources, setSearchResources] = useState<ResolvedUserListResource[]>(
    listResourcesRes?.data?.user_search ?? [],
  );
  const [cardResources, setCardResources] = useState<ResolvedUserListResource[]>(listResourcesRes?.data?.card ?? []);

  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: `@${user?.username}`,
    moreSubpages: [
      {
        label: 'Lists',
      },
      {
        label: list.systemListType !== undefined ? t(`system.${list.name}`) : list.name,
      },
    ],
  });

  const { tcg } = useTcg();
  const { lists: localUserLists, setLists } = useUserLists();
  const navigate = useNavigate();

  return (
    <div>
      {listRes.error !== undefined && <GourmetText>{listRes.error.key}</GourmetText>}

      {component}
      <Stack
        gap={'0'}
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 'var(--sticky-layer)',
          backgroundColor: 'var(--gourmet-neutral-0)',
        }}
        mb={'1rem'}
      >
        <Group justify={'space-between'} p={'0.5rem 0'} align={'stretch'}>
          <Stack gap={'0.25rem'}>
            <Group gap={'0.75rem'}>
              <Group gap={'0.25rem'}>
                {list.systemListType === 'favorites' && <IconStar size={24} />}
                <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
                  {title?.label}
                </GourmetText>
              </Group>
              <VisibilityBadge visibility={list?.visibility} />
              <IconLabelFilled color={list.color ?? 'var(--gourmet-neutral-9)'} />
            </Group>
            {list.description.length > 0 && (
              <GourmetText cgmff={'ui'} cgmc={'neutral-7'} fz={'0.95rem'}>
                {list.description}
              </GourmetText>
            )}
            {list.systemListType === 'favorites' && (
              <GourmetText cgmff={'ui'} cgmc={'neutral-7'} fz={'0.95rem'}>
                {t('system.favorites-desc')}
              </GourmetText>
            )}
            {list.systemListType !== 'favorites' && list.description.length === 0 && (
              <GourmetText cgmff={'ui'} cgmc={'neutral-5'} fz={'0.95rem'}>
                {t('noDescription')}
              </GourmetText>
            )}
          </Stack>

          <Stack justify={'end'}>
            <Group gap={'1rem'}>
              <GourmetText cgmff={'ui'} cgmc={'neutral-7'} fz={'0.95rem'}>
                {t('last-updated')}{' '}
                <span title={new Date(list.updatedAt).toLocaleString()}>
                  {formatRelativeTimestamp(list.updatedAt, i18n.language)}
                </span>
              </GourmetText>

              <Group gap={'0.25rem'}>
                <EditListButton
                  list={list}
                  onSuccess={(list) => {
                    const newLists: UserListWithResources[] = [];
                    localUserLists.forEach((l) => {
                      if (l.list.id === list.id) {
                        newLists.push({ list: list, resources: l.resources, size: l.size });
                      } else {
                        newLists.push(l);
                      }
                    });
                    setLists(newLists);

                    setList(list);
                  }}
                />
                <DeleteListButton
                  list={list}
                  onSuccess={(id) => {
                    const list = localUserLists.find((l) => l.list.id === id);
                    if (!list) return;

                    const newLists = [...localUserLists.filter((l) => l.list.id !== id)];
                    setLists(newLists);

                    // noinspection JSIgnoredPromiseFromCall
                    navigate({
                      to: '/me/lists',
                      search: {
                        ...paramDefaults,
                        tcg: tcg,
                      },
                    });
                  }}
                />
              </Group>
            </Group>
          </Stack>
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <Stack mb={'1.5rem'}>
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
            defaultSelected={search.tcg ?? 'mtg'}
            onSelect={(sel) => {
              // noinspection JSIgnoredPromiseFromCall
              navigate({
                from: '/me/lists/$listId',
                params: {
                  listId: list.slug,
                },
                search: (prev) => ({ ...prev, tcg: sel as Tcg }),
                replace: true,
              });
            }}
            miw={'14rem'}
          />
        </Group>
      </Stack>

      {cardResources.length === 0 && searchResources.length === 0 && (
        <GourmetText cgmff={'ui'} cgmc={'neutral-5'}>
          {t('noResources')}
        </GourmetText>
      )}
      {(cardResources.length > 0 || searchResources.length > 0) && (
        <Stack gap={'2rem'}>
          {searchResources.length > 0 && (
            <Stack>
              <Group gap={'0.5rem'}>
                <IconSearch size={22} color={list.color ?? 'var(--gourmet-neutral-9)'} />
                <GourmetText cgmff={'title'} fz={'h3'} c={list.color ?? 'var(--gourmet-neutral-9)'}>
                  {t('details.savedSearches')}
                </GourmetText>
                <GourmetText cgmff={'ui'}>({searchResources.length})</GourmetText>
              </Group>

              <Stack gap={'0.5rem'}>
                {searchResources
                  .sort((a, b) => {
                    const dateA = a.listResource.updatedAt ? new Date(a.listResource.updatedAt).getTime() : 0;
                    const dateB = b.listResource.updatedAt ? new Date(b.listResource.updatedAt).getTime() : 0;
                    return (dateA - dateB) * -1;
                  })
                  .map((data) => {
                    return (
                      <SearchRenderer
                        key={data.listResource.resourceId}
                        data={data}
                        tcg={search.tcg ?? tcg}
                        onRemoveFromList={(listId) => {
                          console.log('removed from list', listId);
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

          {cardResources.length > 0 && (
            <Stack>
              <Group gap={'0.5rem'}>
                <IconCards size={22} color={list.color ?? 'var(--gourmet-neutral-9)'} />
                <GourmetText cgmff={'title'} c={list.color ?? 'var(--gourmet-neutral-9)'} fz={'h3'}>
                  {t('details.cards')}
                </GourmetText>
                <GourmetText cgmff={'ui'}>({cardResources.length})</GourmetText>
              </Group>

              <SimpleGrid cols={6}>
                {cardResources
                  .sort((a, b) => {
                    const dateA = a.listResource.updatedAt ? new Date(a.listResource.updatedAt).getTime() : 0;
                    const dateB = b.listResource.updatedAt ? new Date(b.listResource.updatedAt).getTime() : 0;
                    return (dateA - dateB) * -1;
                  })
                  .map((data) => {
                    return (
                      <CardRenderer
                        key={data.listResource.resourceId}
                        tcg={search.tcg ?? tcg}
                        data={data}
                        onRemoveFromList={(listId) => {
                          if (listId !== list.id) return;

                          const newCardResources = [...cardResources];
                          for (let i = 0; i < newCardResources.length; i++) {
                            if (newCardResources[i].listResource.resourceId === data.listResource.resourceId) {
                              newCardResources.splice(i, 1);
                              break;
                            }
                          }

                          setCardResources(newCardResources);
                        }}
                      />
                    );
                  })}
              </SimpleGrid>
            </Stack>
          )}
        </Stack>
      )}
    </div>
  );
}
