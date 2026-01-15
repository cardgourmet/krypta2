import { IconArrowNarrowRight, IconClockHour8, IconStar, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import { useSearchHistory } from '@/components/home/SearchHistoryProvider/SearchHistoryProvider.tsx';
import styles from './SearchRecent.module.css';

type SearchRecentItemProps = {
  suggestionIndex: number;
  recentQueries: string[];
};

export default function SearchRecent({ suggestionIndex, recentQueries }: SearchRecentItemProps) {
  const history = useSearchHistory();

  const reversedRecentQueries = useMemo(() => {
    return [...recentQueries].reverse();
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
