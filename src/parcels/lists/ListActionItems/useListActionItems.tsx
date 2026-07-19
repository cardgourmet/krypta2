import { useDisclosure } from '@mantine/hooks';
import { IconList, IconStar } from '@tabler/icons-react';
import { type Ref, useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { CONTEXT_LIST_MAIN, useActiveLists, useActiveListsResource } from '@/parcels/lists/ActiveListsState.tsx';
import { ListAddMenu } from '@/parcels/lists/ListActionItems/ListAddMenuItem/ListAddMenu.tsx';
import { LegacyListMenuItem } from '@/parcels/lists/ListActionItems/ListMenuItem/LegacyListMenuItem.tsx';
import { ListRemoveMenu } from '@/parcels/lists/ListActionItems/ListRemoveMenuItem/ListRemoveMenu.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { CreateListModal } from '@/parcels/lists/ListsOverview/CreateListModal/CreateListModal.tsx';
import type { UserListResource, UserListWithResources } from '@/parcels/lists/types.ts';
import { CardAddNotification } from '@/parcels/notification/CardAddNotification.tsx';
import { CardRemoveNotification } from '@/parcels/notification/CardRemoveNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type ListActionItemsProps = {
  tcg: Tcg;
  resourceId?: string;
  rawResourceId: string;
  resource?: TcgDataCard;
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

  const addToList = useCallback(
    (res: UserListResource[]) => {
      if (onAddedToList) onAddedToList(res[0]);

      const list = activeLists.find((l) => l.list.id === res[0].listId);
      if (list && type === 'card' && resource) {
        sendNotification('success', <CardAddNotification tcg={tcg} list={list.list} card={resource} language={'en'} />);
      }
    },
    [activeLists, onAddedToList, tcg, type, resource],
  );
  const removeFromList = useCallback(
    (listId: string, resourceId?: string) => {
      if (onRemovedFromList) onRemovedFromList(listId, resourceId);

      const list = activeLists.find((l) => l.list.id === listId);
      if (list && type === 'card' && resource) {
        sendNotification(
          'error',
          <CardRemoveNotification tcg={tcg} list={list.list} card={resource} language={'en'} />,
        );
      }
    },
    [activeLists, onRemovedFromList, tcg, type, resource],
  );

  const entries = useMemo(() => {
    return (
      <>
        {systemLists.map((list) => {
          const inList = existsInListsIds.includes(list.list.id);

          return (
            <LegacyListMenuItem
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
                  addToList(res);
                } else if (action === 'remove') {
                  removeFromList(list.list.id, resourceId);
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
          buttonText={listContext !== undefined ? t('copyToList') : t('addToList')}
          onSuccess={(res) => {
            if (res) {
              addToList([res]);
            }
          }}
          existsInLists={existsInLists}
          activeListContext={activeListContext ?? CONTEXT_LIST_MAIN}
        />

        {listContext !== undefined && (
          <LegacyListMenuItem
            key={listContext.list.id}
            resourceIds={[resourceId ?? rawResourceId]}
            raw={resourceId === undefined}
            listWithResources={listContext}
            action={'remove'}
            type={type}
            tcg={tcg}
            onSuccess={(res) => {
              if (!res) return;

              removeFromList(listContext.list.id, resourceId);
            }}
            icon={<IconList size={18} />}
            buttonText={t('removeFromList')}
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
                removeFromList(res.listId, res.resourceId);
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
    rawResourceId,
    ref,
    resourceId,
    systemLists,
    tcg,
    type,
    t,
    listContext,
    existsInLists,
    addToList,
    removeFromList,
    activeListContext,
  ]);

  return {
    modal,
    entries,
  };
}
