export default function calculatePages(
  currentPage: number,
  lastPage: number,
  displayAround: number,
): Array<number | null> {
  const arr: Array<number | null> = [];
  if (displayAround < 0) return arr;
  if (currentPage < 1 || currentPage > lastPage) return arr;

  // +3 = first, last and current always shown
  if (lastPage <= displayAround * 2 + 3) {
    for (let i = 1; i <= lastPage; i++) {
      arr.push(i);
    }
    return arr;
  }

  arr.push(1); // first page always shown
  if (currentPage - displayAround > 1 + 1) {
    arr.push(null);
  }
  for (let i = displayAround; i > 0; i--) {
    const n = Math.abs(currentPage - i);
    if (arr.includes(n)) continue;
    if (n <= 1) continue;

    arr.push(n);
  }
  if (!arr.includes(currentPage)) {
    arr.push(currentPage);
  }
  for (let i = 0; i < displayAround; i++) {
    const n = Math.abs(currentPage + (i + 1));
    if (arr.includes(n)) continue;
    if (n >= lastPage) continue;
    arr.push(n);
  }
  if (currentPage + displayAround < lastPage - 1) {
    arr.push(null);
  }
  if (currentPage !== lastPage) {
    arr.push(lastPage);
  }
  return arr;
}
