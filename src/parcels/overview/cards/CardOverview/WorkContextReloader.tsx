import { useEffect } from 'react';
import { useTcgOverviewWorkStore } from '@/parcels/selection/useTcgOverviewWorkStore.ts';
import type { TcgSearchCardsResult, TcgSearchDataCard } from '@/parcels/tcg/types.ts';

export function WorkContextReloader({ cards }: { cards: TcgSearchCardsResult | null }) {
  const setData = useTcgOverviewWorkStore((state) => state.setData);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!cards || !cards.data.details) return;
    const query = cards?.data.details?.originalQuery;

    const data = cards as TcgSearchCardsResult;

    setData({
      page: data.data.currentPage,
      rawElements: data.data.items.map((e) => ({ id: e.card.print.id, element: e as TcgSearchDataCard })),
      other: {
        query: query,
      },
    });
  }, [cards]);

  return (
    // biome-ignore lint/complexity/noUselessFragments: <>
    <></>
  );
}
