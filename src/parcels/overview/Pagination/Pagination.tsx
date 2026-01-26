import {
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconDots,
} from '@tabler/icons-react';
import Skeleton from 'react-loading-skeleton';
import { useWindowSize } from '@/parcels/overview/useWindowSize.ts';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';
import type { PcgSearchParams } from '@/parcels/tcg/pcg/types.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import calculatePages from '../calculatePages.ts';
import styles from './Pagination.module.css';

type CardPaginationProps = {
  currentPage?: number;
  lastPage?: number;
  isLoading?: boolean;
  isQueryLoading?: boolean;
  setSettings: (update: ApplyFn<DlcSearchParams | PcgSearchParams>) => void;
};

const MIN_DESKTOP_SIZE_PX = 720;

export default function Pagination({ currentPage, lastPage, isQueryLoading, setSettings }: CardPaginationProps) {
  const [width] = useWindowSize();
  const mustCurrentPage = currentPage ?? 1;

  const switchPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (nextPage > (lastPage ?? 0)) return;
    if (nextPage === mustCurrentPage) return;

    setSettings((params) => {
      return { ...params, page: nextPage };
    });
  };

  return (
    <div className={styles.contentNav}>
      <div className={styles.pagination}>
        {(isQueryLoading || !lastPage) && (
          <Skeleton
            baseColor={'var(--gourmet-neutral-4)'}
            highlightColor={'var(--gourmet-neutral-5)'}
            height={'2.5rem'}
            width={'20rem'}
          />
        )}

        {!isQueryLoading && lastPage && (
          <>
            <div className={styles.arrowsLeft}>
              <button type="button" disabled={currentPage === 1} onClick={() => switchPage(1)}>
                <IconChevronLeftPipe size={18} />
              </button>
              <button type="button" disabled={currentPage === 1} onClick={() => switchPage(mustCurrentPage - 1)}>
                <IconChevronLeft size={18} />
              </button>
            </div>
            <div className={styles.buttonsMiddle}>
              {width <= MIN_DESKTOP_SIZE_PX && (
                <div className={styles.middle}>
                  <button type="button" className={styles.currentPage} onClick={() => switchPage(mustCurrentPage)}>
                    {currentPage}
                  </button>
                </div>
              )}
              {width > MIN_DESKTOP_SIZE_PX
                && calculatePages(mustCurrentPage, lastPage, 1).map((page, index) => (
                  <div key={index} className={styles.middle}>
                    {page === null && <IconDots color={'var(--gourmet-neutral-5)'} />}
                    {page !== null && (
                      <button
                        type="button"
                        className={page === currentPage ? styles.currentPage : ''}
                        onClick={() => switchPage(page)}
                      >
                        {page}
                      </button>
                    )}
                  </div>
                ))}
            </div>
            <div className={styles.arrowsRight}>
              <button type="button" disabled={currentPage === lastPage} onClick={() => switchPage(mustCurrentPage + 1)}>
                <IconChevronRight size={18} />
              </button>
              <button type="button" disabled={currentPage === lastPage} onClick={() => switchPage(lastPage)}>
                <IconChevronRightPipe size={18} />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
