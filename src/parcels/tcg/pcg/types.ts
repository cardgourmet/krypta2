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

export const pcgSortBys = ['name', 'rarity', 'set', 'type', 'health', 'released'] as const;
export type PcgSortBy = (typeof pcgSortBys)[number];

export const pcgSearchParamsDefaults = {
  query: '',
  page: 1,
  pageSize: '60' as PageSize,
  sortDirection: 'auto' as SortDirection,
  cardDisplayMode: 'grid' as DisplayMode,
  sortBy: 'name' as PcgSortBy,
};

export const pcgSearchParamsSchema = z.object({
  query: z.string().catch(pcgSearchParamsDefaults.query),
  page: z.number().catch(pcgSearchParamsDefaults.page),
  pageSize: z.enum(pageSizes).catch(pcgSearchParamsDefaults.pageSize),
  sortDirection: z.enum(sortDirections).catch(pcgSearchParamsDefaults.sortDirection),
  cardDisplayMode: z.enum(displayModes).catch(pcgSearchParamsDefaults.cardDisplayMode),
  sortBy: z.enum(pcgSortBys).catch(pcgSearchParamsDefaults.sortBy),
});

export type PcgSearchParams = CardSearchParams & {
  sortBy?: PcgSortBy;
};

export type PcgSearchQuerySettings = CardSearchQuerySettings<PcgSearchParams>;
export type PcgSearchDisplaySettings = CardSearchDisplaySettings<PcgSearchParams>;
