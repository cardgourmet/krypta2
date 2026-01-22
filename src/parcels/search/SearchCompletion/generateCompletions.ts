import { levenshtein } from '@/parcels/search/levenshtein.ts';
import { fetchPcgFilterValues, type PcgSearchFilter } from '@/parcels/tcg/pcg/api.ts';
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

export async function generateCompletions(
  tcg: Tcg,
  currentQuery: string,
  filterStore: SearchFilterStore,
  filterValueStore: SearchFilterValueStore,
  max: number = 5,
  setIsLoading: (value: boolean) => void,
  abort?: AbortController,
): Promise<GeneratedSearchCompletion[]> {
  if (currentQuery.length === 0) return []; // mode: filter
  if (currentQuery.trim().length === 0) return []; // mode: filter

  // if we have an uneven numbers of `"`, then the user opened one and didn't close it
  // so we assume we are still in a filter value.
  const unescapedQuery = currentQuery.replace('\\"', '');
  const parentheseCount = (unescapedQuery.match(/"/g) || []).length;
  if (parentheseCount % 2 !== 0) {
    const matches = Array.from(currentQuery.matchAll(QUERY_WITH_PARENTS_REGEX));
    if (matches.length === 0) return []; // mode: invalid
    const [_, filter, operator, value] = matches[0];
    if (filter.length === 0) return []; // mode: invalid

    const matchedFilter = filterStore[tcg]?.find((f) => f.keywords.includes(filter));
    if (!matchedFilter) return []; // mode: invalid filter name

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
  if (currentPart.length === 0) return []; // mode: filter
  if (currentPart.replace(/[ (-]/, '').length === 0) return []; // mode: filter

  const matches = Array.from(currentPart.matchAll(QUERY_REGEX));
  if (matches.length > 1) return []; // mode: invalid
  if (matches.length === 0) {
    return generateFilterCompletions(tcg, currentPart, filterStore, max);
  }
  const [_, filter, operator, value] = matches[0];
  if (filter.length === 0) return []; // mode: invalid

  const matchedFilter = filterStore[tcg]?.find((f) => f.keywords.includes(filter));
  if (!matchedFilter) return []; // mode: invalid filter name

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
): Promise<GeneratedSearchCompletion[]> {
  if (!filter.providesValues) return []; // e.g. numbers
  if (filter.properties.length === 0) return [];

  const allowedOperators = filter.properties.flatMap((prop) => prop.operators);
  if (allowedOperators.length === 0) return [];
  if (!allowedOperators.includes(operator)) return []; // user error, operator does not work for this filter

  const cachedValues: SearchFilterValueStoreEntry[] | undefined = store[tcg]?.[operator];
  if (cachedValues !== undefined) {
    const potentialMatches: { entry: SearchFilterValueStoreEntry; distance: number }[] = [];
    for (const entry of cachedValues) {
      potentialMatches.push({
        entry: entry,
        distance: levenshtein(entry.value, currentValue),
      });
    }
    return potentialMatches
      .sort((a, b) => a.distance - b.distance)
      .slice(0, max)
      .map((match) => match.entry);
  }

  const maxAmount = 100;

  // TODO: sometimes this flickers since it's async, so if abort: set it to false
  setIsLoading(true);
  const { data, error } = await fetchPcgFilterValues(
    filter.keywords[0],
    abort,
    operator as TcgFilterOperator,
    currentValue,
    maxAmount,
  );
  setIsLoading(false);

  if (error !== undefined) {
    throw error;
  }
  if (!data) return [];

  const values: SearchFilterValueStoreEntry[] = data.values
    .flatMap((value) => [
      { value: value.value, type: value.type },
      ...(value.aliases?.map((alias) => {
        return { value: alias, type: value.type, aliasOf: value.value };
      }) ?? []),
    ])
    .filter((value) => value.value.length > 0);
  if (data.matches === data.total && data.total <= maxAmount) {
    // store in cache
    store[tcg][operator] = values;
  }
  return values.slice(0, max);
}

export function generateFilterCompletions(
  tcg: Tcg,
  currentWord: string,
  store: SearchFilterStore,
  max: number,
): GeneratedSearchCompletion[] {
  if (currentWord.length === 0) return []; // TODO: maybe instead return "featured list = most used filters"
  const filters = store[tcg];
  if (!filters || filters.length === 0) return [];

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
  if (potentialMatches.length === 0) return [];

  return potentialMatches
    .sort((a, b) => a.distance - b.distance)
    .slice(0, max)
    .map((filter) => {
      return { value: filter.filter, aliasOf: filter.aliasOf } as GeneratedSearchCompletion;
    });
}
