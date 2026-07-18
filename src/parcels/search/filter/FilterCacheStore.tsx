import { create } from 'zustand/react';
import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import { fetchDlcFilters, fetchDlcFiltersValues } from '@/parcels/tcg/dlc/api.ts';
import { fetchMtgFilters, fetchMtgFiltersValues } from '@/parcels/tcg/mtg/api.ts';
import { fetchPcgFilters, fetchPcgFiltersValues } from '@/parcels/tcg/pcg/api.ts';
import type {
  SearchQueryExecutorFilterValue,
  SearchQueryExecutorFilterValues,
  TransSearchQueryExecutorFilter,
} from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type FilterValuesByKeyword = Record<string, SearchQueryExecutorFilterValue[]>;
export type FilterCacheStore = {
  valuesByKeyword: Record<Tcg, FilterValuesByKeyword>;
  findValues: (tcg: Tcg, keyword: string, operator?: string) => SearchQueryExecutorFilterValue[] | undefined;
  findOrFetchValues: (
    tcg: Tcg,
    keywords: string[],
    operator?: string,
  ) => Promise<GourmetApiResponse<FilterValuesByKeyword>>;

  filters: Record<Tcg, TransSearchQueryExecutorFilter[]>;
  loadFilters: (tcg: Tcg) => void;
};

export const useFilterCacheStore = create<FilterCacheStore>((set, get) => ({
  valuesByKeyword: {
    mtg: {},
    pcg: {},
    dlc: {},
  },
  findValues: (tcg: Tcg, keyword: string, _?: string): SearchQueryExecutorFilterValue[] | undefined => {
    const possibleValues = get().valuesByKeyword[tcg]?.[keyword];
    if (possibleValues === undefined) return undefined;

    return possibleValues;
  },
  findOrFetchValues: async (
    tcg: Tcg,
    keywords: string[],
    operator?: string,
  ): Promise<GourmetApiResponse<FilterValuesByKeyword>> => {
    if (keywords.length === 0) return { data: {} };
    const foundValuesByKeyword: FilterValuesByKeyword = {};
    const missingKeywords: string[] = [];
    for (const keyword of keywords) {
      const foundValues = get().findValues(tcg, keyword, operator);
      if (foundValues === undefined) {
        missingKeywords.push(keyword);
        continue;
      }

      foundValuesByKeyword[keyword] = foundValues;
    }
    if (missingKeywords.length === 0) {
      return { data: foundValuesByKeyword };
    }

    let res: GourmetApiResponse<Record<string, SearchQueryExecutorFilterValues>> | undefined;
    if (tcg === 'mtg') {
      res = await fetchMtgFiltersValues(missingKeywords);
    } else if (tcg === 'pcg') {
      res = await fetchPcgFiltersValues(missingKeywords);
    } else if (tcg === 'dlc') {
      res = await fetchDlcFiltersValues(missingKeywords);
    }
    if (!res || res?.error || !res.data) return { error: res?.error };

    const prevValues = get().valuesByKeyword;
    for (const [keyword, data] of Object.entries(res.data)) {
      prevValues[tcg][keyword] = data.values;
      foundValuesByKeyword[keyword] = data.values;
    }
    set(() => ({ valuesByKeyword: prevValues }));

    return { data: foundValuesByKeyword };
  },

  filters: {
    mtg: [],
    pcg: [],
    dlc: [],
  },
  loadFilters: async (tcg: Tcg) => {
    const filters = get().filters;
    if (filters[tcg].length > 0) return;

    let res: GourmetApiResponse<TransSearchQueryExecutorFilter[]> | undefined;
    if (tcg === 'mtg') {
      res = await fetchMtgFilters();
    } else if (tcg === 'pcg') {
      res = await fetchPcgFilters();
    } else if (tcg === 'dlc') {
      res = await fetchDlcFilters();
    }

    if (!res?.data || res.error) {
      return;
    }

    set({
      filters: {
        ...filters,
        [tcg]: res.data,
      },
    });
  },
}));

export type SimpleFilterValue = {
  value: string;
  label: string;
};
