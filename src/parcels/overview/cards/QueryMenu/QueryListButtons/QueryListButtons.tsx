import { Center, Group, UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconList, IconStar, IconStarFilled } from '@tabler/icons-react';
import { startTransition, useCallback, useEffect, useState } from 'react';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { addResourcesToList, removeResourcesFromList } from '@/parcels/lists/api.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { MoreListActionsMenu } from '@/parcels/lists/MoreListActionsMenu/MoreListActionsMenu.tsx';
import { useCheckListLimits, useIsInList } from '@/parcels/lists/useInList.tsx';
import { QueryAddToListNotification } from '@/parcels/overview/cards/QueryMenu/QueryListButtons/QueryAddToListNotification.tsx';
import { QueryRemoveFromListNotification } from '@/parcels/overview/cards/QueryMenu/QueryListButtons/QueryRemoveFromListNotification.tsx';
import type { ExplainSearchQuery } from '@/parcels/search/types.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import styles from './QueryListButtons.module.css';

export function QueryListButtons({
  query,
  size,
}: {
  query: ExplainSearchQuery & { statisticsId: string };
  size?: number;
}) {
  const { tcg } = useTcg();
  const { user } = useAuth();

  const iconSize = size ?? 22;

  // TODO: we need info if the search has been saved

  const { lists, refetchLists } = useUserLists();
  const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
  const checkListLimits = useCheckListLimits();

  const existsInLists = useIsInList(lists, query.statisticsId);
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
      addResourcesToList(user?.id, favoriteList.list.id, tcg, [{ id: query.statisticsId }], 'search').then((res) => {
        setIsListLoading(false);

        if (res.error) {
          setIsFavorite(false);
          sendErrorNotification(res.error);
          setInListAmount(inListAmount - 1);
          return;
        }
        refetchLists();

        notifications.show({
          autoClose: 3_000,
          color: 'var(--gourmet-green-1)',
          message: <QueryAddToListNotification tcg={tcg} list={favoriteList.list} query={query} language={'en'} />,
        });
      });
    });
  }, [query, checkListLimits, inListAmount, isFavorite, lists, refetchLists, tcg, user?.id]);

  const removeFromFavorites = useCallback(() => {
    if (!isFavorite) return;
    if (!user?.id) return;

    const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
    if (!favoriteList) return;

    setIsFavorite(false);
    setIsListLoading(true);
    setInListAmount(inListAmount - 1);

    startTransition(() => {
      removeResourcesFromList(user?.id, favoriteList.list.id, tcg, [query.statisticsId], 'search').then((res) => {
        setIsListLoading(false);

        if (res.error) {
          setIsFavorite(true);
          sendErrorNotification(res.error);
          setInListAmount(inListAmount + 1);
          return;
        }
        refetchLists();

        notifications.show({
          autoClose: 3_000,
          color: 'var(--gourmet-red-01)',
          message: <QueryRemoveFromListNotification tcg={tcg} list={favoriteList.list} query={query} language={'en'} />,
        });
      });
    });
  }, [query, isFavorite, lists, refetchLists, tcg, user?.id, inListAmount]);

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
        resourceId={undefined}
        rawResourceId={query.statisticsId}
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
        onAddedToList={(_, listId) => {
          const list = lists.find((l) => l.list.id === listId);
          if (!list) return;

          notifications.show({
            autoClose: 3_000,
            color: 'var(--gourmet-green-1)',
            message: <QueryAddToListNotification tcg={tcg} list={list.list} query={query} language={'en'} />,
          });
        }}
        onRemovedFromList={(listId) => {
          const list = lists.find((l) => l.list.id === listId);
          if (!list) return;

          notifications.show({
            autoClose: 3_000,
            color: 'var(--gourmet-red-01)',
            message: <QueryRemoveFromListNotification tcg={tcg} list={list.list} query={query} language={'en'} />,
          });
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
