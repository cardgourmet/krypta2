import {useMemo} from 'react';
import {useDlcMemoizedDisplaySettings, useDlcMemoizedQuerySettings} from '@/parcels/tcg/dlc/query.ts';
import {useMtgMemoizedDisplaySettings, useMtgMemoizedQuerySettings} from '@/parcels/tcg/mtg/query.ts';
import {usePcgMemoizedDisplaySettings, usePcgMemoizedQuerySettings} from '@/parcels/tcg/pcg/query.ts';
import type {TcgSearchDisplaySettings, TcgSearchParams, TcgSearchQuerySettings} from '@/parcels/tcg/types.ts';
import {Route} from '@/routes/$tcg/cards';

export function useTcgSearchSettings() {
  const { tcg } = Route.useParams();
  const search = Route.useSearch();

  const searchParams = useMemo(() => {
    return search as TcgSearchParams;
  }, [search]);

  const dlcQuerySettings = useDlcMemoizedQuerySettings();
  const mtgQuerySettings = useMtgMemoizedQuerySettings();
  const pcgQuerySettings = usePcgMemoizedQuerySettings();
  const searchQuerySettings = useMemo(() => {
    if (tcg === 'mtg') return mtgQuerySettings;
    else if (tcg === 'dlc') return dlcQuerySettings;
    return pcgQuerySettings;
  }, [tcg, dlcQuerySettings, mtgQuerySettings, pcgQuerySettings]) as TcgSearchQuerySettings;

  const dlcDisplaySettings = useDlcMemoizedDisplaySettings();
  const mtgDisplaySettings = useMtgMemoizedDisplaySettings();
  const pcgDisplaySettings = usePcgMemoizedDisplaySettings();
  const searchDisplaySettings = useMemo(() => {
    if (tcg === 'mtg') return mtgDisplaySettings;
    else if (tcg === 'dlc') return dlcDisplaySettings;
    return pcgDisplaySettings;
  }, [tcg, mtgDisplaySettings, dlcDisplaySettings, pcgDisplaySettings]) as TcgSearchDisplaySettings;

  return {
    params: searchParams,
    querySettings: searchQuerySettings,
    displaySettings: searchDisplaySettings,
  };
}
