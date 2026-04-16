import {createFileRoute, notFound, stripSearchParams} from '@tanstack/react-router';
import {CardOverview} from '@/parcels/overview/CardOverview/CardOverview.tsx';
import {getSetSpecificQuery} from '@/parcels/overview/getSetSpecificQuery.ts';
import {fetchSetByQuery} from '@/parcels/tcg/fetchSetByQuery.ts';
import {tcgSearchParamsDefaults, tcgSearchParamsSchema} from '@/parcels/tcg/types.ts';

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
  shouldReload: false, // only reload when `loaderDeps` change (i.e., the query)
  validateSearch: tcgSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(tcgSearchParamsDefaults)],
  },
});

function RouteComponent() {
  return <CardOverview />;
}
