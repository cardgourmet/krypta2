import {
  type CardAmount,
  type CardDisplayMode,
  cardAmountDefault,
  cardDisplayModeDefault,
  type DlcCardOverviewSearchParams,
  type DlcCardSortBy,
  isCardAmount,
  isCardDisplayMode,
  isDlcCardSortBy,
  isSortDirection,
  type SortDirection,
  sortByDefault,
  sortDirectionDefault,
} from '@/helpers/dlc/types.ts';

export const validateSearchParams = (search: Record<string, unknown>): DlcCardOverviewSearchParams => {
  let requirePage = parseInt(search?.page as string, 10) || undefined;
  if (requirePage && requirePage < 1) {
    requirePage = undefined;
  }

  let requireSortBy = search?.sortBy as string | undefined;
  if (requireSortBy && !isDlcCardSortBy(requireSortBy)) {
    requireSortBy = undefined;
  }

  let requireSortDirection = search?.sortDirection as string | undefined;
  if (requireSortDirection && !isSortDirection(requireSortDirection)) {
    requireSortDirection = undefined;
  }

  let requireCardAmount = search?.pageSize as string | undefined;
  if (requireCardAmount && !isCardAmount(requireCardAmount)) {
    requireCardAmount = undefined;
  }

  let requireCardDisplayMode = search?.cardDisplayMode as string | undefined;
  if (requireCardDisplayMode && !isCardDisplayMode(requireCardDisplayMode)) {
    requireCardDisplayMode = undefined;
  }

  return {
    query: search?.query as string | undefined,
    page: requirePage,
    sortBy: requireSortBy as DlcCardSortBy,
    sortDirection: requireSortDirection as SortDirection,
    pageSize: requireCardAmount as CardAmount,
    cardDisplayMode: requireCardDisplayMode as CardDisplayMode,
  };
};

const compareSearchParams: (
  oldParams: DlcCardOverviewSearchParams,
  newParams: DlcCardOverviewSearchParams,
) => (keyof DlcCardOverviewSearchParams)[] = (oldParams, newParams) => {
  const changes: (keyof DlcCardOverviewSearchParams)[] = [];

  let moreParams = newParams;
  let otherParams = oldParams;
  if (Object.keys(newParams).length < Object.keys(oldParams).length) {
    moreParams = oldParams;
    otherParams = newParams;
  }

  for (const [key, value] of Object.entries(moreParams)) {
    const otherValue = otherParams[key as keyof DlcCardOverviewSearchParams];

    if (otherValue !== value) {
      changes.push(key as keyof DlcCardOverviewSearchParams);
    }
  }

  return changes;
};

function removeDefaults(params: DlcCardOverviewSearchParams) {
  const newParams = { ...params };

  if (newParams.query === '') {
    delete newParams.query;
  }
  if (newParams.page === 1) {
    delete newParams.page;
  }
  if (newParams.pageSize === cardAmountDefault) {
    delete newParams.pageSize;
  }
  if (newParams.sortBy === sortByDefault) {
    delete newParams.sortBy;
  }
  if (newParams.sortDirection === sortDirectionDefault) {
    delete newParams.sortDirection;
  }
  if (newParams.cardDisplayMode === cardDisplayModeDefault) {
    delete newParams.cardDisplayMode;
  }
  return newParams;
}

export type ApplyFn<T> = (prev: T) => T;

export const applyAndCleanup = (
  apply: ApplyFn<DlcCardOverviewSearchParams>,
  searchParams: DlcCardOverviewSearchParams,
): DlcCardOverviewSearchParams | null => {
  let newParams = apply(searchParams);
  const changes = compareSearchParams(searchParams, newParams);
  if (changes.length === 0) return null;
  newParams = removeDefaults(newParams);

  return newParams;
};
