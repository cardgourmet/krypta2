import { Group, Menu, NumberInput, Stack } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import {
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconDots,
} from '@tabler/icons-react';
import { startTransition, useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Button } from '@/parcels/generic/Button/Button.tsx';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { useTcgOverviewWorkStore } from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkStore.ts';
import type { TcgSearchParams } from '@/parcels/tcg/types.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import calculatePages from '../calculatePages.ts';
import styles from './Pagination.module.css';

type PaginationProps = {
  currentPage?: number;
  lastPage?: number;
  isLoading?: boolean;
  setSettings: (update: ApplyFn<TcgSearchParams>) => void;
};

export default function Pagination({ currentPage, lastPage, isLoading, setSettings }: PaginationProps) {
  const smallScreen = useMediaQuery('(max-width: 830px)');
  const mustCurrentPage = currentPage ?? 1;
  const [actualCurrentPage, setActualCurrentPage] = useState(mustCurrentPage);

  useEffect(() => {
    setActualCurrentPage(mustCurrentPage);
  }, [mustCurrentPage]);

  const switchPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (nextPage > (lastPage ?? 0)) return;
    if (nextPage === mustCurrentPage) return;

    setActualCurrentPage(nextPage);

    startTransition(() => {
      setSettings((prev) => {
        return { ...prev, page: nextPage };
      });
    });
  };
  const pages = useMemo(() => {
    return calculatePages(actualCurrentPage, lastPage ?? 1, 1, 2);
  }, [actualCurrentPage, lastPage]);

  const workContextElements = useTcgOverviewWorkStore((state) => state?.data?.selection?.elementsByPage) ?? {};
  const selectedCardsPerPage = useMemo(() => {
    const map: Record<number, number> = {};

    for (const [page, entries] of Object.entries(workContextElements)) {
      map[Number(page)] = entries.length;
    }

    return map;
  }, [workContextElements]);

  return (
    <div className={styles.contentNav}>
      <div className={styles.pagination}>
        {(isLoading || !lastPage) && (
          <Skeleton
            baseColor={'var(--gourmet-neutral-4)'}
            highlightColor={'var(--gourmet-neutral-5)'}
            height={'2.5rem'}
            width={'20rem'}
          />
        )}

        {!isLoading && lastPage && (
          <Group>
            <Group gap={'0.25rem'}>
              <Button
                disabled={actualCurrentPage === 1}
                leadingIcon={<IconChevronLeftPipe />}
                onClick={() => switchPage(1)}
                size="sm"
                variant="secondary"
              />
              <Button
                disabled={actualCurrentPage === 1}
                leadingIcon={<IconChevronLeft />}
                onClick={() => switchPage(mustCurrentPage - 1)}
                size="sm"
                variant="secondary"
              />
            </Group>
            <Group gap={'0.25rem'}>
              {smallScreen && (
                <div className={styles.middle}>
                  {actualCurrentPage === lastPage && (
                    <Button onClick={() => switchPage(mustCurrentPage)} size="sm">
                      {actualCurrentPage}
                    </Button>
                  )}

                  {actualCurrentPage !== lastPage && (
                    <Group gap={'0.25rem'}>
                      <Button onClick={() => switchPage(mustCurrentPage)} size="sm">
                        {actualCurrentPage}
                      </Button>
                      {lastPage - (actualCurrentPage ?? 1) > 1 && (
                        <JumpToPageButton lastPage={lastPage} currentPage={actualCurrentPage} switchPage={switchPage} />
                      )}
                      <Button onClick={() => switchPage(lastPage)} size="sm" variant="secondary">
                        {lastPage}
                      </Button>
                    </Group>
                  )}
                </div>
              )}
              {!smallScreen
                && pages.map((page, index) => {
                  const selectedHere = selectedCardsPerPage[page ?? -1] ?? 0;

                  return (
                    <div key={index} className={styles.middle}>
                      {page === null && (
                        <JumpToPageButton lastPage={lastPage} currentPage={actualCurrentPage} switchPage={switchPage} />
                      )}
                      {page !== null && (
                        <Button
                          onClick={() => switchPage(page)}
                          size="sm"
                          variant={page === actualCurrentPage ? 'primary' : 'secondary'}
                        >
                          {page}
                        </Button>
                      )}
                      {selectedHere > 0 && <span className={styles.badge}>{selectedHere}</span>}
                    </div>
                  );
                })}
            </Group>
            <Group gap="0.25rem">
              <Button
                disabled={actualCurrentPage === lastPage}
                leadingIcon={<IconChevronRight />}
                onClick={() => switchPage(mustCurrentPage + 1)}
                size="sm"
                variant="secondary"
              />
              <Button
                disabled={actualCurrentPage === lastPage}
                leadingIcon={<IconChevronRightPipe />}
                onClick={() => switchPage(lastPage)}
                size="sm"
                variant="secondary"
              />
            </Group>
          </Group>
        )}
      </div>
    </div>
  );
}

function JumpToPageButton({
  lastPage,
  currentPage,
  switchPage,
}: {
  lastPage: number;
  currentPage?: number;
  switchPage: (n: number) => void;
}) {
  const [switchPageNumber, setSwitchPageNumber] = useState<number | string>('');

  return (
    <Menu shadow="md" position={'bottom'} withArrow>
      <Menu.Target>
        <Button leadingIcon={<IconDots />} size="sm" variant="tertiary" />
      </Menu.Target>

      <Menu.Dropdown>
        <Stack gap={'0.5rem'}>
          <Group gap={'0.5rem'} p={'0.25rem'}>
            <GourmetText cgmff={'ui'}>Gib eine Zahl ein</GourmetText>
            <NumberInput
              size={'xs'}
              min={1}
              max={lastPage}
              maw={'6rem'}
              value={switchPageNumber}
              onChange={setSwitchPageNumber}
              classNames={{ input: styles.switchPageInput }}
            />
          </Group>
          <Button
            disabled={switchPageNumber === '' || switchPageNumber === currentPage}
            onClick={() => {
              setSwitchPageNumber('');
              switchPage(switchPageNumber as number);
            }}
            size="sm"
          >
            Zur Seite wechseln
          </Button>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
