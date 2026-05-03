import type {TcgOverviewWorkData} from '@/parcels/selection/TcgOverviewWorkContext/TcgOverviewWorkContext.tsx';

export function getIdsInRange(anchorIndex: number, currentIndex: number, data: TcgOverviewWorkData): string[] {
  const fromIndex = anchorIndex < currentIndex ? anchorIndex : currentIndex;
  const toIndex = anchorIndex < currentIndex ? currentIndex : anchorIndex;

  const ids = [] as string[];
  data.search.result.data.items.forEach((item, index) => {
    if (index >= fromIndex && index <= toIndex) {
      ids.push(item.card.print.id);
    }
  });

  return ids;
}
