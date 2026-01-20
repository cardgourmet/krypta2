import { useEffect, useState } from 'react';
import { levenshtein } from '@/parcels/search/levenshtein.ts';
import { fetchPcgFilters, type PcgSearchFilter } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type SearchCompletionProps = {
  tcg: Tcg;
  currentQuery: string;
};

type SearchFilterStore = Record<Tcg, PcgSearchFilter[]>;

export function SearchCompletion({ tcg, currentQuery }: SearchCompletionProps) {
  const [store, setStore] = useState<SearchFilterStore>({} as SearchFilterStore);

  // biome-ignore lint/correctness/useExhaustiveDependencies: _
  useEffect(() => {
    const controller = new AbortController();
    fetchPcgFilters(controller).then(({ data, error }) => {
      if (error !== undefined) {
        // non 200 status basically
        return;
      }

      const newStore = { ...store };
      newStore[tcg] = data ?? [];
      setStore(newStore);
    });

    return () => {
      controller.abort();
    };
  }, [tcg]);

  return (
    <div>
      SearchCompletion ({tcg}: `{currentQuery}`)
      <div>
        {generateCompletions(tcg, currentQuery, store, 5).map((keyword) => (
          <p key={keyword}>{keyword}</p>
        ))}
      </div>
    </div>
  );
}

function generateCompletions(tcg: Tcg, currentQuery: string, store: SearchFilterStore, max: number): string[] {
  if (!(currentQuery?.length > 0)) return [];

  const filters = store[tcg];
  if (!filters || filters.length === 0) return [];

  // if we have an uneven numbers of `"`, then the user opened one and didn't close it
  // so we assume we are still in a filter value.
  const unescapedQuery = currentQuery.replace('\\"', '');
  const parentheseCount = (unescapedQuery.match(/"/g) || []).length;
  if (parentheseCount % 2 !== 0) return [];

  const nonWordCharacters = ['(', ')', '>', '>=', '<', '<=', ':', '-', '"'];
  const currentWord = currentQuery.split(' ').slice(-1)[0];
  if (currentWord.length === 0) return []; // TODO: maybe instead return "featured list = most used filters"
  for (const nonWordCharacter of nonWordCharacters) {
    if (currentWord.startsWith(nonWordCharacter) || currentWord.endsWith(nonWordCharacter)) return [];
  }

  // get all keywords that start with the currentWord
  // and calculate the levenshtein distance for them (for sorting).
  const potentialFilters: { filter: string; aliasOf?: string; distance: number }[] = [];
  for (const filter of filters) {
    if (filter.keywords.length === 0) continue;

    const primary = filter.keywords[0];
    for (let i = 0; i < filter.keywords.length; i++) {
      const keyword = filter.keywords[i];
      if (!keyword.startsWith(currentWord)) continue;
      const isAlias = i > 0;

      potentialFilters.push({
        filter: keyword,
        aliasOf: isAlias ? primary : undefined,
        distance: levenshtein(keyword, currentWord),
      });
    }
  }
  if (potentialFilters.length === 0) return [];

  return potentialFilters
    .sort((a, b) => a.distance - b.distance)
    .slice(0, Math.min(max, potentialFilters.length))
    .map((filter) => `${filter.filter}${filter.aliasOf !== undefined ? ` (${filter.aliasOf})` : ''}`);
}
