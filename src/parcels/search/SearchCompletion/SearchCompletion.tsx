import { Loader } from '@mantine/core';
import { useDebouncedValue } from '@mantine/hooks';
import { useEffect, useRef, useState } from 'react';
import {
  type GeneratedSearchCompletion,
  generateCompletions,
  type SearchFilterStore,
  type SearchFilterValueStore,
} from '@/parcels/search/SearchCompletion/generateCompletions.ts';
import { fetchPcgFilters } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './SearchCompletion.module.css';

type SearchCompletionProps = {
  tcg: Tcg;
  currentQuery: string;
  isOpened: boolean;
};

export function SearchCompletion({ tcg, currentQuery, isOpened }: SearchCompletionProps) {
  const filterStore = useRef<SearchFilterStore>({} as SearchFilterStore);
  const filterValueStore = useRef<SearchFilterValueStore>({} as SearchFilterValueStore);

  const [isLoading, setIsLoading] = useState(false);
  const [completions, setCompletions] = useState<GeneratedSearchCompletion[]>([]);
  const [debouncedQuery] = useDebouncedValue(currentQuery, 0); // maybe? wouldn't feel snappy anymore tho

  useEffect(() => {
    if (!isOpened) return;

    const abort = new AbortController();
    generateCompletions(
      tcg,
      debouncedQuery,
      filterStore.current,
      filterValueStore.current,
      5,
      setIsLoading,
      abort,
    ).then((values) => {
      setCompletions(values);
    });

    return () => {
      abort.abort();
    };
  }, [tcg, debouncedQuery, isOpened]);

  useEffect(() => {
    const controller = new AbortController();
    fetchPcgFilters(controller).then(({ data, error }) => {
      if (error !== undefined) {
        // non 200 status basically
        return;
      }
      filterStore.current[tcg] = data ?? [];
    });

    return () => {
      controller.abort();
    };
  }, [tcg]);

  return (
    <div className={styles.main}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        SearchCompletion ({tcg}: `{debouncedQuery}`)
        {isLoading && <Loader color="gray" size="xs" type="dots" />}
      </div>
      <div className={styles.completionList}>
        {completions.map((compl) => {
          return (
            <div className={styles.completionEntry} key={compl.value}>
              <p>{compl.value}</p>
              {compl.type !== undefined && <p className={styles.entryType}>{compl.type}</p>}
              {compl.aliasOf !== undefined && <p className={styles.entryAlias}>alias für: {compl.aliasOf}</p>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
