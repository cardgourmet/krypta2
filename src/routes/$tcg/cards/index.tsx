import {createFileRoute, notFound, stripSearchParams, useNavigate} from '@tanstack/react-router';
import {useMemo} from 'react';
import {constructCardOverview, getSetSpecificQuery} from '@/parcels/overview/CardOverview/constructCardOverview.tsx';
import {useDlcMemoizedDisplaySettings, useDlcMemoizedQuerySettings} from '@/parcels/tcg/dlc/query.ts';
import type {DlcSearchParams, DlcSearchQuerySettings} from '@/parcels/tcg/dlc/types.ts';
import {useMtgMemoizedDisplaySettings, useMtgMemoizedQuerySettings} from '@/parcels/tcg/mtg/query.ts';
import type {MtgSearchParams, MtgSearchQuerySettings} from '@/parcels/tcg/mtg/types.ts';
import {usePcgMemoizedDisplaySettings, usePcgMemoizedQuerySettings} from '@/parcels/tcg/pcg/query.ts';
import type {PcgSearchParams, PcgSearchQuerySettings} from '@/parcels/tcg/pcg/types.ts';
import {tcgSearchParamsDefaults, tcgSearchParamsSchema, tcgSetSearchParamsSchema} from '@/parcels/tcg/types.ts';

export const Route = createFileRoute('/$tcg/cards/')({
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return { query: search.query };
  },
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound();
  },
  loader: ({ deps }) => {
    const setFilter = getSetSpecificQuery(deps.query);
    if (!setFilter) return null;

    // TODO: also switch to default "show prints" and "sort by set"
    // TODO: endpoint to get set by any identifier (anything that goes with `set=`)
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

  return constructCardOverview(searchParams, searchQuerySettings, searchDisplaySettings, navigate);
}
