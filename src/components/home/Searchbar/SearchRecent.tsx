import { IconArrowNarrowRight, IconClockHour8, IconStar, IconX } from '@tabler/icons-react';
import { Link } from '@tanstack/react-router';
import { useMemo } from 'react';
import styles from './SearchRecent.module.css';

type SearchRecentItemProps = {
  suggestionIndex: number;
  recentQueries: string[];
};

export default function SearchRecent({ suggestionIndex, recentQueries }: SearchRecentItemProps) {
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
              <div className={styles.recentItemRight}>
                <IconStar size={16} color={'#9ba6b1'} />
                <IconX size={16} color={'#9ba6b1'} />
              </div>
            </button>
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
