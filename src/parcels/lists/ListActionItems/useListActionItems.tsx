import { useDisclosure } from '@mantine/hooks';
import { IconList, IconStar } from '@tabler/icons-react';
import { type Ref, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTEXT_LIST_MAIN, useActiveLists, useActiveListsResource } from '@/parcels/lists/ActiveListsState.tsx';
import type { ListApiResource, PossibleResource } from '@/parcels/lists/api.ts';
import { ListMultipleMenu } from '@/parcels/lists/ListActionItems/ListMultipleMenu/ListMultipleMenu.tsx';
import { ListSingleMenuItem } from '@/parcels/lists/ListActionItems/ListSingleMenuItem/ListSingleMenuItem.tsx';
import { MenuItemWithListIcon } from '@/parcels/lists/ListActionItems/MenuItemWithListIcon.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { CreateListModal } from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type ListActionItemsProps = {
  tcg: Tcg;
  resourceId?: string;
  rawResourceId: string;
  resource?: PossibleResource;
  onAddedToList?: (res: UserListResource) => void;
  onRemovedFromList?: (listId: string, resourceId?: string) => void;
  type: 'card' | 'user_search';
  listContext?: UserListWithResources;
  activeListContext?: string;
} & { ref?: Ref<HTMLDivElement> };

export function useListActionItems({
  tcg,
  resource,
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
  const { refetchLists } = useUserLists();

  const { activeLists } = useActiveLists(activeListContext ?? CONTEXT_LIST_MAIN);
  const { existsInLists } = useActiveListsResource(activeListContext ?? CONTEXT_LIST_MAIN, resourceId);
  const existsInListsIds = useMemo(() => {
    return existsInLists.map((l) => l.list.id);
  }, [existsInLists]);

  const systemLists = useMemo(() => {
    if (listContext !== undefined) return [];
    return activeLists.filter((l) => l.list.systemListType !== undefined);
  }, [activeLists, listContext?.list.id, listContext]);
  const disclosure = useDisclosure(false);

  const modal = useMemo(() => {
    return <CreateListModal disclosure={disclosure} onSuccess={() => refetchLists()} />;
  }, [disclosure, refetchLists]);
  const actionableResources = useMemo(() => {
    return [
      {
        id: resourceId ?? rawResourceId,
        isRaw: resourceId === undefined,
        resourceType: type,
        game: tcg,
        resolved: resource,
      } as ListApiResource,
    ];
  }, [rawResourceId, resourceId, tcg, type, resource]);

  const entries = useMemo(() => {
    return (
      <>
        {systemLists.map((list) => {
          const inList = existsInListsIds.includes(list.list.id);

          return (
            <ListSingleMenuItem
              key={list.list.id}
              listWithResources={list}
              actionableResources={actionableResources}
              action={inList ? 'remove' : 'add'}
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

        <ListMultipleMenu
          dropdownProps={{
            ref: ref,
          }}
          actionableResources={actionableResources}
          activeListContext={activeListContext}
          action={'add'}
          target={({ toggle }) => (
            <MenuItemWithListIcon
              buttonText={listContext !== undefined ? t('copyToList') : t('addToList')}
              action={'add'}
              onClick={toggle}
            />
          )}
          onSuccess={(res) => {
            if (res?.[0]) {
              if (onAddedToList) onAddedToList(res[0]);
            }
          }}
        />

        {listContext !== undefined && (
          <ListSingleMenuItem
            key={listContext.list.id}
            listWithResources={listContext}
            actionableResources={actionableResources}
            action={'remove'}
            onSuccess={(res) => {
              if (!res) return;

              if (onRemovedFromList) onRemovedFromList(listContext.list.id, resourceId);
            }}
            icon={<IconList size={18} />}
            buttonText={t('removeFromThisList')}
          />
        )}
        {listContext === undefined && (
          <ListMultipleMenu
            dropdownProps={{
              ref: ref,
            }}
            actionableResources={actionableResources}
            action={'remove'}
            target={({ toggle }) => (
              <MenuItemWithListIcon buttonText={t('removeFromList')} action={'remove'} onClick={toggle} />
            )}
            onSuccess={(res) => {
              if (res?.[0]) {
                if (onRemovedFromList) onRemovedFromList(res[0].listId, res[0].resourceId);
              }
            }}
          />
        )}
      </>
    );
  }, [
    existsInListsIds,
    resourceId,
    systemLists,
    t,
    listContext,
    activeListContext,
    ref,
    actionableResources,
    onAddedToList,
    onRemovedFromList,
  ]);

  return {
    modal,
    entries,
  };
}
