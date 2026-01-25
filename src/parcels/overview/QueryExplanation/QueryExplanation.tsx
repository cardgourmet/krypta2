import Skeleton from 'react-loading-skeleton';
import { calculateCardRange } from '@/parcels/overview/calculateCardRange.ts';
import { parseSearchExplanation } from '@/parcels/search/parseSearchExplanation.ts';
import styles from './QueryExplanation.module.css';

type QueryExplanationProps = {
  isLoading: boolean;
  currentPage: number | undefined;
  pageSize: number;
  cardCount: number;
  explanation: string;
};

export function QueryExplanation({ isLoading, currentPage, pageSize, cardCount, explanation }: QueryExplanationProps) {
  return (
    <div className={styles.queryExplanation}>
      {isLoading && (
        <p>
          <Skeleton baseColor={'var(--gourmet-neutral-dark-5)'} highlightColor={'var(--gourmet-neutral-dark-6)'} />
        </p>
      )}
      {!isLoading && (
        <p>
          {calculateCardRange(currentPage, Number(pageSize)).from}–
          {calculateCardRange(currentPage, Number(pageSize), cardCount).to} von{' '}
          <span
            // biome-ignore lint/security/noDangerouslySetInnerHtml: _
            dangerouslySetInnerHTML={{
              __html: parseSearchExplanation(explanation) ?? '',
            }}
          />
        </p>
      )}
    </div>
  );
}
