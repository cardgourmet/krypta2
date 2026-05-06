import {useDisclosure} from '@mantine/hooks';
import {IconList, IconStar} from '@tabler/icons-react';
import {type Ref, useMemo} from 'react';
import {useTranslation} from 'react-i18next';
import {ListAddMenuItem} from '@/parcels/lists/ListActionItems/ListAddMenuItem/ListAddMenuItem.tsx';
import {ListMenuItem} from '@/parcels/lists/ListActionItems/ListMenuItem/ListMenuItem.tsx';
import {ListRemoveMenuItem} from '@/parcels/lists/ListActionItems/ListRemoveMenuItem/ListRemoveMenuItem.tsx';
import {useUserLists} from '@/parcels/lists/ListsContextProvider.tsx';
import {CreateListModal} from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type {UserListWithResources} from '@/parcels/lists/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

type ListActionItemsProps = {
  tcg: Tcg;
  resourceId?: string;
  rawResourceId: string;
  onSearchSaved?: (id: string) => void;
  onRemoveFromList?: (listId: string) => void;
  type: 'card' | 'user_search';
  listContext?: UserListWithResources;
} & { ref?: Ref<HTMLDivElement> };

export function useListActionItems({
  tcg,
  resourceId,
  rawResourceId,
  onSearchSaved,
  onRemoveFromList,
  type,
  ref,
  listContext,
}: ListActionItemsProps) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const { lists, refetchLists } = useUserLists();
  const { systemLists, existsInLists } = useMemo(() => {
    const systemLists = lists.filter((l) => l.list.systemListType !== undefined);
    const existsInLists = lists
      .filter((list) => {
        return list.resources?.[type]?.find((res) => res.listResource.resourceId === resourceId);
      })
      .map((l) => l.list.id);

    return { systemLists, existsInLists };
  }, [lists, resourceId, type]);
  const disclosure = useDisclosure(false);

  const modal = useMemo(() => {
    return <CreateListModal disclosure={disclosure} onSuccess={() => refetchLists()} />;
  }, [disclosure, refetchLists]);

  const entries = useMemo(() => {
    return (
      <>
        {systemLists.map((list) => {
          const inList = existsInLists.includes(list.list.id);

          return (
            <ListMenuItem
              key={list.list.id}
              ressourceId={resourceId ?? rawResourceId}
              raw={resourceId === undefined}
              listWithResources={list}
              action={inList ? 'remove' : 'add'}
              type={type === 'card' ? 'card' : 'search'}
              tcg={tcg}
              onSuccess={(res) => {
                if (!res) return;

                const action = existsInLists.includes(list.list.id) ? 'remove' : 'add';
                if (action === 'add') {
                  if (onSearchSaved) onSearchSaved(res.resourceId);
                } else if (action === 'remove') {
                  if (onRemoveFromList) onRemoveFromList(list.list.id);
                }
              }}
              icon={<IconStar size={18} />}
              buttonText={listContext !== undefined ? t('favorite-copy') : t(`favorite${inList ? '-remove' : ''}`)}
            />
          );
        })}

        <ListAddMenuItem
          ref={ref}
          ressourceId={resourceId ?? rawResourceId}
          raw={resourceId === undefined}
          disclosure={disclosure}
          type={type === 'card' ? 'card' : 'search'}
          tcg={tcg}
          buttonText={listContext !== undefined ? 'Copy to list ...' : t('add-to-list')}
          onSuccess={(res) => {
            if (res) {
              if (onSearchSaved) onSearchSaved(res.resourceId);
            }
          }}
        />

        {listContext !== undefined && (
          <ListMenuItem
            key={listContext.list.id}
            ressourceId={resourceId ?? rawResourceId}
            raw={resourceId === undefined}
            listWithResources={listContext}
            action={'remove'}
            type={type === 'card' ? 'card' : 'search'}
            tcg={tcg}
            onSuccess={(res) => {
              if (!res) return;

              if (onRemoveFromList) onRemoveFromList(listContext.list.id);
            }}
            icon={<IconList size={18} />}
            buttonText={'Remove from list'}
          />
        )}
        {listContext === undefined && (
          <ListRemoveMenuItem
            ref={ref}
            ressourceId={resourceId ?? rawResourceId}
            raw={resourceId === undefined}
            type={type === 'card' ? 'card' : 'search'}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onRemoveFromList) onRemoveFromList(res.listId);
              }
            }}
          />
        )}
      </>
    );
  }, [
    disclosure,
    existsInLists.includes,
    onRemoveFromList,
    onSearchSaved,
    rawResourceId,
    ref,
    resourceId,
    systemLists.map,
    tcg,
    type,
    t,
    listContext,
  ]);

  return {
    modal,
    entries,
  };
}
