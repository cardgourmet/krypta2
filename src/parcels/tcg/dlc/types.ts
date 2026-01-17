import { z } from 'zod';
import type { CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings } from '@/parcels/overview/types.ts';

export const dlcPageSizes = ['60', '48', '36', '24', '12'] as const;
export type DlcPageSize = (typeof dlcPageSizes)[number];

export const dlcSortDirections = ['asc', 'desc', 'auto'] as const;
export type DlcSortDirection = (typeof dlcSortDirections)[number];

export const dlcDisplayModes = ['grid', 'table'] as const;
export type DlcDisplayMode = (typeof dlcDisplayModes)[number];

export const dlcSortBys = ['name', 'set', 'ink', 'strength', 'willpower', 'movement', 'released'] as const;
export type DlcSortBy = (typeof dlcSortBys)[number];

export const dlcSearchParamsDefaults = {
  query: '',
  page: 1,
  pageSize: '60' as DlcPageSize,
  sortDirection: 'auto' as DlcSortDirection,
  cardDisplayMode: 'grid' as DlcDisplayMode,
  sortBy: 'name' as DlcSortBy,
};

export const dlcSearchParamsSchema = z.object({
  query: z.string().catch(dlcSearchParamsDefaults.query),
  page: z.number().catch(dlcSearchParamsDefaults.page),
  pageSize: z.enum(dlcPageSizes).catch(dlcSearchParamsDefaults.pageSize),
  sortDirection: z.enum(dlcSortDirections).catch(dlcSearchParamsDefaults.sortDirection),
  cardDisplayMode: z.enum(['grid', 'table']).catch(dlcSearchParamsDefaults.cardDisplayMode),
  sortBy: z
    .enum(['name', 'set', 'ink', 'strength', 'willpower', 'movement', 'released'])
    .catch(dlcSearchParamsDefaults.sortBy),
});

export type DlcSearchParams = CardSearchParams & {
  sortBy?: DlcSortBy;
};

export type DlcSearchQuerySettings = CardSearchQuerySettings<DlcSearchParams>;
export type DlcSearchDisplaySettings = CardSearchDisplaySettings<DlcSearchParams>;
