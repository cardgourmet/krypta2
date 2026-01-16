import {
  type CardAmount,
  type CardDisplayMode,
  cardAmountDefault,
  cardDisplayModeDefault,
  isCardAmount,
  isCardDisplayMode,
  isSortDirection,
  type SortDirection,
  sortDirectionDefault,
} from '@/parcels/overview/types.ts';
import {
  type DlcCardSearchParams,
  type DlcCardSortBy,
  isDlcCardSortBy,
  sortByDefault,
} from '@/parcels/tcg/dlc/types.ts';

export const dlcValidateSearchParams = (search: Record<string, unknown>): DlcCardSearchParams => {
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

const dlcCompareSearchParams: (
  oldParams: DlcCardSearchParams,
  newParams: DlcCardSearchParams,
) => (keyof DlcCardSearchParams)[] = (oldParams, newParams) => {
  const changes: (keyof DlcCardSearchParams)[] = [];

  let moreParams = newParams;
  let otherParams = oldParams;
  if (Object.keys(newParams).length < Object.keys(oldParams).length) {
    moreParams = oldParams;
    otherParams = newParams;
  }

  for (const [key, value] of Object.entries(moreParams)) {
    const otherValue = otherParams[key as keyof DlcCardSearchParams];

    if (otherValue !== value) {
      changes.push(key as keyof DlcCardSearchParams);
    }
  }

  return changes;
};

function dlcRemoveDefaults(params: DlcCardSearchParams) {
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

export const dlcApplyAndCleanup = (
  apply: ApplyFn<DlcCardSearchParams>,
  searchParams: DlcCardSearchParams,
): DlcCardSearchParams | null => {
  let newParams = apply(searchParams);
  const changes = dlcCompareSearchParams(searchParams, newParams);
  if (changes.length === 0) return null;
  newParams = dlcRemoveDefaults(newParams);

  return newParams;
};
