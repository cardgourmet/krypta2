export const calculateCardRange = (
  currentPage?: number,
  pageSize?: number,
  items?: number | undefined | null,
): { from: number; to: number } => {
  if (!currentPage || !pageSize) return { from: 0, to: 0 };
  let to = pageSize * currentPage;
  if (items && to > items) {
    to = items;
  }

  return {
    from: pageSize * (currentPage - 1) + 1,
    to: to,
  };
};
