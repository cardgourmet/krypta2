import {z} from 'zod';
import type {CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings} from '@/parcels/overview/types.ts';
import {type DisplayMode, displayModes, type SortDirection, sortDirections} from '@/parcels/tcg/types.ts';

export const dlcSortBys = ['name', 'set', 'ink', 'strength', 'willpower', 'movement', 'released'] as const;
export type DlcSortBy = (typeof dlcSortBys)[number];

export const dlcUniqueBys = ['cards', 'prints'];
export type DlcUniqueBy = (typeof dlcUniqueBys)[number];

export const dlcSearchParamsDefaults = {
  query: '',
  page: 1,
  sortDirection: 'auto' as SortDirection,
  display: 'grid' as DisplayMode,
  uniqueBy: 'cards' as DlcUniqueBy,
  sortBy: 'name' as DlcSortBy,
};

export const dlcSearchParamsSchema = z.object({
  query: z.string().catch(dlcSearchParamsDefaults.query),
  page: z.number().catch(dlcSearchParamsDefaults.page),
  sortDirection: z.enum(sortDirections).catch(dlcSearchParamsDefaults.sortDirection),
  display: z.enum(displayModes).catch(dlcSearchParamsDefaults.display),
  uniqueBy: z.enum(dlcUniqueBys).catch(dlcSearchParamsDefaults.uniqueBy),
  sortBy: z.enum(dlcSortBys).catch(dlcSearchParamsDefaults.sortBy),
});

export type DlcSearchParams = CardSearchParams & {
  uniqueBy?: DlcUniqueBy;
  sortBy?: DlcSortBy;
};

export type DlcSearchQuerySettings = CardSearchQuerySettings<DlcSearchParams>;
export type DlcSearchDisplaySettings = CardSearchDisplaySettings<DlcSearchParams>;
