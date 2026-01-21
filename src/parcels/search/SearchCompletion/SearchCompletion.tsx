import { useEffect, useRef, useState } from 'react';
import {
  generateCompletions,
  type SearchFilterStore,
  type SearchFilterValueStore,
} from '@/parcels/search/SearchCompletion/generateCompletions.ts';
import { fetchPcgFilters } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type SearchCompletionProps = {
  tcg: Tcg;
  currentQuery: string;
};

export function SearchCompletion({ tcg, currentQuery }: SearchCompletionProps) {
  const filterStore = useRef<SearchFilterStore>({} as SearchFilterStore);
  const filterValueStore = useRef<SearchFilterValueStore>({} as SearchFilterValueStore);

  const [completions, setCompletions] = useState<string[]>([]);

  useEffect(() => {
    generateCompletions(tcg, currentQuery, filterStore.current, filterValueStore.current, 5).then((values) => {
      setCompletions(values);
    });
  }, [tcg, currentQuery]);

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
    <div>
      SearchCompletion ({tcg}: `{currentQuery}`)
      <div>
        {completions.map((keyword) => (
          <p key={keyword}>{keyword}</p>
        ))}
      </div>
    </div>
  );
}
