import { useEffect } from 'react';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import type { TcgDataSet, TcgSearchCardsUser, TcgSearchDataCard } from '@/parcels/tcg/types.ts';

export function WorkContextReloader({ cards, set }: { cards: TcgSearchCardsUser | null; set?: TcgDataSet }) {
  const setData = useOverviewWorkStore((state) => state.setData);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!cards || !cards.details) return;
    const query = cards.details?.explain?.originalQuery ?? '';

    const data = cards as TcgSearchCardsUser;

    setData({
      page: data.currentPage,
      rawElements: data.items.map((e) => ({ id: e.card.print.id, element: e as TcgSearchDataCard })),
      other: {
        query: query,
        set: set,
      },
    });
  }, [cards]);

  return (
    // biome-ignore lint/complexity/noUselessFragments: <>
    <></>
  );
}
