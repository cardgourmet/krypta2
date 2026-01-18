import { z } from 'zod';
import type { CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings } from '@/parcels/overview/types.ts';
import {
  type DisplayMode,
  displayModes,
  type PageSize,
  pageSizes,
  type SortDirection,
  sortDirections,
} from '@/parcels/tcg/types.ts';

export const dlcSortBys = ['name', 'set', 'ink', 'strength', 'willpower', 'movement', 'released'] as const;
export type DlcSortBy = (typeof dlcSortBys)[number];

export const dlcSearchParamsDefaults = {
  query: '',
  page: 1,
  pageSize: '60' as PageSize,
  sortDirection: 'auto' as SortDirection,
  cardDisplayMode: 'grid' as DisplayMode,
  sortBy: 'name' as DlcSortBy,
};

export const dlcSearchParamsSchema = z.object({
  query: z.string().catch(dlcSearchParamsDefaults.query),
  page: z.number().catch(dlcSearchParamsDefaults.page),
  pageSize: z.enum(pageSizes).catch(dlcSearchParamsDefaults.pageSize),
  sortDirection: z.enum(sortDirections).catch(dlcSearchParamsDefaults.sortDirection),
  cardDisplayMode: z.enum(displayModes).catch(dlcSearchParamsDefaults.cardDisplayMode),
  sortBy: z.enum(dlcSortBys).catch(dlcSearchParamsDefaults.sortBy),
});

export type DlcSearchParams = CardSearchParams & {
  sortBy?: DlcSortBy;
};

export type DlcSearchQuerySettings = CardSearchQuerySettings<DlcSearchParams>;
export type DlcSearchDisplaySettings = CardSearchDisplaySettings<DlcSearchParams>;
