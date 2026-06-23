import { createFileRoute, notFound, redirect, stripSearchParams } from '@tanstack/react-router';
import { CardOverview } from '@/parcels/overview/cards/CardOverview/CardOverview.tsx';
import { queryContainsSetFilter } from '@/parcels/overview/cards/queryContainsSetFilter.ts';
import { fetchSetByQuery } from '@/parcels/tcg/fetchSetByQuery.ts';
import { tcgSearchParamsDefaults, tcgSearchParamsSchema } from '@/parcels/tcg/types.ts';
import { tcgSetParamsDefaults } from '@/routes/$tcg/sets/$setCode';

export const Route = createFileRoute('/$tcg/cards/')({
  component: RouteComponent,
  loaderDeps: ({ search }) => {
    return { query: search.query };
  },
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
  loader: async ({ deps, params }) => {
    const setFilter = queryContainsSetFilter(deps.query);
    if (!setFilter) return null;

    const { tcg } = params;
    const setRes = await fetchSetByQuery(tcg, deps.query);
    if (!setRes || setRes.error) return null;
    if (!setRes?.data?.set?.code) return null;

    // only redirect if the query _only_ contains set filter
    if ((setRes.data.explain?.filters?.length ?? 0) !== 1) return null;

    throw redirect({
      to: '/$tcg/sets/$setCode',
      search: { ...tcgSetParamsDefaults },
      params: {
        tcg: params.tcg,
        setCode: setRes.data.set.code!,
      },
      replace: true,
    });
  },
  shouldReload: false, // only reload when `loaderDeps` change (i.e., the query)
  validateSearch: tcgSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(tcgSearchParamsDefaults)],
  },
});

function RouteComponent() {
  return <CardOverview routeSearch={Route.useSearch()} />;
}
