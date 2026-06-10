import { quickScore } from 'quick-score';
import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import type { FilterValuesByKeyword } from '@/parcels/search/filter/FilterCacheStore.tsx';
import { levenshtein } from '@/parcels/search/levenshtein.ts';
import type { DlcSearchFilter } from '@/parcels/tcg/dlc/api.ts';
import type { MtgSearchFilter } from '@/parcels/tcg/mtg/api.ts';
import type { PcgSearchFilter } from '@/parcels/tcg/pcg/api.ts';
import type { SearchQueryExecutorFilter, TcgFilterOperator } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type SearchFilterStore = {
  pcg: PcgSearchFilter[];
  dlc: DlcSearchFilter[];
  mtg: MtgSearchFilter[];
};
export type SearchFilterValueStoreEntry = { value: string; type: string; aliasOf?: string };
export type SearchFilterValueStore = Record<
  Tcg,
  Record<string, Record<TcgFilterOperator, SearchFilterValueStoreEntry[]>>
>;

const QUERY_REGEX = /^[-(]*([a-z]*)(>=|>|<=|<|:|=)([^><:= ()]*)$/g;
const QUERY_WITH_PARENTS_REGEX = /[-(]*([a-z]+)([:=])"([^><:=()]*)$/g;

export type GeneratedSearchCompletion = {
  value: string;
  type?: string;
  types?: string[];
  aliasOf?: string;
};

export type SearchCompletionState = {
  mode: 'filter' | 'value' | 'none' | 'invalid';
  userInput?: {
    filter?: string;
    operator?: string;
    value?: string;
  };
  toReplace?: string; // which string to replace (last) when completing
  completions: GeneratedSearchCompletion[];
};

export type FindOrFetchFn = (
  tcg: Tcg,
  keywords: string[],
  operator?: string,
) => Promise<GourmetApiResponse<FilterValuesByKeyword>>;

export async function generateCompletions(
  tcg: Tcg,
  currentQuery: string,
  filters: SearchQueryExecutorFilter[],
  max: number = 5,
  findOrFetchValues: FindOrFetchFn,
): Promise<SearchCompletionState> {
  if (currentQuery.length === 0) return { mode: 'filter', completions: [] }; // mode: filter
  if (currentQuery.trim().length === 0) return { mode: 'filter', completions: [] }; // mode: filter

  // if we have an uneven numbers of `"`, then the user opened one and didn't close it
  // so we assume we are still in a filter value.
  const unescapedQuery = currentQuery.replace('\\"', '');
  const parentheseCount = (unescapedQuery.match(/"/g) || []).length;
  if (parentheseCount % 2 !== 0) {
    const matches = Array.from(currentQuery.matchAll(QUERY_WITH_PARENTS_REGEX));
    if (matches.length === 0) {
      return { mode: 'invalid', completions: [] };
    }
    const [_, filter, operator, value] = matches[0];
    if (filter.length === 0) {
      return { mode: 'invalid', completions: [] };
    }

    const matchedFilter = filters.find((f) => f.keywords.includes(filter));
    if (!matchedFilter) {
      return { mode: 'invalid', completions: [] };
    }

    // `mode: value`, find matches with `value` and `operator`
    return generateFilterValueCompletions(
      tcg,
      matchedFilter,
      operator as TcgFilterOperator,
      value,
      max,
      findOrFetchValues,
    );
  }

  const currentPart = currentQuery.split(' ').slice(-1)[0];
  if (currentPart.length === 0) {
    return { mode: 'filter', completions: [] };
  }
  if (currentPart.replace(/[ (-]/, '').length === 0) {
    return { mode: 'filter', completions: [] };
  }

  const matches = Array.from(currentPart.matchAll(QUERY_REGEX));
  if (matches.length > 1) return { mode: 'invalid', completions: [] };
  if (matches.length === 0) {
    return generateFilterCompletions(currentPart, filters, max);
  }
  const [_, filter, operator, value] = matches[0];
  if (filter.length === 0) return { mode: 'invalid', completions: [] };

  const matchedFilter = filters.find((f) => f.keywords.includes(filter));
  if (!matchedFilter) return { mode: 'invalid', completions: [] };

  // `mode: value`, find matches with `value` and `operator`
  return generateFilterValueCompletions(
    tcg,
    matchedFilter,
    operator as TcgFilterOperator,
    value,
    max,
    findOrFetchValues,
  );
}

// async since it's doing a fetch call
async function generateFilterValueCompletions(
  tcg: Tcg,
  filter: PcgSearchFilter | DlcSearchFilter | MtgSearchFilter,
  operator: TcgFilterOperator,
  currentValue: string,
  max: number,
  findOrFetchValues: FindOrFetchFn,
): Promise<SearchCompletionState> {
  if (!filter.providesValues) return { mode: 'invalid', completions: [] }; // e.g. numbers
  if (filter.properties.length === 0) return { mode: 'invalid', completions: [] };

  const allowedOperators = filter.properties.flatMap((prop) => prop.operators);
  if (allowedOperators.length === 0) return { mode: 'invalid', completions: [] };
  if (!allowedOperators.includes(operator)) {
    // user error, operator does not work for this filter
    return { mode: 'invalid', completions: [] };
  }

  const keyword = filter.keywords[0];
  const valuesRes = await findOrFetchValues(tcg, [keyword], operator);
  if (!valuesRes.data || valuesRes.error) {
    return { mode: 'invalid', completions: [] };
  }
  const values: SearchFilterValueStoreEntry[] = valuesRes.data[keyword]
    .flatMap((value) => [
      { value: value.value, type: value.type },
      ...(value.aliases?.map((alias) => {
        return { value: alias, type: value.type, aliasOf: value.value };
      }) ?? []),
    ])
    .filter((value) => value.value.length > 0);

  const potentialMatches: { entry: SearchFilterValueStoreEntry; score: number }[] = [];
  for (const entry of values) {
    const score = quickScore(entry.value, currentValue);
    if (currentValue.length > 0 && score === 0) continue;

    potentialMatches.push({
      entry: entry,
      score: score,
    });
  }

  const matches = potentialMatches
    .sort((a, b) => (a.score - b.score) * -1)
    .slice(0, max)
    .map((match) => match.entry);

  return {
    mode: 'value',
    userInput: {
      operator: operator,
      value: currentValue,
    },
    completions: matches,
  };
}

export function generateFilterCompletions(
  currentWord: string,
  filters: SearchQueryExecutorFilter[],
  max: number,
): SearchCompletionState {
  if (currentWord.length === 0) {
    // TODO: maybe instead return "featured list = most used filters"
    return { mode: 'filter', completions: [] };
  }
  if (!filters || filters.length === 0) return { mode: 'invalid', completions: [] };

  // get all keywords that start with the currentWord
  // and calculate the levenshtein distance for them (for sorting).
  const potentialMatches: { filter: string; aliasOf?: string; distance: number }[] = [];
  for (const filter of filters) {
    if (filter.keywords.length === 0) continue;

    const primary = filter.keywords[0];
    for (let i = 0; i < filter.keywords.length; i++) {
      const keyword = filter.keywords[i];
      if (!keyword.startsWith(currentWord)) continue;
      const isAlias = i > 0;

      potentialMatches.push({
        filter: keyword,
        aliasOf: isAlias ? primary : undefined,
        distance: levenshtein(keyword, currentWord),
      });
    }
  }
  if (potentialMatches.length === 0) return { mode: 'filter', completions: [] };

  const completions = potentialMatches
    .sort((a, b) => a.distance - b.distance)
    .slice(0, max)
    .map((filter) => {
      return { value: filter.filter, aliasOf: filter.aliasOf } as GeneratedSearchCompletion;
    });

  return {
    mode: 'filter',
    userInput: {
      filter: currentWord,
    },
    completions: completions,
  };
}
