export const calculateCardRange = (currentPage?: number, pageSize?: number): { from: number; to: number } => {
  if (!currentPage || !pageSize) return { from: 0, to: 0 };

  return {
    from: pageSize * (currentPage - 1) + 1,
    to: pageSize * currentPage,
  };
};
