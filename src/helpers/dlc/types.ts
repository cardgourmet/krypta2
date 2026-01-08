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

export type SortDirection = 'auto' | 'asc' | 'desc';
export function isSortDirection(direction: string): direction is SortDirection {
  return direction === 'auto' || direction === 'desc' || direction === 'asc';
}
export const sortDirectionElements: Record<SortDirection, string> = {
  auto: 'Automatisch',
  asc: 'Aufsteigend',
  desc: 'Absteigend',
};
export const sortDirectionDefault: SortDirection = 'auto';

// =========================================================================

export type CardAmount = 60 | 48 | 36 | 24 | 12;
export function isCardAmount(d: number): d is CardAmount {
  return d === 60 || d === 48 || d === 36 || d === 24 || d === 12;
}
export const cardAmountElements: Record<CardAmount, string> = {
  60: '60 Karten',
  48: '48 Karten',
  36: '36 Karten',
  24: '24 Karten',
  12: '12 Karten',
};
export const cardAmountDefault: CardAmount = 60;

// =========================================================================

export type CardDisplayMode = 'grid' | 'table';
export function isCardDisplayMode(s: string): s is CardDisplayMode {
  return s === 'grid' || s === 'table';
}
export const cardDisplayModeElements: Record<CardDisplayMode, string> = {
  grid: 'Raster',
  table: 'Tabelle',
};
export const cardDisplayModeDefault: CardDisplayMode = 'grid';

// =========================================================================

export type DlcCardOverviewSearchParams = {
  page?: number;
  pageSize?: CardAmount;
  sortBy?: DlcCardSortBy;
  sortDirection?: SortDirection;
  cardDisplayMode?: CardDisplayMode;
};
// ugly, i know.
export type DlcCardOverviewSettings = {
  page: number;
  pageSize: CardAmount;
  sortBy: DlcCardSortBy;
  sortDirection: SortDirection;
  cardDisplayMode: CardDisplayMode;
};

export type DlcCardQuery = {
  mode?: string;
  query?: string;
  pageSize?: number;
  page?: number;
  sortBy?: 'name' | 'set' | 'ink' | 'strength' | 'willpower' | 'movement' | 'released';
  sortDirection?: 'asc' | 'desc';
  lang?: string;
  displayLanguage?: string;
  flags?: string;
  allowedFilters?: string;
  forbiddenFilters?: string;
  allowedValueTypes?: string;
  retries?: string;
};
