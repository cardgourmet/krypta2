import {Button, Center, Group, Menu, NumberInput, Stack, UnstyledButton} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconChevronLeft, IconChevronLeftPipe, IconChevronRight, IconChevronRightPipe, IconDots,} from '@tabler/icons-react';
import {useMemo, useState} from 'react';
import Skeleton from 'react-loading-skeleton';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import type {ApplyFn} from '@/parcels/types.ts';
import calculatePages from '../calculatePages.ts';
import styles from './Pagination.module.css';

type PaginationProps = {
  currentPage?: number;
  lastPage?: number;
  isLoading?: boolean;
  setSettings: (update: ApplyFn<{ page?: number }>) => void;
};

export default function Pagination({ currentPage, lastPage, isLoading, setSettings }: PaginationProps) {
  const smallScreen = useMediaQuery('(max-width: 830px)');
  const mustCurrentPage = currentPage ?? 1;
  const [actualCurrentPage, setActualCurrentPage] = useState(mustCurrentPage);

  const switchPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (nextPage > (lastPage ?? 0)) return;
    if (nextPage === mustCurrentPage) return;

    setActualCurrentPage(nextPage);

    setSettings((params) => {
      return { ...params, page: nextPage };
    });
  };
  const pages = useMemo(() => {
    return calculatePages(mustCurrentPage, lastPage ?? 1, 1, 2);
  }, [mustCurrentPage, lastPage]);

  const workContext = useTcgOverviewWorkContext();
  const selectedCardsPerPage = useMemo(() => {
    const map: Record<number, number> = {};

    for (const [page, entries] of Object.entries(workContext?.data?.selection?.elementsByPage ?? {})) {
      map[Number(page)] = entries.length;
    }

    return map;
  }, [workContext?.data?.selection?.elementsByPage]);

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
              <button
                type="button"
                disabled={actualCurrentPage === 1}
                onClick={() => switchPage(1)}
                className={styles.pageButton}
              >
                <IconChevronLeftPipe size={18} />
              </button>
              <button
                type="button"
                disabled={actualCurrentPage === 1}
                onClick={() => switchPage(mustCurrentPage - 1)}
                className={styles.pageButton}
              >
                <IconChevronLeft size={18} />
              </button>
            </Group>
            <Group gap={'0.25rem'}>
              {smallScreen && (
                <div className={styles.middle}>
                  {actualCurrentPage === lastPage && (
                    <button
                      type="button"
                      className={`${styles.pageButton} ${styles.currentPage}`}
                      onClick={() => switchPage(mustCurrentPage)}
                    >
                      {actualCurrentPage}
                    </button>
                  )}
                  {actualCurrentPage !== lastPage && (
                    <Group gap={'0.25rem'}>
                      <button
                        type="button"
                        className={`${styles.pageButton} ${styles.currentPage}`}
                        onClick={() => switchPage(mustCurrentPage)}
                      >
                        {actualCurrentPage}
                      </button>
                      {lastPage - (actualCurrentPage ?? 1) > 1 && (
                        <JumpToPageButton lastPage={lastPage} currentPage={actualCurrentPage} switchPage={switchPage} />
                      )}
                      <button type="button" className={`${styles.pageButton}`} onClick={() => switchPage(lastPage)}>
                        {lastPage}
                      </button>
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
                        <button
                          type="button"
                          className={`${styles.pageButton} ${page === actualCurrentPage ? styles.currentPage : ''}`}
                          onClick={() => switchPage(page)}
                        >
                          {page}
                        </button>
                      )}
                      {selectedHere > 0 && <span className={styles.badge}>{selectedHere}</span>}
                    </div>
                  );
                })}
            </Group>
            <Group gap={'0.25rem'}>
              <button
                type="button"
                disabled={actualCurrentPage === lastPage}
                onClick={() => switchPage(mustCurrentPage + 1)}
                className={styles.pageButton}
              >
                <IconChevronRight size={18} />
              </button>
              <button
                type="button"
                disabled={actualCurrentPage === lastPage}
                onClick={() => switchPage(lastPage)}
                className={styles.pageButton}
              >
                <IconChevronRightPipe size={18} />
              </button>
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
        <UnstyledButton className={styles.dotsButton}>
          <Center>
            <IconDots size={20} color={'var(--gourmet-neutral-5)'} />
          </Center>
        </UnstyledButton>
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
            color={'var(--gourmet-blue-1)'}
            onClick={() => {
              setSwitchPageNumber('');
              switchPage(switchPageNumber as number);
            }}
            disabled={switchPageNumber === '' || switchPageNumber === currentPage}
            classNames={{ root: styles.switchPageButton }}
          >
            <GourmetText cgmff={'ui'} cgmc={'neutral-1'}>
              Zur Seite wechseln
            </GourmetText>
          </Button>
        </Stack>
      </Menu.Dropdown>
    </Menu>
  );
}
