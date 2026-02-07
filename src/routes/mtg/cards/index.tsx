import { createFileRoute, stripSearchParams, useNavigate } from '@tanstack/react-router';
import { useEffect, useEffectEvent, useMemo, useRef, useState } from 'react';
import { CardOverview } from '@/parcels/overview/CardOverview/CardOverview.tsx';
import { useSearchHistory } from '@/parcels/search/bar/SearchHistoryProvider/SearchHistoryProvider.tsx';
import type { DlcSearchParams } from '@/parcels/tcg/dlc/types.ts';
import { fetchMtgCards, type MtgSearchCardsResult } from '@/parcels/tcg/mtg/api.ts';
import { useMtgMemoizedDisplaySettings, useMtgMemoizedQuerySettings } from '@/parcels/tcg/mtg/query.ts';
import { type MtgSearchParams, mtgSearchParamsDefaults, mtgSearchParamsSchema } from '@/parcels/tcg/mtg/types.ts';
import type { PcgSearchParams } from '@/parcels/tcg/pcg/types.ts';
import { type Tcg, useTcgByLocation } from '@/parcels/tcg/useTcgByLocation.ts';
import type { ApplyFn } from '@/parcels/types.ts';
import { usePrevious } from '@/parcels/usePrevious.ts';

export const Route = createFileRoute('/mtg/cards/')({
  component: MtgCardsOverview,
  validateSearch: mtgSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(mtgSearchParamsDefaults)],
  },
});

function MtgCardsOverview() {
  const tcg = useTcgByLocation() as Tcg;
  const searchParams = Route.useSearch() as MtgSearchParams;
  const searchQuerySettings = useMtgMemoizedQuerySettings();
  const prevSearchQuerySettings = usePrevious(searchQuerySettings);
  const searchDisplaySettings = useMtgMemoizedDisplaySettings();
  const [cards, setCards] = useState<MtgSearchCardsResult | null>(null);

  const navigate = useNavigate({ from: Route.fullPath });
  const history = useSearchHistory(tcg);
  const [isLoading, setIsLoading] = useState(true);
  const [isQueryLoading, setIsQueryLoading] = useState(true);
  const scrollBackRef = useRef<HTMLDivElement | null>(null);

  const setSettings = (apply: ApplyFn<MtgSearchParams | PcgSearchParams | DlcSearchParams>) => {
    const newParams = apply(searchParams) as Required<MtgSearchParams>;

    // noinspection JSIgnoredPromiseFromCall
    navigate({
      search: () => ({ ...newParams }),
      replace: true,
    });
  };

  const onQueryChange = useEffectEvent((query: string) => {
    history?.addQuery(query);
  });

  const isSetSpecific = useMemo(() => {
    const setCodeOrName = getSetSpecificQuery(searchQuerySettings.query);
    return setCodeOrName !== null;
  }, [searchQuerySettings.query]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: it's only prevQuerySettings
  useEffect(() => {
    // TODO: if query is set specific: query set beforehand
    // => if it doesn't exist, ignore.
    // => if it does: make a set query instead and return ALL cards
    //    (but what about sets like SLD? with 2300 cards)

    if (searchQuerySettings.query !== prevSearchQuerySettings?.query) {
      setIsQueryLoading(true);
    }
    setIsLoading(true);

    const controller = new AbortController();
    fetchMtgCards(searchQuerySettings, controller).then(({ query, data, error }) => {
      if (error !== undefined) {
        // non 200 status basically
        return;
      }

      // write to history
      if (query.query !== undefined) {
        onQueryChange(query.query);
      }
      setCards(data as MtgSearchCardsResult);

      setIsLoading(false);
      setIsQueryLoading(false);
    });

    return () => {
      controller.abort();
    };
  }, [searchQuerySettings]);

  return (
    <CardOverview
      tcg={tcg}
      scrollbackRef={scrollBackRef}
      isLoading={isLoading}
      isQueryLoading={isQueryLoading}
      isSetSpecific={isSetSpecific}
      cards={cards}
      setSettings={setSettings}
      searchQuerySettings={searchQuerySettings}
      searchDisplaySettings={searchDisplaySettings}
    />
  );
}

function getSetSpecificQuery(query: string): string | null {
  const allowedFilters = ['set', 'setcode', 'setname'];
  let allowed = false;
  for (const allowedFilter of allowedFilters) {
    if (query.startsWith(allowedFilter)) {
      allowed = true;
      break;
    }
  }
  if (!allowed) return null;

  const spl = query.split(/[:=]/);
  if (spl.length !== 2) return null;

  let value = spl[1];
  if (value.startsWith('"')) value = value.substring(1);
  if (value.endsWith('"')) value = value.substring(0, value.length - 1);
  return value.trim();
}
