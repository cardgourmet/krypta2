import { Loader } from '@mantine/core';
import { parseSearchExplanation } from '@/parcels/search/parseSearchExplanation.ts';
import { useSearchExplanation } from '@/parcels/search/useSearchExplanation.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchQueryExplanation.module.css';

type QueryExplanationProps = {
  tcg: Tcg;
  query: string;
  fontSize?: string | number;
};

export function SearchQueryExplanation({ tcg, query, fontSize }: QueryExplanationProps) {
  const [loading, explanation] = useSearchExplanation(tcg, query);

  return (
    <div
      className={styles.explanation}
      style={{
        '--font-size': fontSize ?? '1rem',
      }}
    >
      <p>
        <span
          // biome-ignore lint/security/noDangerouslySetInnerHtml: _
          dangerouslySetInnerHTML={{
            __html: parseSearchExplanation(explanation ?? '') ?? '',
          }}
        />
      </p>
      {loading && <Loader color="gray" size="xs" type="dots" />}
    </div>
  );
}
