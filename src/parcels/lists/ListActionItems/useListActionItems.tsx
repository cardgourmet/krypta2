import { useDisclosure } from '@mantine/hooks';
import { IconList, IconStar } from '@tabler/icons-react';
import { type Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTEXT_LIST_MAIN, useActiveListsResource } from '@/parcels/lists/ActiveListsState.tsx';
import { ListAddMenuItem } from '@/parcels/lists/ListActionItems/ListAddMenuItem/ListAddMenuItem.tsx';
import { ListMenuItem } from '@/parcels/lists/ListActionItems/ListMenuItem/ListMenuItem.tsx';
import { ListRemoveMenuItem } from '@/parcels/lists/ListActionItems/ListRemoveMenuItem/ListRemoveMenuItem.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { CreateListModal } from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type ListActionItemsProps = {
  tcg: Tcg;
  resourceId?: string;
  rawResourceId: string;
  onAddedToList?: (res: UserListResource) => void;
  onRemovedFromList?: (listId: string) => void;
  type: 'card' | 'user_search';
  listContext?: UserListWithResources;
  activeListContext?: string;
} & { ref?: Ref<HTMLDivElement> };

export function useListActionItems({
  tcg,
  resourceId,
  rawResourceId,
  onAddedToList,
  onRemovedFromList,
  type,
  ref,
  listContext,
  activeListContext,
}: ListActionItemsProps) {
  const { t } = useTranslation('lists', { keyPrefix: 'actionmenu' });
  const { lists, refetchLists } = useUserLists();

  const { existsInLists } = useActiveListsResource(activeListContext ?? CONTEXT_LIST_MAIN, resourceId);
  const existsInListsIds = useMemo(() => {
    return existsInLists.map((l) => l.list.id);
  }, [existsInLists]);

  const systemLists = useMemo(() => {
    return lists.filter((l) => l.list.systemListType !== undefined);
  }, [lists]);
  const disclosure = useDisclosure(false);

  const modal = useMemo(() => {
    return <CreateListModal disclosure={disclosure} onSuccess={() => refetchLists()} />;
  }, [disclosure, refetchLists]);

  const entries = useMemo(() => {
    return (
      <>
        {systemLists.map((list) => {
          const inList = existsInListsIds.includes(list.list.id);

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

                const action = existsInListsIds.includes(list.list.id) ? 'remove' : 'add';
                if (action === 'add') {
                  if (onAddedToList) onAddedToList(res);
                } else if (action === 'remove') {
                  if (onRemovedFromList) onRemovedFromList(list.list.id);
                }
              }}
              icon={<IconStar size={18} />}
              buttonText={listContext !== undefined ? t('favoriteCopy') : t(`favorite${inList ? 'Remove' : ''}`)}
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
          buttonText={listContext !== undefined ? 'Copy to list ...' : t('addToList')}
          onSuccess={(res) => {
            if (res) {
              if (onAddedToList) onAddedToList(res);
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

              if (onRemovedFromList) onRemovedFromList(listContext.list.id);
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
                if (onRemovedFromList) onRemovedFromList(res.listId);
              }
            }}
          />
        )}
      </>
    );
  }, [
    disclosure,
    existsInListsIds,
    onRemovedFromList,
    onAddedToList,
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
