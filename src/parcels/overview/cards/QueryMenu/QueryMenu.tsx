import { Center, Group, UnstyledButton } from '@mantine/core';
import { IconBook, IconBook2 } from '@tabler/icons-react';
import { useEffect, useState } from 'react';
import { useAuth } from '@/parcels/auth/AuthContext.ts';
import { useUserLists } from '@/parcels/lists/ListsContextProvider.tsx';
import type { UserListWithResources } from '@/parcels/lists/types.ts';
import { sendErrorNotification } from '@/parcels/notification/sendErrorNotification.tsx';
import { QueryListButtons } from '@/parcels/overview/cards/QueryMenu/QueryListButtons/QueryListButtons.tsx';
import { deleteSavedSearches, saveSearches } from '@/parcels/search/api.ts';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/useSearchHistory.ts';
import { useUserRecentSavedSearches } from '@/parcels/search/useUserRecentSavedSearches.ts';
import { useTcg } from '@/parcels/tcg/TcgProvider.tsx';
import type { UserSearchCardsDetails } from '@/parcels/tcg/types.ts';
import styles from './QueryMenu.module.css';

export function QueryMenu({ details }: { details: UserSearchCardsDetails }) {
  const { tcg } = useTcg();
  const { user } = useAuth();

  const history = useSearchHistory(tcg);
  const addSavedSearch = useUserRecentSavedSearches((s) => s.addSavedSearch);
  const removeSavedSearch = useUserRecentSavedSearches((s) => s.removeSavedSearch);

  const saved = details.savedSearch;
  const [savedSearchId, setSavedSearchId] = useState<string | undefined>(saved?.savedSearch.id);
  useEffect(() => {
    if (saved) setSavedSearchId(saved.savedSearch.id);
    else setSavedSearchId(undefined);
  }, [saved]);

  const { lists } = useUserLists();

  const [existsInLists, setExistsInLists] = useState<UserListWithResources[]>([]);
  useEffect(() => {
    const listIds = details.listResources?.filter((r) => r.resourceType === 'user_search')?.map((r) => r.listId) ?? [];

    setExistsInLists(lists.filter((l) => listIds.includes(l.list.id)));
  }, [details.listResources, lists]);

  return (
    <Group ml={'1rem'} gap={'0.5rem'}>
      <UnstyledButton
        onClick={() => {
          if (!user?.id) return;

          if (savedSearchId) {
            deleteSavedSearches(user?.id, tcg, [savedSearchId]).then(({ error }) => {
              if (error) {
                sendErrorNotification(error);
                return;
              }

              setExistsInLists([]);
              setSavedSearchId(undefined);

              // adjust local storage and remove all with that queryId
              removeSavedSearch(tcg, savedSearchId);
              history.markQueries(details.explain?.originalQuery as string, undefined);
            });
            return;
          }

          saveSearches(user?.id, tcg, [details.explain?.statisticsId as string]).then(({ data, error }) => {
            if (error) {
              sendErrorNotification(error);
              return;
            }
            if (!data?.length) return;

            setSavedSearchId(data[0].savedSearch.id);

            // adjust local storage and add all with that queryId
            addSavedSearch(tcg, data[0]);
            history.markQueries(details.explain!.originalQuery as string, data[0].savedSearch.id);
          });
        }}
        className={styles.actionButton}
      >
        <Center>
          {savedSearchId && <IconBook2 size={18} color={'var(--gourmet-blue-1)'} />}
          {!savedSearchId && <IconBook size={18} color={'var(--gourmet-neutral-7)'} />}
        </Center>
      </UnstyledButton>
      <QueryListButtons
        details={details}
        savedSearchId={savedSearchId}
        setSavedSearchId={setSavedSearchId}
        existsInLists={existsInLists}
        size={18}
      />
    </Group>
  );
}
