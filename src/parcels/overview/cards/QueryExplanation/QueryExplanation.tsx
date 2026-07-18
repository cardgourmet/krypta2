import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { calculateCardRange } from '@/parcels/overview/cards/calculateCardRange.ts';
import { parseSearchExplanation } from '@/parcels/search/parseSearchExplanation.ts';
import styles from './QueryExplanation.module.css';

type QueryExplanationProps = {
  isLoading: boolean;
  currentPage: number | undefined;
  pageSize: number;
  cardCount: number;
  explanation: string;
  randomized?: boolean;
};

export function QueryExplanation({
  isLoading,
  currentPage,
  pageSize,
  cardCount,
  explanation,
  randomized,
}: QueryExplanationProps) {
  const { t } = useTranslation('cards', { keyPrefix: 'explanation' });

  const adjustedExplanation = useMemo(() => {
    if (randomized) {
      return explanation.split(' ').slice(1).join(' ');
    }

    return explanation;
  }, [explanation, randomized]);

  return (
    <div className={styles.queryExplanation}>
      {isLoading && (
        <p>
          <Skeleton baseColor={'var(--gourmet-neutral-4)'} highlightColor={'var(--gourmet-neutral-5)'} />
        </p>
      )}
      {!isLoading && (
        <p>
          {!randomized && (
            <>
              {calculateCardRange(currentPage, Number(pageSize)).from}–
              {calculateCardRange(currentPage, Number(pageSize), cardCount).to} {t('of')}{' '}
            </>
          )}
          {randomized && (
            <>
              {pageSize} {t('randomized')}{' '}
            </>
          )}

          <span
            // biome-ignore lint/security/noDangerouslySetInnerHtml: _
            dangerouslySetInnerHTML={{
              __html: parseSearchExplanation(adjustedExplanation) ?? '',
            }}
          />
        </p>
      )}
    </div>
  );
}
