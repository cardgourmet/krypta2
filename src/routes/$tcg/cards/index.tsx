import {createFileRoute, notFound, stripSearchParams, useNavigate} from '@tanstack/react-router';
import {useMemo} from 'react';
import type {GourmetApiResponse} from '@/parcels/api/handleApiCall.ts';
import type {TcgDataSet} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {constructCardOverview, getSetSpecificQuery} from '@/parcels/overview/CardOverview/constructCardOverview.tsx';
import {fetchDlcCards, fetchDlcSet} from '@/parcels/tcg/dlc/api.ts';
import {useDlcMemoizedDisplaySettings, useDlcMemoizedQuerySettings} from '@/parcels/tcg/dlc/query.ts';
import type {DlcSearchParams, DlcSearchQuerySettings} from '@/parcels/tcg/dlc/types.ts';
import {fetchMtgCards, fetchMtgSet} from '@/parcels/tcg/mtg/api.ts';
import {useMtgMemoizedDisplaySettings, useMtgMemoizedQuerySettings} from '@/parcels/tcg/mtg/query.ts';
import type {MtgSearchParams, MtgSearchQuerySettings} from '@/parcels/tcg/mtg/types.ts';
import {fetchPcgCards, fetchPcgSet} from '@/parcels/tcg/pcg/api.ts';
import {usePcgMemoizedDisplaySettings, usePcgMemoizedQuerySettings} from '@/parcels/tcg/pcg/query.ts';
import type {PcgSearchParams, PcgSearchQuerySettings} from '@/parcels/tcg/pcg/types.ts';
import {type TcgSearchCards, tcgSearchParamsDefaults, tcgSearchParamsSchema, tcgSetSearchParamsSchema,} from '@/parcels/tcg/types.ts';

export const Route = createFileRoute('/$tcg/cards/')({
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return { query: search.query };
  },
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound();
  },
  loader: async ({ deps, params }) => {
    const setFilter = getSetSpecificQuery(deps.query);
    if (!setFilter) return null;

    const { tcg } = params;

    // TODO: endpoint to get set by any identifier (anything that goes with `set=`) instead
    const setRes = await fetchSetByQuery(tcg, deps.query);
    if (!setRes || setRes.error) return null;

    return setRes.data ?? null;
  },
  validateSearch: (search: Record<string, unknown>) => {
    const isSetSpecific = Boolean(search.query && getSetSpecificQuery(search.query as string));
    const schema = isSetSpecific ? tcgSetSearchParamsSchema : tcgSearchParamsSchema;
    return schema.parse(search);
  },
  search: {
    middlewares: [stripSearchParams(tcgSearchParamsDefaults)],
  },
});

function RouteComponent() {
  const { tcg } = Route.useParams();
  const search = Route.useSearch();
  const loaderData = Route.useLoaderData() as TcgDataSet | null;

  const searchParams = useMemo(() => {
    if (tcg === 'mtg') return search as MtgSearchParams;
    else if (tcg === 'dlc') return search as DlcSearchParams;
    return search as PcgSearchParams;
  }, [tcg, search]);

  const dlcQuerySettings = useDlcMemoizedQuerySettings();
  const mtgQuerySettings = useMtgMemoizedQuerySettings();
  const pcgQuerySettings = usePcgMemoizedQuerySettings();
  const searchQuerySettings = useMemo(() => {
    if (tcg === 'mtg') return mtgQuerySettings;
    else if (tcg === 'dlc') return dlcQuerySettings;
    return pcgQuerySettings;
  }, [tcg, dlcQuerySettings, mtgQuerySettings, pcgQuerySettings]) as
    | MtgSearchQuerySettings
    | DlcSearchQuerySettings
    | PcgSearchQuerySettings;

  const dlcDisplaySettings = useDlcMemoizedDisplaySettings();
  const mtgDisplaySettings = useMtgMemoizedDisplaySettings();
  const pcgDisplaySettings = usePcgMemoizedDisplaySettings();
  const searchDisplaySettings = useMemo(() => {
    if (tcg === 'mtg') return mtgDisplaySettings;
    else if (tcg === 'dlc') return dlcDisplaySettings;
    return pcgDisplaySettings;
  }, [tcg, mtgDisplaySettings, dlcDisplaySettings, pcgDisplaySettings]);

  const navigate = useNavigate({ from: Route.fullPath });

  return constructCardOverview(searchParams, searchQuerySettings, searchDisplaySettings, navigate, loaderData);
}

// makes a normal query request and get the first set id
async function fetchSetByQuery(tcg: string, query: string): Promise<GourmetApiResponse<TcgDataSet> | null> {
  const setFilter = getSetSpecificQuery(query);
  if (!setFilter) return null;

  const searchQuerySettings = {
    query: query,
    page: 1,
    sortDirection: 'desc',
    uniqueBy: 'cards',
    sortBy: 'name',
  };
  let data: GourmetApiResponse<TcgSearchCards>;
  if (tcg === 'mtg') {
    data = await fetchMtgCards(searchQuerySettings as MtgSearchQuerySettings, undefined, 1);
  } else if (tcg === 'pcg') {
    data = await fetchPcgCards(searchQuerySettings as PcgSearchQuerySettings, undefined, 1);
  } else {
    data = await fetchDlcCards(searchQuerySettings as DlcSearchQuerySettings, undefined, 1);
  }

  const setId = data?.data?.items[0]?.card?.print?.setId;
  if (!setId) return null;

  let set: GourmetApiResponse<TcgDataSet> | null = null;
  if (tcg === 'mtg') {
    set = await fetchMtgSet(setId);
  } else if (tcg === 'pcg') {
    set = await fetchPcgSet(setId);
  } else if (tcg === 'dlc') {
    set = await fetchDlcSet(setId);
  }

  return set;
}
