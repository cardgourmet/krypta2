import {
  type CardAmount,
  type CardDisplayMode,
  cardAmountDefault,
  cardDisplayModeDefault,
  type DlcCardOverviewParams,
  type DlcCardSortBy,
  isCardAmount,
  isCardDisplayMode,
  isDlcCardSortBy,
  isSortDirection,
  type SortDirection,
  sortByDefault,
  sortDirectionDefault,
} from './types.ts';

export const validateSearchParams = (search: Record<string, unknown>): DlcCardOverviewParams => {
  let requirePage = Number(search?.page ?? 1);
  if (requirePage <= 0) {
    requirePage = 1;
  }

  let requireSortBy = search?.sortBy as string | null;
  if (requireSortBy && !isDlcCardSortBy(requireSortBy)) {
    requireSortBy = null;
  }

  let requireSortDirection = search?.sortDirection as string | null;
  if (requireSortDirection && !isSortDirection(requireSortDirection)) {
    requireSortDirection = null;
  }

  let requireCardAmount: number | null = search?.pageSize ? Number(search?.pageSize ?? 1) : null;
  if (requireCardAmount && !isCardAmount(requireCardAmount)) {
    requireCardAmount = null;
  }

  let requireCardDisplayMode = search?.cardDisplayMode as string | null;
  if (requireCardDisplayMode && !isCardDisplayMode(requireCardDisplayMode)) {
    requireCardDisplayMode = null;
  }

  return {
    page: requirePage || 1,
    sortBy: (requireSortBy || sortByDefault) as DlcCardSortBy,
    sortDirection: (requireSortDirection || sortDirectionDefault) as SortDirection,
    pageSize: (requireCardAmount || cardAmountDefault) as CardAmount,
    cardDisplayMode: (requireCardDisplayMode || cardDisplayModeDefault) as CardDisplayMode,
  };
};
