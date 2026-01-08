/*export const compareSearchParams2: (oldParams: DlcCardOverviewParams, newParams: DlcCardOverviewParams) => string[] = (
  oldParams,
  newParams,
) => {
  const changes: string[] = [];

  let moreParams = newParams;
  let otherParams = oldParams;
});*/

export const compareSearchParams: (oldParams: URLSearchParams, newParams: URLSearchParams) => string[] = (
  oldParams,
  newParams,
) => {
  const changes: string[] = [];

  let moreParams = newParams;
  let otherParams = oldParams;
  if (newParams.size < oldParams.size) {
    moreParams = oldParams;
    otherParams = newParams;
  }

  for (const [key, value] of moreParams.entries()) {
    const otherValue = otherParams.get(key);

    if (otherValue !== value) {
      changes.push(key);
    }
  }

  return changes;
};
