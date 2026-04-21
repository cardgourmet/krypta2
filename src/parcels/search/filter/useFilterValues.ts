import {useEffect, useState} from 'react';
import {type FilterValuesByKeyword, useFilterValueStore} from '@/parcels/search/filter/FilterValueStore.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function useFilterValues(tcg: Tcg, keywords: string[], operator?: string) {
  const [filterValues, setFilterValues] = useState<FilterValuesByKeyword | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const findFilterValues = useFilterValueStore((state) => state.findOrFetchValues);

  useEffect(() => {
    setIsLoading(true);
    findFilterValues(tcg, keywords, operator).then((res) => {
      setFilterValues(res.data);
      setIsLoading(false);
    });
  }, [findFilterValues, keywords, operator, tcg]);

  return { filterValues, isLoading };
}
