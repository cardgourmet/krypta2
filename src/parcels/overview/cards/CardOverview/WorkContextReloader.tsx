import { useEffect } from 'react';
import { useTcgOverviewWorkStore } from '@/parcels/selection/useTcgOverviewWorkStore.ts';
import type { TcgSearchCardsResult } from '@/parcels/tcg/types.ts';

export function WorkContextReloader({ cards }: { cards: TcgSearchCardsResult | null }) {
  const setData = useTcgOverviewWorkStore((state) => state.setData);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!cards || !cards.data.details) return;
    const query = cards?.data.details?.originalQuery;
    setData(query, cards as TcgSearchCardsResult);
  }, [cards]);

  return (
    // biome-ignore lint/complexity/noUselessFragments: <>
    <></>
  );
}
