import { Center, Flex, Group, Image, Stack, UnstyledButton } from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { IconArrowRight, IconList, IconStar, IconStarFilled } from '@tabler/icons-react';
import { getRouteApi, Link } from '@tanstack/react-router';
import { startTransition, useEffect, useMemo, useState } from 'react';
import { sendErrorNotification } from '@/parcels/api/handleApiCall.tsx';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { ReportMenu } from '@/parcels/details/TcgPrintDetails/QuickActionButtons/ReportMenu/ReportMenu.tsx';
import { ShareMenu } from '@/parcels/details/TcgPrintDetails/QuickActionButtons/ShareMenu/ShareMenu.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { addResourcesToList, removeResourcesFromList } from '@/parcels/lists/api.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { UserList } from '@/parcels/lists/types.ts';
import { useCheckListLimits, useIsInList } from '@/parcels/lists/useInList.tsx';
import { backupImageUrl } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './QuickActionButtons.module.css';

const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);

export function QuickActionButtons() {
  const { tcg } = useTcg();
  const { user } = useAuth();

  const { print: card } = routeApi.useLoaderData();

  const { lists, refetchLists } = useUserLists();
  const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
  const checkListLimits = useCheckListLimits();

  const existsInLists = useIsInList(lists, card.print.id);
  const [isFavorite, setIsFavorite] = useState<boolean>();
  useEffect(() => {
    setIsFavorite(existsInLists.some((l) => l.list.systemListType === 'favorites'));
  }, [existsInLists]);

  const addToFavorites = () => {
    if (isFavorite) return;
    if (!user?.id) return;

    const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
    if (!favoriteList) return;
    if (!checkListLimits(favoriteList, 1)) return;

    setIsFavorite(true);

    startTransition(() => {
      addResourcesToList(user?.id, favoriteList.list.id, tcg, [{ id: card.print.id }], 'card').then((res) => {
        if (res.error) {
          setIsFavorite(false);
          sendErrorNotification(res.error);
          return;
        }
        refetchLists();

        notifications.show({
          autoClose: 5_000,
          color: 'var(--gourmet-green-1)',
          message: <AddedToListNotification tcg={tcg} list={favoriteList.list} card={card} language={'en'} />,
        });
      });
    });
  };

  const removeFromFavorites = () => {
    if (!isFavorite) return;
    if (!user?.id) return;

    const favoriteList = lists.find((l) => l.list.systemListType === 'favorites');
    if (!favoriteList) return;

    setIsFavorite(false);

    startTransition(() => {
      removeResourcesFromList(user?.id, favoriteList.list.id, tcg, [card.print.id], 'card').then((res) => {
        if (res.error) {
          setIsFavorite(true);
          sendErrorNotification(res.error);
          return;
        }
        refetchLists();

        notifications.show({
          autoClose: 5_000,
          color: 'var(--gourmet-red-01)',
          message: <RemoveFromListNotification tcg={tcg} list={favoriteList.list} card={card} language={'en'} />,
        });
      });
    });
  };

  return (
    <Group p={'0 1rem'} gap={'0.5rem'}>
      <Group gap={'0.15rem'}>
        <ShareMenu />
        {user && <ReportMenu />}
      </Group>
      {user && (
        <Group className={styles.quickActionGroup} gap={'0.15rem'}>
          <UnstyledButton
            disabled={favoriteList && !checkListLimits(favoriteList, 1)}
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
              {isFavorite && <IconStarFilled size={22} color={'var(--gourmet-neutral-8)'} />}
              {!isFavorite && <IconStar size={22} color={'var(--gourmet-neutral-8)'} />}
            </Center>
          </UnstyledButton>
          <UnstyledButton
            className={styles.quickActionButton}
            onClick={() => {
              // TODO: open menu to add to or remove from lists
            }}
          >
            <Center>
              <IconList size={22} color={'var(--gourmet-neutral-8)'} />
            </Center>
          </UnstyledButton>
        </Group>
      )}
    </Group>
  );
}

function AddedToListNotification({
  tcg,
  list,
  card,
  language,
}: {
  tcg: Tcg;
  list: UserList;
  card: TcgDataCard;
  language: string;
}) {
  const imageSrc = useMemo(() => {
    if (tcg === 'mtg') {
      card = card as MtgDataCard;

      return (
        card.print.faces[0]?.translations?.[language]?.imageUrls?.thumbnail
        ?? card.print.faces[0]?.translations?.[language]?.imageUrls?.full
      );
    }
    card = card as Exclude<TcgDataCard, MtgDataCard>;

    return (
      card.print.translations?.[language]?.imageUrls?.thumbnail ?? card.print.translations?.[language]?.imageUrls?.full
    );
  }, [card, tcg, language]);

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Flex>
        <div
          style={{
            aspectRatio: '672 / 936',
            width: '4rem',
            flexShrink: 0,
          }}
        >
          <Image src={imageSrc} style={{ borderRadius: '0.25rem' }} fallbackSrc={backupImageUrl} />
        </div>
      </Flex>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-green-1)'}>
          Added to {list.name}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>
          We've added <i>{card.name}</i> to the list.{' '}
          <Link to={'/me/lists/$listId'} params={{ listId: slugify(list.name) }}>
            <Group gap={'0.25rem'} display={'inline-flex'}>
              <GourmetText cgmc={'neutral-9'} fz={'0.9rem'}>
                Go there now
              </GourmetText>
              <IconArrowRight size={16} color={'var(--gourmet-neutral-9)'} />
            </Group>
          </Link>
        </GourmetText>
      </Stack>
    </Group>
  );
}

function RemoveFromListNotification({
  tcg,
  list,
  card,
  language,
}: {
  tcg: Tcg;
  list: UserList;
  card: TcgDataCard;
  language: string;
}) {
  const imageSrc = useMemo(() => {
    if (tcg === 'mtg') {
      card = card as MtgDataCard;

      return (
        card.print.faces[0]?.translations?.[language]?.imageUrls?.thumbnail
        ?? card.print.faces[0]?.translations?.[language]?.imageUrls?.full
      );
    }
    card = card as Exclude<TcgDataCard, MtgDataCard>;

    return (
      card.print.translations?.[language]?.imageUrls?.thumbnail ?? card.print.translations?.[language]?.imageUrls?.full
    );
  }, [card, tcg, language]);

  return (
    <Group wrap={'nowrap'} align={'stretch'}>
      <Flex>
        <div
          style={{
            aspectRatio: '672 / 936',
            width: '4rem',
            flexShrink: 0,
          }}
        >
          <Image src={imageSrc} style={{ borderRadius: '0.25rem' }} fallbackSrc={backupImageUrl} />
        </div>
      </Flex>
      <Stack justify={'start'} gap={'0.25rem'}>
        <GourmetText cgmff={'ui'} fw={500} c={'var(--gourmet-red-01)'}>
          Removed from {list.name}
        </GourmetText>
        <GourmetText fz={'0.9rem'}>
          We've removed <i>{card.name}</i> from the list.{' '}
          <Link to={'/me/lists/$listId'} params={{ listId: slugify(list.name) }}>
            <Group gap={'0.25rem'} display={'inline-flex'}>
              <GourmetText cgmc={'neutral-9'} fz={'0.9rem'}>
                Go there anyway
              </GourmetText>
              <IconArrowRight size={16} color={'var(--gourmet-neutral-9)'} />
            </Group>
          </Link>
        </GourmetText>
      </Stack>
    </Group>
  );
}
