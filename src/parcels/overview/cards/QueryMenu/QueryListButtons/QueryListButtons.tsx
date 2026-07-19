import { Center, Group, UnstyledButton } from '@mantine/core';
import { IconList, IconStar, IconStarFilled } from '@tabler/icons-react';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { useActiveLists } from '@/parcels/lists/ActiveListsState.tsx';
import { addResourcesToList, removeResourcesFromList } from '@/parcels/lists/api.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { MoreListActionsMenu } from '@/parcels/lists/MoreListActionsMenu/MoreListActionsMenu.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { useCheckListLimits } from '@/parcels/lists/useInList.tsx';
import { QueryAddNotification } from '@/parcels/notification/QueryAddNotification.tsx';
import { QueryRemoveNotification } from '@/parcels/notification/QueryRemoveNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import type { UserSearchCardsDetails } from '@/parcels/tcg/types.ts';
import styles from './QueryListButtons.module.css';

export function QueryListButtons({
  details,
  savedSearchId,
  setSavedSearchId,
  existsInLists,
  size,
}: {
  details: UserSearchCardsDetails;
  savedSearchId?: string;
  setSavedSearchId: (savedSearchId: string | undefined) => void;
  size?: number;
  existsInLists: UserListWithResources[];
}) {
  const { tcg } = useTcg();
  const { user } = useAuth();

  const query = details.explain!;

  const iconSize = size ?? 22;

  const { lists } = useUserLists();
  const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
  const checkListLimits = useCheckListLimits();
  const { addResources, removeResources } = useActiveLists();

  //const existsInLists = useIsInList(lists, savedSearch?.id);
  const [inListAmount, setInListAmount] = useState<number>(existsInLists.length);
  useEffect(() => {
    setInListAmount(existsInLists.length);
  }, [existsInLists.length]);

  const [isFavorite, setIsFavorite] = useState<boolean>();
  const [isListLoading, setIsListLoading] = useState<boolean>();
  useEffect(() => {
    setIsFavorite(existsInLists.some((l) => l.list.systemListType === 'favorites'));
  }, [existsInLists]);

  const addToFavorites = useCallback(() => {
    if (isFavorite) return;
    if (!user?.id) return;

    const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
    if (!favoriteList) return;
    if (!checkListLimits(favoriteList, 1)) return;

    setIsFavorite(true);
    setIsListLoading(true);
    setInListAmount(inListAmount + 1);

    startTransition(() => {
      addResourcesToList(user?.id, favoriteList.list.id, [{ id: query.statisticsId! }], tcg, 'user_search', true).then(
        (res) => {
          setIsListLoading(false);

          if (res.error) {
            setSavedSearchId(undefined);
            setIsFavorite(false);
            sendErrorNotification(res.error);
            setInListAmount(inListAmount - 1);
            return;
          }
          setSavedSearchId(res.data?.[0]?.resourceId);
          // refetchLists();

          sendNotification(
            'success',
            <QueryAddNotification tcg={tcg} list={favoriteList.list} query={query} language={'en'} />,
          );
        },
      );
    });
  }, [query, checkListLimits, inListAmount, isFavorite, lists, tcg, user?.id, setSavedSearchId]);
  const removeFromFavorites = useCallback(() => {
    if (!isFavorite) return;
    if (!user?.id) return;

    const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
    if (!favoriteList) return;

    setIsFavorite(false);
    setIsListLoading(true);
    setInListAmount(inListAmount - 1);

    startTransition(() => {
      if (!savedSearchId) return;

      removeResourcesFromList(user?.id, favoriteList.list.id, [savedSearchId]).then((res) => {
        setIsListLoading(false);

        if (res.error) {
          setIsFavorite(true);
          sendErrorNotification(res.error);
          setInListAmount(inListAmount + 1);
          return;
        }
        // refetchLists();

        sendNotification(
          'error',
          <QueryRemoveNotification tcg={tcg} list={favoriteList.list} query={query} language={'en'} />,
        );
      });
    });
  }, [query, isFavorite, lists, tcg, user?.id, inListAmount, savedSearchId]);

  const [listMenuOpened, setListMenuOpened] = useState(false);

  return (
    <Group className={styles.quickActionGroup} gap={'0.15rem'} wrap={'nowrap'}>
      <UnstyledButton
        disabled={(favoriteList && !checkListLimits(favoriteList, 1)) || isListLoading}
        className={styles.quickActionButton}
        onClick={() => {
          if (isFavorite) {
            removeFromFavorites();
            return;
          }
          addToFavorites();
        }}
      >
        <Center>
          {isFavorite && <IconStarFilled size={iconSize} color={'var(--gourmet-neutral-8)'} />}
          {!isFavorite && <IconStar size={iconSize} color={'var(--gourmet-neutral-8)'} />}
        </Center>
      </UnstyledButton>

      <MoreListActionsMenu
        type={'user_search'}
        tcg={tcg}
        resourceId={savedSearchId}
        rawResourceId={query.statisticsId!}
        target={
          <UnstyledButton disabled={isListLoading} className={styles.quickActionButton}>
            <div style={{ position: 'relative', display: 'flex' }}>
              <Center>
                <IconList size={iconSize} color={'var(--gourmet-neutral-8)'} />
              </Center>
              {inListAmount > 0 && <span className={styles.badge}>{inListAmount}</span>}
            </div>
          </UnstyledButton>
        }
        menuOpened={listMenuOpened}
        setMenuOpened={setListMenuOpened}
        onAddedToList={(res) => {
          const list = lists.find((l) => l.list.id === res.listId);
          if (!list) return;

          setInListAmount(inListAmount + 1);
          addResources([res]);
          sendNotification(
            'success',
            <QueryAddNotification tcg={tcg} list={list.list} query={query} language={'en'} />,
          );
        }}
        onRemovedFromList={(listId) => {
          const list = lists.find((l) => l.list.id === listId);
          if (!list || !savedSearchId) return;

          setInListAmount(inListAmount - 1);
          removeResources([savedSearchId], [list.list.id]);
          sendNotification(
            'error',
            <QueryRemoveNotification tcg={tcg} list={list.list} query={query} language={'en'} />,
          );
        }}
        menuProps={{
          position: 'bottom-end',
          transitionProps: { transition: 'pop', duration: 100 },
          withArrow: false,
        }}
      />
    </Group>
  );
}
