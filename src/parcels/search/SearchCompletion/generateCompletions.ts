import { levenshtein } from '@/parcels/search/levenshtein.ts';
import { type DlcSearchFilterValues, fetchDlcFilterValues } from '@/parcels/tcg/dlc/api.ts';
import { fetchPcgFilterValues, type PcgSearchFilter, type PcgSearchFilterValues } from '@/parcels/tcg/pcg/api.ts';
import type { TcgFilterOperator } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type SearchFilterStore = Record<Tcg, PcgSearchFilter[]>;
export type SearchFilterValueStoreEntry = { value: string; type: string; aliasOf?: string };
export type SearchFilterValueStore = Record<Tcg, Record<TcgFilterOperator, SearchFilterValueStoreEntry[]>>;

const QUERY_REGEX = /^[-(]*([a-z]*)(>=|>|<=|<|:)([^><:= ()]*)$/g;
const QUERY_WITH_PARENTS_REGEX = /[-(]*([a-z]+)([:=])"([^><:=()]*)$/g;

export type GeneratedSearchCompletion = {
  value: string;
  type?: string;
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

export async function generateCompletions(
  tcg: Tcg,
  currentQuery: string,
  filterStore: SearchFilterStore,
  filterValueStore: SearchFilterValueStore,
  max: number = 5,
  setIsLoading: (value: boolean) => void,
  abort?: AbortController,
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

    const matchedFilter = filterStore[tcg]?.find((f) => f.keywords.includes(filter));
    if (!matchedFilter) {
      return { mode: 'invalid', completions: [] };
    }

    // `mode: value`, find matches with `value` and `operator`
    return generateFilterValueCompletions(
      tcg,
      matchedFilter,
      operator as TcgFilterOperator,
      value,
      filterValueStore,
      max,
      setIsLoading,
      abort,
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
    return generateFilterCompletions(tcg, currentPart, filterStore, max);
  }
  const [_, filter, operator, value] = matches[0];
  if (filter.length === 0) return { mode: 'invalid', completions: [] };

  const matchedFilter = filterStore[tcg]?.find((f) => f.keywords.includes(filter));
  if (!matchedFilter) return { mode: 'invalid', completions: [] };

  // `mode: value`, find matches with `value` and `operator`
  return generateFilterValueCompletions(
    tcg,
    matchedFilter,
    operator as TcgFilterOperator,
    value,
    filterValueStore,
    max,
    setIsLoading,
    abort,
  );
}

// async since it's doing a fetch call
async function generateFilterValueCompletions(
  tcg: Tcg,
  filter: PcgSearchFilter,
  operator: TcgFilterOperator,
  currentValue: string,
  store: SearchFilterValueStore,
  max: number,
  setIsLoading: (value: boolean) => void,
  abort?: AbortController,
): Promise<SearchCompletionState> {
  if (!filter.providesValues) return { mode: 'invalid', completions: [] }; // e.g. numbers
  if (filter.properties.length === 0) return { mode: 'invalid', completions: [] };

  const allowedOperators = filter.properties.flatMap((prop) => prop.operators);
  if (allowedOperators.length === 0) return { mode: 'invalid', completions: [] };
  if (!allowedOperators.includes(operator)) {
    // user error, operator does not work for this filter
    return { mode: 'invalid', completions: [] };
  }

  const cachedValues: SearchFilterValueStoreEntry[] | undefined = store[tcg]?.[operator];
  if (cachedValues !== undefined) {
    const potentialMatches: { entry: SearchFilterValueStoreEntry; distance: number }[] = [];
    for (const entry of cachedValues) {
      potentialMatches.push({
        entry: entry,
        distance: levenshtein(entry.value, currentValue),
      });
    }
    const matches = potentialMatches
      .sort((a, b) => a.distance - b.distance)
      .slice(0, max)
      .map((match) => match.entry);

    return {
      mode: 'value',
      completions: matches,
    };
  }

  const maxAmount = 100;

  setIsLoading(true);
  let data: PcgSearchFilterValues | DlcSearchFilterValues | undefined;
  let error: Error | undefined;

  if (tcg === 'pcg') {
    const res = await fetchPcgFilterValues(
      filter.keywords[0],
      abort,
      operator as TcgFilterOperator,
      currentValue,
      maxAmount,
    );
    data = res.data;
    error = res.error;
  } else if (tcg === 'dlc') {
    const res = await fetchDlcFilterValues(
      filter.keywords[0],
      abort,
      operator as TcgFilterOperator,
      currentValue,
      maxAmount,
    );
    data = res.data;
    error = res.error;
  }
  if (error !== undefined) {
    // if it was aborted, we don't reset the loading indicator to not
    // interfere with the new request
    if (error.name === 'AbortError') {
      return { mode: 'invalid', completions: [] };
    }
  }
  setIsLoading(false);

  if (!data) return { mode: 'invalid', completions: [] };

  const values: SearchFilterValueStoreEntry[] = data.values
    .flatMap((value) => [
      { value: value.value, type: value.type },
      ...(value.aliases?.map((alias) => {
        return { value: alias, type: value.type, aliasOf: value.value };
      }) ?? []),
    ])
    .filter((value) => value.value.length > 0);
  if (data.total > 0 && data.total <= maxAmount && data.matches === data.total) {
    // store in cache
    if (!store[tcg]) {
      store[tcg] = { ':': [], '<': [], '<=': [], '=': [], '>': [], '>=': [] };
    }
    store[tcg][operator] = values;
  }
  const completions = values.slice(0, max);

  return {
    mode: 'value',
    userInput: {
      operator: operator,
      value: currentValue,
    },
    completions: completions,
  };
}

export function generateFilterCompletions(
  tcg: Tcg,
  currentWord: string,
  store: SearchFilterStore,
  max: number,
): SearchCompletionState {
  if (currentWord.length === 0) {
    // TODO: maybe instead return "featured list = most used filters"
    return { mode: 'filter', completions: [] };
  }
  const filters = store[tcg];
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
