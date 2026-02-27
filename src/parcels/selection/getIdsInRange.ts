import type {TcgOverviewWorkSpace} from "@/parcels/selection/TcgOverviewWorkContext.tsx";

export function getIdsInRange(anchorIndex: number, currentIndex: number, workContext: TcgOverviewWorkSpace): string[] {
  const fromIndex = anchorIndex < currentIndex ? anchorIndex : currentIndex;
  const toIndex = anchorIndex < currentIndex ? currentIndex : anchorIndex;

  const ids = [] as string[];
  workContext.data.search.result.data.items.forEach((item, index) => {
    if (index >= fromIndex && index <= toIndex) {
      ids.push(item.card.id);
    }
  });

  return ids;
}
