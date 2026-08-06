import { useEffect } from 'react';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import type { TcgDataSet, TcgSearchCardsUser, TcgSearchDataCard, TcgSearchQuerySettings } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function useWorkContextReloader({
  tcg,
  settings,
  cards,
  set,
}: {
  tcg?: Tcg;
  settings?: TcgSearchQuerySettings;
  cards: TcgSearchCardsUser | null;
  set?: TcgDataSet;
}) {
  const setData = useOverviewWorkStore((state) => state.setData);

  // biome-ignore lint/correctness/useExhaustiveDependencies: <>
  useEffect(() => {
    if (!cards || !cards.details || !settings || !tcg) return;
    const data = cards as TcgSearchCardsUser;

    setData({
      page: data.currentPage,
      rawElements: data.items.map((e) => ({ id: e.card.print.id, element: e as TcgSearchDataCard })),
      other: {
        querySettings: settings,
        set: set,
        tcg: tcg,
        maxPage: data.pageCount,
      },
    });
  }, [cards]);
}
