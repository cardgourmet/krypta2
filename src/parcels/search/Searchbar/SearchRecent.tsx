import { IconArrowNarrowRight, IconClockHour8, IconStar, IconX } from '@tabler/icons-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useSearchHistory } from '@/parcels/search/SearchHistoryProvider.tsx';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchRecent.module.css';

type SearchRecentItemProps = {
  tcg: Tcg;
  suggestionIndex: number;
  setIsOpened: (isOpened: boolean) => void;
};

export default function SearchRecent({ tcg, suggestionIndex, setIsOpened }: SearchRecentItemProps) {
  const history = useSearchHistory(tcg);
  const recentQueries = history.pastQueries ?? [];

  const navigate = useNavigate();

  const reversedRecentQueries = useMemo(() => {
    return [...recentQueries].reverse().slice(0, 5);
  }, [recentQueries]);

  return (
    <div className={styles.recent}>
      <p>ZULETZT</p>
      <ul>
        {reversedRecentQueries.map((query, index) => (
          <li key={index}>
            <button
              type="button"
              tabIndex={0}
              className={index + 1 === suggestionIndex ? styles.suggestionHighlighted : ''}
              onClick={() => {
                // noinspection JSIgnoredPromiseFromCall
                navigate({
                  to: '/dlc/cards',
                  search: (prev) => {
                    return { ...prev, query: query } as Required<DlcSearchParams>;
                  },
                });
                setIsOpened(false);
              }}
            >
              <div className={styles.recentItemLeft}>
                <IconClockHour8 size={22} color={'#9ba6b1'} />
                <p>{query}</p>
              </div>
            </button>
            <div className={styles.recentItemRight}>
              <button
                type={'button'}
                onClick={() => {
                  // TODO: add history entry to favorites
                }}
              >
                <IconStar size={16} color={'#9ba6b1'} />
              </button>
              <button
                type={'button'}
                onClick={() => {
                  const reverseIndex = recentQueries.length - 1 - index;
                  history?.removeQuery(reverseIndex);
                }}
              >
                <IconX size={16} color={'#9ba6b1'} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className={styles.moreRecents}>
        <Link to={'/'}>
          Zur gesamten Chronik
          <IconArrowNarrowRight size={20} />
        </Link>
      </div>
    </div>
  );
}
