import { useCallback, useEffect, useState } from 'react';
import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import { generateCompletions, type SearchCompletionState } from '@/parcels/search/completion/generateCompletions.ts';
import { type SearchSuggestion, transformCompletions } from '@/parcels/search/completion/transformCompletions.ts';
import { type FilterValuesByKeyword, useFilterCacheStore } from '@/parcels/search/filter/FilterCacheStore.tsx';
import { useFilters } from '@/parcels/search/filter/useFilters.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function useSearchCompletions(tcg: Tcg, query: string) {
  const filters = useFilters(tcg);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [currentState, setCurrentState] = useState<SearchCompletionState | null>(null);

  const [acceptedSuggestion, setAcceptedSuggestion] = useState<SearchSuggestion | undefined>(undefined);

  const findOrFetchValues = useFilterCacheStore((state) => state.findOrFetchValues);
  const wrapFindOrFetchValues = useCallback(
    async (tcg: Tcg, keywords: string[], operator?: string) => {
      if (operator) {
        const allowedProperties = keywords
          .map((k) => {
            return filters.find((f) => f.filter.keywords.includes(k));
          })
          .flatMap((k) => {
            return k?.filter.properties ?? [];
          })
          .filter((p) => p.operators.includes(operator));
        const allowedOperators = [...new Set(allowedProperties.flatMap((a) => a.operators))];

        if (!allowedOperators.includes(operator)) return { data: {} } as GourmetApiResponse<FilterValuesByKeyword>;

        const values = await findOrFetchValues(tcg, keywords, operator);
        const allowedPropertyKeys = allowedProperties.flatMap((p) => p.providedValueTypes);
        const filteredData: FilterValuesByKeyword = {};

        if (values.data) {
          for (const [keyword, valueArray] of Object.entries(values.data)) {
            filteredData[keyword] = valueArray.filter((v) => allowedPropertyKeys.includes(v.type));
          }
        }
        return { data: filteredData, error: values.error };
      }

      return await findOrFetchValues(tcg, keywords, operator);
    },
    [findOrFetchValues, filters],
  );

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    generateCompletions(tcg, query, filters, 5, wrapFindOrFetchValues, acceptedSuggestion).then((state) => {
      const suggestions = transformCompletions(query, state);
      setSuggestions([{ fullQuery: query }, ...suggestions]);
      setCurrentState(state);

      if (state.mode !== 'operator') setAcceptedSuggestion(undefined);
      else {
        const filter = filters.find((f) => f.filter.keywords.includes(state.userInput?.filter ?? ''));
        if (!filter) setAcceptedSuggestion(undefined);
      }
    });
  }, [tcg, query, findOrFetchValues, acceptedSuggestion]);

  const acceptSuggestion = useCallback(
    (sugg: SearchSuggestion) => {
      const currentSugg = sugg.fullQuery;

      if (currentState?.mode === 'operator' || currentState?.mode !== 'filter') {
        return currentSugg;
      }

      const filterKey = sugg.completion?.value;
      if (!filterKey) return currentSugg;
      const filter = filters.find((f) => f.filter.keywords.includes(filterKey));
      if (!filter) return currentSugg;

      setAcceptedSuggestion(sugg);
      return currentSugg;
    },
    [currentState?.mode, filters],
  );

  return { suggestions, acceptSuggestion };
}
