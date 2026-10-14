import { Center, Group, Tooltip, UnstyledButton } from '@mantine/core';
import { IconList, IconStar, IconStarFilled } from '@tabler/icons-react';
import { getRouteApi } from '@tanstack/react-router';
import { startTransition, useCallback, useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { CONTEXT_LIST_MAIN, useActiveLists, useActiveListsResource } from '@/parcels/lists/ActiveListsState.tsx';
import { addResourcesToList, removeResourcesFromList } from '@/parcels/lists/api.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import { MoreListActionsMenu } from '@/parcels/lists/MoreListActionsMenu/MoreListActionsMenu.tsx';
import { useCheckListLimits, useCheckUserLimits } from '@/parcels/lists/useInList.tsx';
import { CardAddNotification } from '@/parcels/notification/list/CardAddNotification.tsx';
import { CardRemoveNotification } from '@/parcels/notification/list/CardRemoveNotification.tsx';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { sendNotification } from '@/parcels/notification/sendNotification.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import styles from './ListButtons.module.css';

const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);

export function ListButtons() {
  const { tcg } = useTcg();
  const { user } = useAuth();

  const { print: card } = routeApi.useLoaderData();
  const { lists } = useUserLists();
  const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
  const checkListLimits = useCheckListLimits();

  const { addResources, removeResources } = useActiveLists();
  const { existsInLists } = useActiveListsResource(CONTEXT_LIST_MAIN, card.print.id);
  const inListAmount = existsInLists.length;

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

    startTransition(() => {
      addResourcesToList(user?.id, favoriteList.list.id, [{ id: card.print.id }], tcg, 'card').then((res) => {
        setIsListLoading(false);

        if (res.error) {
          setIsFavorite(false);
          sendErrorNotification(res.error);
          return;
        }
        if (!res.data) return;

        addResources([res.data[0]]);
        sendNotification(
          'success',
          <CardAddNotification tcg={tcg} list={favoriteList.list} card={card} language={'en'} />,
        );
      });
    });
  }, [card, checkListLimits, isFavorite, lists, tcg, user?.id, addResources]);
  const removeFromFavorites = useCallback(() => {
    if (!isFavorite) return;
    if (!user?.id) return;

    const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
    if (!favoriteList) return;

    setIsFavorite(false);
    setIsListLoading(true);

    startTransition(() => {
      removeResourcesFromList(user?.id, favoriteList.list.id, [card.print.id]).then((res) => {
        setIsListLoading(false);

        if (res.error) {
          setIsFavorite(true);
          sendErrorNotification(res.error);
          return;
        }

        removeResources([card.print.id], [favoriteList.list.id]);
        sendNotification(
          'error',
          <CardRemoveNotification tcg={tcg} list={favoriteList.list} card={card} language={'en'} />,
        );
      });
    });
  }, [card, isFavorite, lists, tcg, user?.id, removeResources]);

  const menuButton = useMemo(() => {
    return (
      <UnstyledButton disabled={isListLoading} className={styles.quickActionButton}>
        <div style={{ position: 'relative', display: 'flex' }}>
          <Center>
            <IconList size={22} color={'var(--gourmet-neutral-8)'} />
          </Center>
          {inListAmount > 0 && <span className={styles.badge}>{inListAmount}</span>}
        </div>
      </UnstyledButton>
    );
  }, [inListAmount, isListLoading]);

  const [listMenuOpened, setListMenuOpened] = useState(false);

  const { checkListAddExceeded, generateExceededTooltip } = useCheckUserLimits();
  const checkCreateLimitExceeded = useMemo(() => {
    if (!favoriteList) return undefined;

    const checkAdd = checkListAddExceeded(favoriteList, 1);
    if (checkAdd) return checkAdd;

    return undefined;
  }, [checkListAddExceeded, favoriteList]);
  const favoritesDisabled = useMemo(() => {
    return (favoriteList && !checkListLimits(favoriteList, 1)) || isListLoading;
  }, [favoriteList, checkListLimits, isListLoading]);

  return (
    <Group className={styles.quickActionGroup} gap={'0.15rem'} wrap={'nowrap'}>
      <Tooltip
        label={favoritesDisabled ? generateExceededTooltip(checkCreateLimitExceeded) : ''}
        disabled={!favoritesDisabled}
        color={'var(--gourmet-red-01)'}
        withArrow
      >
        <UnstyledButton
          disabled={favoritesDisabled}
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
            {isFavorite && (
              <IconStarFilled
                size={22}
                color={favoritesDisabled ? 'var(--gourmet-neutral-5)' : 'var(--gourmet-neutral-8)'}
              />
            )}
            {!isFavorite && (
              <IconStar size={22} color={favoritesDisabled ? 'var(--gourmet-neutral-5)' : 'var(--gourmet-neutral-8)'} />
            )}
          </Center>
        </UnstyledButton>
      </Tooltip>

      <MoreListActionsMenu
        type={'card'}
        tcg={tcg}
        resource={card}
        resourceId={card.print.id}
        rawResourceId={card.print.id}
        target={menuButton}
        menuOpened={listMenuOpened}
        setMenuOpened={setListMenuOpened}
        menuProps={{
          position: 'bottom-end',
          transitionProps: { transition: 'pop', duration: 100 },
          withArrow: false,
        }}
      />
    </Group>
  );
}
