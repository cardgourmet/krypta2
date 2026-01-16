import type { CardSearchDisplaySettings, CardSearchParams, CardSearchQuerySettings } from '@/parcels/overview/types.ts';

export type DlcCardSortBy = 'name' | 'set' | 'ink' | 'strength' | 'willpower' | 'movement' | 'released';
export function isDlcCardSortBy(s: string): s is DlcCardSortBy {
  return (
    s === 'name'
    || s === 'set'
    || s === 'ink'
    || s === 'strength'
    || s === 'willpower'
    || s === 'movement'
    || s === 'released'
  );
}
export const sortByElements: Record<DlcCardSortBy, string> = {
  name: 'Name',
  set: 'Set',
  ink: 'Ink',
  strength: 'Stärke',
  willpower: 'Widerstandskraft',
  movement: 'Bewegungskosten',
  released: 'Veröffentlichkeitsdatum',
};
export const sortByDefault = 'name';

// =========================================================================

export type DlcCardSearchParams = CardSearchParams & {
  sortBy?: DlcCardSortBy;
};

export type DlcCardSearchQuerySettings = CardSearchQuerySettings<DlcCardSearchParams>;
export type DlcCardSearchDisplaySettings = CardSearchDisplaySettings<DlcCardSearchParams>;
