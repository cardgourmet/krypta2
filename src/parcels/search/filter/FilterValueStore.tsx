import {create} from 'zustand/react';
import type {GourmetApiResponse} from '@/parcels/api/handleApiCall.ts';
import {fetchDlcFiltersValues} from '@/parcels/tcg/dlc/api.ts';
import {fetchMtgFiltersValues} from '@/parcels/tcg/mtg/api.ts';
import {fetchPcgFiltersValues} from '@/parcels/tcg/pcg/api.ts';
import type {SearchQueryExecutorFilterValue, SearchQueryExecutorFilterValues} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export type FilterValuesByKeyword = Record<string, SearchQueryExecutorFilterValue[]>;
export type FilterValueStore = {
  valuesByKeyword: Record<Tcg, FilterValuesByKeyword>;
  findValues: (tcg: Tcg, keyword: string, operator?: string) => SearchQueryExecutorFilterValue[] | undefined;
  findOrFetchValues: (
    tcg: Tcg,
    keywords: string[],
    operator?: string,
  ) => Promise<GourmetApiResponse<FilterValuesByKeyword>>;
};

export const useFilterValueStore = create<FilterValueStore>((set, get) => ({
  valuesByKeyword: {
    mtg: {},
    pcg: {},
    dlc: {},
  },
  findValues: (tcg: Tcg, keyword: string, operator?: string): SearchQueryExecutorFilterValue[] | undefined => {
    const possibleValues = get().valuesByKeyword[tcg]?.[keyword];
    if (possibleValues === undefined) return undefined;

    return possibleValues.filter((v) => {
      if (!operator || !v.resolvesToOperator) return true;
      return operator === v.resolvesToOperator;
    });
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
}));

export type SimpleFilterValue = {
  value: string;
  label: string;
};
