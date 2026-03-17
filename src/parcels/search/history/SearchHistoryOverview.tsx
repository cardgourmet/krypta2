import {Divider, Group, Stack} from '@mantine/core';
import {useNavigate} from '@tanstack/react-router';
import {useEffect, useState} from 'react';
import {useAuth} from '@/parcels/auth/AuthContext.ts';
import {useBreadcrumbs} from '@/parcels/homepage/Breadcrumbs/useBreadcrumbs.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import Pagination from '@/parcels/overview/Pagination/Pagination.tsx';
import {fetchSearchHistory} from '@/parcels/search/api.ts';
import {SearchHistoryOverviewSettings} from '@/parcels/search/history/SearchHistoryOverviewSettings.tsx';
import type {PagedUserSearchHistoryEntry} from '@/parcels/search/types.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import {Route} from '@/routes/me/history';

export function SearchHistoryOverview() {
  const search = Route.useSearch();

  const { user } = useAuth();
  const { component, title } = useBreadcrumbs({
    subpage: !user ? `Guest` : `@${user?.username}`,
    moreSubpages: [
      {
        label: 'Suchhistorie',
      },
    ],
  });

  // TODO: if not logged in: only show what is in local storage
  // (with warning that not all are shown because not logged in)
  // TODO: if logged in: fetch new paginated

  // const history = useSearchHistory(search.tcg);
  const [remoteHistoryData, setRemoteHistoryData] = useState<PagedUserSearchHistoryEntry | undefined>(undefined);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  useEffect(() => {
    if (!user?.id) return;

    setIsLoading(true);
    const abort = new AbortController();
    fetchSearchHistory(user.id, search.tcg, undefined, search.sortDir, search.page - 1, search.size, abort).then(
      ({ data, error }) => {
        setIsLoading(false);

        if (error) {
          console.error('error while fetching search history', error);
          return;
        }

        setRemoteHistoryData(data);
      },
    );

    return () => {
      abort.abort();
      setIsLoading(false);
    };
  }, [search.page, search.size, search.sortDir, search.tcg, user?.id]);

  const navigate = useNavigate();
  const setSettings = (apply: ApplyFn<{ page?: number }>) => {
    const newParams = apply({ ...search });

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      to: '/me/history',
      search: () => ({ ...search, page: newParams.page ?? 1 }),
      replace: true,
    });
  };

  return (
    <div>
      <title>{`Your Search History – Cardgourmet`}</title>
      {component}

      <Stack
        gap={'0'}
        style={{
          position: 'sticky',
          top: 'var(--navbar-height)',
          zIndex: 'var(--sticky-layer)',
          backgroundColor: 'var(--gourmet-neutral-0)',
        }}
        mb={'1rem'}
      >
        <Group justify={'space-between'} p={'0.5rem 0'} h={'3.5rem'}>
          <GourmetText cgmc={'neutral-9'} cgmff={'title'} fz={'1.75rem'} fw={'500'} lh={'1.25'}>
            {title?.label}
          </GourmetText>

          {user?.id && (remoteHistoryData?.lastPage ?? 1) > 1 && (
            <Pagination
              currentPage={search.page}
              lastPage={remoteHistoryData?.lastPage ?? search.page}
              isLoading={isLoading}
              setSettings={setSettings}
            />
          )}
        </Group>
        <Divider w={'100%'} color={'var(--gourmet-neutral-3)'} />
      </Stack>

      <SearchHistoryOverviewSettings />

      <Stack mt={'xl'}>
        {!isLoading && (
          <GourmetText style={{ wordBreak: 'break-all' }}>{JSON.stringify(remoteHistoryData)}</GourmetText>
        )}
      </Stack>
    </div>
  );
}
