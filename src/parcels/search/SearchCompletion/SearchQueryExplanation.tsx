import { Loader } from '@mantine/core';
import { useEffect, useState, useTransition } from 'react';
import { parseSearchExplanation } from '@/parcels/search/parseSearchExplanation.ts';
import { fetchDlcQueryExplain } from '@/parcels/tcg/dlc/api.ts';
import { fetchPcgQueryExplain } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchQueryExplanation.module.css';

type QueryExplanation = {
  tcg: Tcg;
  query: string;
};

export function SearchQueryExplanation({ tcg, query }: QueryExplanation) {
  const [explanation, setExplanation] = useState<string | null>(null);

  const [loading, startLoading] = useTransition();

  useEffect(() => {
    const abort = new AbortController();

    startLoading(async () => {
      if (tcg === 'dlc') {
        const res = await fetchDlcQueryExplain(query, abort);
        setExplanation(res.data?.data?.explanation ?? null);
      } else if (tcg === 'pcg') {
        const res = await fetchPcgQueryExplain(query, abort);
        setExplanation(res.data?.data?.explanation ?? null);
      }
    });

    return () => {
      abort.abort();
    };
  }, [tcg, query]);

  return (
    <div className={styles.explanation}>
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
