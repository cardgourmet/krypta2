import { ChevronFirst, ChevronLast, ChevronLeft, ChevronRight, Ellipsis } from 'lucide-react';
import type { DlcCardOverviewParams } from '@/helpers/dlc/types.ts';
import calculatePages from '../helpers/calculatePages.ts';
import { useWindowSize } from '../hooks/useWindowSize.ts';
import styles from './Pagination.module.css';

type CardPaginationProps = {
  lastPage: number;
  filter: DlcCardOverviewParams;
  setFilter: (params: DlcCardOverviewParams) => void;
};

const MIN_DESKTOP_SIZE_PX = 720;

export default function Pagination({ lastPage, filter, setFilter }: CardPaginationProps) {
  const [width] = useWindowSize();
  const currentPage = filter.page ?? 1;

  const switchPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (nextPage > lastPage) return;
    if (nextPage === currentPage) return;

    const newFilter = { ...filter, page: nextPage };
    setFilter(newFilter);
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.arrowsLeft}>
        <button type="button" disabled={currentPage === 1} onClick={() => switchPage(1)}>
          <ChevronFirst />
        </button>
        <button type="button" disabled={currentPage === 1} onClick={() => switchPage(currentPage - 1)}>
          <ChevronLeft />
        </button>
      </div>
      {width <= MIN_DESKTOP_SIZE_PX && (
        <div className={styles.middle}>
          <button type="button" className={styles.currentPage} onClick={() => switchPage(currentPage)}>
            {currentPage}
          </button>
        </div>
      )}
      {width > MIN_DESKTOP_SIZE_PX
        && calculatePages(currentPage, lastPage, 1).map((page, index) => (
          <div key={index} className={styles.middle}>
            {page === null && <Ellipsis color={'#636b72'} />}
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
      <div className={styles.arrowsRight}>
        <button type="button" disabled={currentPage === lastPage} onClick={() => switchPage(currentPage + 1)}>
          <ChevronRight />
        </button>
        <button type="button" disabled={currentPage === lastPage} onClick={() => switchPage(lastPage)}>
          <ChevronLast />
        </button>
      </div>
    </div>
  );
}
