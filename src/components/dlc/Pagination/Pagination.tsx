import {
  IconChevronLeft,
  IconChevronLeftPipe,
  IconChevronRight,
  IconChevronRightPipe,
  IconDots,
} from '@tabler/icons-react';
import Skeleton from 'react-loading-skeleton';
import type { ApplyFn } from '@/helpers/dlc/searchParams.ts';
import type { DlcCardOverviewQuerySettings, DlcCardOverviewSearchParams } from '@/helpers/dlc/types.ts';
import { useWindowSize } from '@/hooks/useWindowSize.ts';
import calculatePages from '../../../helpers/calculatePages.ts';
import styles from './Pagination.module.css';

type CardPaginationProps = {
  lastPage?: number;
  settings: DlcCardOverviewQuerySettings;
  setSettings: (update: ApplyFn<DlcCardOverviewSearchParams>) => void;
};

const MIN_DESKTOP_SIZE_PX = 720;

export default function Pagination({ lastPage, settings, setSettings }: CardPaginationProps) {
  const [width] = useWindowSize();
  const currentPage = settings.page ?? 1;

  const switchPage = (nextPage: number) => {
    if (nextPage < 1) return;
    if (nextPage > (lastPage ?? 0)) return;
    if (nextPage === currentPage) return;

    setSettings((params) => {
      return { ...params, page: nextPage };
    });
  };

  return (
    <div className={styles.pagination}>
      {!lastPage && <Skeleton baseColor={'#444'} highlightColor={'#656565'} height={'2.5rem'} width={'20rem'} />}

      {lastPage && (
        <>
          <div className={styles.arrowsLeft}>
            <button type="button" disabled={currentPage === 1} onClick={() => switchPage(1)}>
              <IconChevronLeftPipe size={18} />
            </button>
            <button type="button" disabled={currentPage === 1} onClick={() => switchPage(currentPage - 1)}>
              <IconChevronLeft size={18} />
            </button>
          </div>
          <div className={styles.buttonsMiddle}>
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
          </div>
          <div className={styles.arrowsRight}>
            <button type="button" disabled={currentPage === lastPage} onClick={() => switchPage(currentPage + 1)}>
              <IconChevronRight size={18} />
            </button>
            <button type="button" disabled={currentPage === lastPage} onClick={() => switchPage(lastPage)}>
              <IconChevronRightPipe size={18} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}
