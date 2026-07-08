import { useDisclosure } from '@mantine/hooks';
import { IconList, IconStar } from '@tabler/icons-react';
import { type Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTEXT_LIST_MAIN, useActiveListsResource } from '@/parcels/lists/ActiveListsState.tsx';
import { ListAddMenu } from '@/parcels/lists/ListActionItems/ListAddMenuItem/ListAddMenu.tsx';
import { ListMenuItem } from '@/parcels/lists/ListActionItems/ListMenuItem/ListMenuItem.tsx';
import { ListRemoveMenu } from '@/parcels/lists/ListActionItems/ListRemoveMenuItem/ListRemoveMenu.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { CreateListModal } from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type ListActionItemsProps = {
  tcg: Tcg;
  resourceId?: string;
  rawResourceId: string;
  onAddedToList?: (res: UserListResource) => void;
  onRemovedFromList?: (listId: string, resourceId?: string) => void;
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
    if (listContext !== undefined) return [];
    return lists.filter((l) => l.list.systemListType !== undefined);
  }, [lists, listContext?.list.id, listContext]);
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
              resourceIds={[resourceId ?? rawResourceId]}
              raw={resourceId === undefined}
              listWithResources={list}
              action={inList ? 'remove' : 'add'}
              type={type}
              tcg={tcg}
              onSuccess={(res) => {
                if (!res) return;

                const action = existsInListsIds.includes(list.list.id) ? 'remove' : 'add';
                if (action === 'add') {
                  if (onAddedToList) onAddedToList(res[0]);
                } else if (action === 'remove') {
                  if (onRemovedFromList) onRemovedFromList(list.list.id, resourceId);
                }
              }}
              icon={<IconStar size={18} />}
              buttonText={t(`favorite${inList ? 'Remove' : ''}`)}
            />
          );
        })}

        <ListAddMenu
          ref={ref}
          resourceId={resourceId ?? rawResourceId}
          raw={resourceId === undefined}
          disclosure={disclosure}
          type={type}
          tcg={tcg}
          buttonText={listContext !== undefined ? 'Copy to list ...' : t('addToList')}
          onSuccess={(res) => {
            if (res) {
              if (onAddedToList) onAddedToList(res);
            }
          }}
          existsInLists={existsInLists}
        />

        {listContext !== undefined && (
          <ListMenuItem
            key={listContext.list.id}
            resourceIds={[resourceId ?? rawResourceId]}
            raw={resourceId === undefined}
            listWithResources={listContext}
            action={'remove'}
            type={type}
            tcg={tcg}
            onSuccess={(res) => {
              if (!res) return;

              if (onRemovedFromList) onRemovedFromList(listContext.list.id, resourceId);
            }}
            icon={<IconList size={18} />}
            buttonText={'Remove from list'}
          />
        )}
        {listContext === undefined && (
          <ListRemoveMenu
            ref={ref}
            resourceId={resourceId ?? rawResourceId}
            raw={resourceId === undefined}
            type={type}
            tcg={tcg}
            onSuccess={(res) => {
              if (res) {
                if (onRemovedFromList) onRemovedFromList(res.listId, res.resourceId);
              }
            }}
            existsInLists={existsInLists}
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
    systemLists,
    tcg,
    type,
    t,
    listContext,
    existsInLists,
  ]);

  return {
    modal,
    entries,
  };
}
