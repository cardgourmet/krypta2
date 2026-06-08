import { Center, Group, UnstyledButton } from '@mantine/core';
import { IconList, IconStar, IconStarFilled } from '@tabler/icons-react';
import { getRouteApi } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { ReportMenu } from '@/parcels/details/TcgPrintDetails/QuickActionButtons/ReportMenu/ReportMenu.tsx';
import { ShareMenu } from '@/parcels/details/TcgPrintDetails/QuickActionButtons/ShareMenu/ShareMenu.tsx';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import styles from './QuickActionButtons.module.css';

const routeApi = getRouteApi(`/$tcg/sets/$setCode/$collectorNumber/{-$any}`);

export function QuickActionButtons() {
  const { user } = useAuth();

  const { print: card } = routeApi.useLoaderData();

  const { lists } = useUserLists();
  const existsInLists = useMemo(() => {
    return lists.filter((l) => {
      return l.resources?.card?.find((r) => r.listResource.resourceId === card.print.id);
    });
  }, [lists, card.print.id]);
  const isFavorited = useMemo(() => {
    return existsInLists.some((l) => l.list.systemListType === 'favorites');
  }, [existsInLists]);

  return (
    <Group p={'0 1rem'} gap={'0.5rem'}>
      <Group gap={'0.15rem'}>
        <ShareMenu />
        {user && <ReportMenu />}
      </Group>
      {user && (
        <Group className={styles.quickActionGroup} gap={'0.15rem'}>
          <UnstyledButton
            className={styles.quickActionButton}
            onClick={() => {
              // TODO: favorite this card if possible
            }}
          >
            <Center>
              {isFavorited && <IconStarFilled size={22} color={'var(--gourmet-neutral-8)'} />}
              {!isFavorited && <IconStar size={22} color={'var(--gourmet-neutral-8)'} />}
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
