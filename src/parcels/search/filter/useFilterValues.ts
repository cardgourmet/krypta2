import { useEffect, useMemo, useState } from 'react';
import { type FilterValuesByKeyword, useFilterCacheStore } from '@/parcels/search/filter/FilterCacheStore.tsx';
import type { SearchQueryExecutorFilterValue } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function useFilterValues(tcg: Tcg, keywords: string[], operator?: string) {
  const [filterValues, setFilterValues] = useState<FilterValuesByKeyword | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const findFilterValues = useFilterCacheStore((state) => state.findOrFetchValues);

  useEffect(() => {
    setIsLoading(true);
    findFilterValues(tcg, keywords, operator).then((res) => {
      setFilterValues(res.data);
      setIsLoading(false);
    });
  }, [findFilterValues, keywords, operator, tcg]);

  return { filterValues, isLoading };
}

export function getFilterValue(
  allValues: FilterValuesByKeyword | undefined,
  keyword: string,
  filter?: (v: SearchQueryExecutorFilterValue) => boolean,
  prefix?: string,
) {
  const values = allValues?.[keyword];
  if (!values) return [];

  return (
    values
      .filter((d) => {
        if (filter !== undefined) return filter(d);
        return true;
      })
      .map((d) => {
        return { value: (prefix ?? '') + d.value, label: d.displayValue };
      }) ?? []
  );
}

export function useFilterValue(
  allValues: FilterValuesByKeyword | undefined,
  keyword: string,
  filter?: (v: SearchQueryExecutorFilterValue) => boolean,
  prefix?: string,
) {
  return useMemo(() => {
    return getFilterValue(allValues, keyword, filter, prefix);
  }, [allValues, filter, keyword, prefix]);
}
