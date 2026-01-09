import {
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconDots,
} from '@tabler/icons-react';
import type { DlcCardOverviewSearchParams, DlcCardOverviewSettings } from '@/helpers/dlc/types.ts';
import { useWindowSize } from '@/hooks/useWindowSize.ts';
import calculatePages from '../../../helpers/calculatePages.ts';
import styles from './Pagination.module.css';

type CardPaginationProps = {
  lastPage: number;
  settings: DlcCardOverviewSettings;
  setSettings: (update: (params: DlcCardOverviewSearchParams) => DlcCardOverviewSearchParams) => void;
};

const MIN_DESKTOP_SIZE_PX = 720;

export default function Pagination({ lastPage, settings, setSettings }: CardPaginationProps) {
  const [width] = useWindowSize();
  const currentPage = settings.page ?? 1;

  const switchPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (nextPage > lastPage) return;
    if (nextPage === currentPage) return;

    setSettings((params) => {
      return { ...params, page: nextPage };
    });
  };

  return (
    <div className={styles.pagination}>
      <div className={styles.arrowsLeft}>
        <button type="button" disabled={currentPage === 1} onClick={() => switchPage(1)}>
          <IconChevronLeftPipe />
        </button>
        <button type="button" disabled={currentPage === 1} onClick={() => switchPage(currentPage - 1)}>
          <IconChevronLeft />
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
            {page === null && <IconDots color={'#636b72'} />}
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
          <IconChevronRight />
        </button>
        <button type="button" disabled={currentPage === lastPage} onClick={() => switchPage(lastPage)}>
          <IconChevronRightPipe />
        </button>
      </div>
    </div>
  );
}
