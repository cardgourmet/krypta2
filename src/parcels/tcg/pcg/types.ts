import {z} from 'zod';
import type {CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings} from '@/parcels/overview/types.ts';
import {type DisplayMode, displayModes, type SortDirection, sortDirections} from '@/parcels/tcg/types.ts';

export const pcgSortBys = ['name', 'rarity', 'set', 'type', 'health', 'released'] as const;
export type PcgSortBy = (typeof pcgSortBys)[number];

export const pcgUniqueBys = ['cards', 'prints'];
export type PcgUniqueBy = (typeof pcgUniqueBys)[number];

export const pcgSearchParamsDefaults = {
  query: '',
  page: 1,
  sortDirection: 'auto' as SortDirection,
  display: 'grid' as DisplayMode,
  uniqueBy: 'cards' as PcgUniqueBy,
  sortBy: 'name' as PcgSortBy,
};

export const pcgSearchParamsSchema = z.object({
  query: z.string().catch(pcgSearchParamsDefaults.query),
  page: z.number().catch(pcgSearchParamsDefaults.page),
  sortDirection: z.enum(sortDirections).catch(pcgSearchParamsDefaults.sortDirection),
  display: z.enum(displayModes).catch(pcgSearchParamsDefaults.display),
  uniqueBy: z.enum(pcgUniqueBys).catch(pcgSearchParamsDefaults.uniqueBy),
  sortBy: z.enum(pcgSortBys).catch(pcgSearchParamsDefaults.sortBy),
});

export type PcgSearchParams = CardSearchParams & {
  uniqueBy?: PcgUniqueBy;
  sortBy?: PcgSortBy;
};

export type PcgSearchQuerySettings = CardSearchQuerySettings<PcgSearchParams>;
export type PcgSearchDisplaySettings = CardSearchDisplaySettings<PcgSearchParams>;
