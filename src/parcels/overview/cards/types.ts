import type { DisplayMode, SortDirection } from '@/parcels/tcg/types.ts';
import type { components as c } from '@/schema/api';

export type SearchQueryTrigger = c['schemas']['SearchQueryTrigger'];

export type CardSearchParams = {
  query?: string;
  page?: number;
  sortDirection?: SortDirection;
  display?: DisplayMode;
  trigger?: SearchQueryTrigger;
  random?: boolean;
  manual?: boolean;
  subquery?: string;
};

export type CardSearchQuerySettings<T extends CardSearchParams> = Required<Omit<T, 'display'>>;
export type CardSearchDisplaySettings<T extends CardSearchParams> = Required<Pick<T, 'display'>>;
