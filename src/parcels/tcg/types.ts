import type { ReactElement } from 'react';
import z from 'zod';
import type { CardSearchParams } from '@/parcels/overview/cards/types.ts';
import type {
  DlcDataCard,
  DlcDataPrint,
  DlcDataSet,
  DlcDataSetSummary,
  DlcDataSets,
  DlcSearchCards,
  DlcSearchCardsResult,
  DlcSearchDataCard,
  DlcSetSearchResult,
} from '@/parcels/tcg/dlc/api.ts';
import {
  type DlcSearchDisplaySettings,
  type DlcSearchQuerySettings,
  dlcSortBys,
  dlcUniqueBys,
} from '@/parcels/tcg/dlc/types.ts';
import type {
  MtgDataCard,
  MtgDataPrint,
  MtgDataSet,
  MtgDataSetSummary,
  MtgDataSets,
  MtgSearchCards,
  MtgSearchCardsResult,
  MtgSearchDataCard,
  MtgSetSearchResult,
} from '@/parcels/tcg/mtg/api.ts';
import {
  type MtgSearchDisplaySettings,
  type MtgSearchQuerySettings,
  mtgSortBys,
  mtgUniqueBys,
} from '@/parcels/tcg/mtg/types.ts';
import type {
  PcgDataCard,
  PcgDataPrint,
  PcgDataSet,
  PcgDataSetSummary,
  PcgDataSets,
  PcgSearchCards,
  PcgSearchCardsResult,
  PcgSearchDataCard,
  PcgSetSearchResult,
} from '@/parcels/tcg/pcg/api.ts';
import {
  type PcgSearchDisplaySettings,
  type PcgSearchQuerySettings,
  pcgSortBys,
  pcgUniqueBys,
} from '@/parcels/tcg/pcg/types.ts';
import type { components as c } from '@/schema/api';

export type SearchQueryExecutorFilterValues = c['schemas']['SearchQueryExecutorFilterValues'];
export type SearchQueryExecutorFilterValue = c['schemas']['SearchQueryExecutorFilterValue'];
export type SearchQueryExecutorFilter = c['schemas']['SearchQueryExecutorSearchQueryFilter'];
export type TransSearchQueryExecutorFilter = c['schemas']['TranslatedSearchQueryFilter'];
export type TcgSearchCardsResult = MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult;
export type TcgSearchCards = MtgSearchCards | DlcSearchCards | PcgSearchCards;
export type TcgSearchDataCard = MtgSearchDataCard | DlcSearchDataCard | PcgSearchDataCard;

export type TcgSearchQuerySettings = MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings;
export type TcgSearchDisplaySettings = MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings;

export type TcgDataPrint = MtgDataPrint | DlcDataPrint | PcgDataPrint;
export type TcgDataPrintReference =
  | c['schemas']['MtgDataPrintReference']
  | c['schemas']['DlcDataPrintReference']
  | c['schemas']['PcgDataPrintReference'];
export type TcgDataSets = MtgDataSets | DlcDataSets | PcgDataSets;
export type TcgStatistics = c['schemas']['TcgStatistics'];

export type TcgDataCard = MtgDataCard | DlcDataCard | PcgDataCard;
export type TcgDataSet = MtgDataSet | DlcDataSet | PcgDataSet;
export type TcgDataSetSummary = MtgDataSetSummary | DlcDataSetSummary | PcgDataSetSummary;
export type TcgSetSearchResult = MtgSetSearchResult | DlcSetSearchResult | PcgSetSearchResult;

export const sortDirections = ['asc', 'desc', 'auto'] as const;
export type SortDirection = (typeof sortDirections)[number];

export const displayModes = ['grid', 'table'] as const;
export type DisplayMode = (typeof displayModes)[number];

export type TcgCardQuery = {
  mode?: string;
  query?: string;
  pageSize?: number;
  page?: number;
  sortDirection?: 'asc' | 'desc';
  lang?: string;
  displayLanguage?: string;
  flags?: string;
  allowedFilters?: string;
  forbiddenFilters?: string;
  allowedValueTypes?: string;
  retries?: string;
  trigger?: 'search' | 'system' | 'unknown';
};

export const filterOperatorsRegex = '[=:><]';
export const filterOperators = [':', '>=', '>', '<=', '<', '='] as const;
export type TcgFilterOperator = (typeof filterOperators)[number];

export type TcgCardTableData = {
  columns: string[];
  colSizes?: string[];
  rows: {
    entry: MtgDataCard | DlcDataCard | PcgDataCard;
    data: Record<string, ReactElement>;
  }[];
};

export const tcgSearchParamsDefaults = {
  query: '',
  page: 1,
  sortDirection: 'auto' as SortDirection,
  display: 'grid' as DisplayMode,
  uniqueBy: 'cards' as TcgUniqueBy,
  sortBy: 'name' as TcgSortBy,
  random: false,
};

export const tcgSortBys = [...dlcSortBys, ...mtgSortBys, ...pcgSortBys] as const;
export type TcgSortBy = (typeof tcgSortBys)[number];

export const tcgUniqueBys = [...dlcUniqueBys, ...mtgUniqueBys, ...pcgUniqueBys] as const;
export type TcgUniqueBy = (typeof tcgUniqueBys)[number];

export type TcgSearchParams = CardSearchParams & {
  uniqueBy?: TcgUniqueBy;
  sortBy?: TcgSortBy;
};

export const tcgSearchParamsSchema = z.object({
  query: z.string().catch(tcgSearchParamsDefaults.query),
  page: z.number().catch(tcgSearchParamsDefaults.page),
  sortDirection: z.enum(sortDirections).catch(tcgSearchParamsDefaults.sortDirection),
  display: z.enum(displayModes).catch(tcgSearchParamsDefaults.display),
  uniqueBy: z.enum(tcgUniqueBys).catch(tcgSearchParamsDefaults.uniqueBy),
  sortBy: z.enum(tcgSortBys).catch(tcgSearchParamsDefaults.sortBy),
  random: z.boolean().catch(tcgSearchParamsDefaults.random),
});

export const tcgSetGroupBys = ['year', 'era', 'none'] as const;
export type TcgSetGroupBy = (typeof tcgSetGroupBys)[number];

export const tcgSetSortBys = ['released', 'prints', 'name'] as const;
export type TcgSetSortBy = (typeof tcgSetSortBys)[number];

export const tcgSetsParamsDefaults = {
  group: 'year' as TcgSetGroupBy,
  order: 'desc' as SortDirection,
  q: '',
  sort: 'released' as TcgSetSortBy,
  sortOrder: 'desc' as SortDirection,
};

export const tcgSetsParamsSchema = z.object({
  group: z.enum(tcgSetGroupBys).catch(tcgSetsParamsDefaults.group),
  order: z.enum(sortDirections).catch(tcgSetsParamsDefaults.order),
  q: z.string().catch(tcgSetsParamsDefaults.q),
  sort: z.enum(tcgSetSortBys).catch(tcgSetsParamsDefaults.sort),
  sortOrder: z.enum(sortDirections).catch(tcgSetsParamsDefaults.sortOrder),
});
