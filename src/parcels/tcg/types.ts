import type {ReactElement} from 'react';
import z from 'zod';
import type {CardSearchParams} from '@/parcels/overview/types.ts';
import type {DlcDataCard, DlcSearchCardsResult, DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import {type DlcSearchDisplaySettings, type DlcSearchQuerySettings, dlcSortBys, dlcUniqueBys,} from '@/parcels/tcg/dlc/types.ts';
import type {MtgDataCard, MtgSearchCardsResult, MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import {type MtgSearchDisplaySettings, type MtgSearchQuerySettings, mtgSortBys, mtgUniqueBys,} from '@/parcels/tcg/mtg/types.ts';
import type {PcgDataCard, PcgSearchCardsResult, PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import {type PcgSearchDisplaySettings, type PcgSearchQuerySettings, pcgSortBys, pcgUniqueBys,} from '@/parcels/tcg/pcg/types.ts';

export type TcgSearchCardsResult = MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult;
export type TcgSearchDataCard = MtgSearchDataCard | DlcSearchDataCard | PcgSearchDataCard;

export type TcgSearchQuerySettings = MtgSearchQuerySettings | DlcSearchQuerySettings | PcgSearchQuerySettings;
export type TcgSearchDisplaySettings = MtgSearchDisplaySettings | DlcSearchDisplaySettings | PcgSearchDisplaySettings;

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
};

export const filterOperatorsRegex = '[=:><]';
export const filterOperators = [':', '>=', '>', '<=', '<', '='] as const;
export type TcgFilterOperator = (typeof filterOperators)[number];

export type TcgCardTableData = {
  columns: string[];
  rows: {
    card: MtgDataCard | DlcDataCard | PcgDataCard;
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
});
