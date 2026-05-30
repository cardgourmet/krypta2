import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router';
import z from 'zod';
import { CardOverview } from '@/parcels/overview/cards/CardOverview/CardOverview.tsx';
import { fetchSetByQuery } from '@/parcels/tcg/fetchSetByQuery.ts';
import {
  type DisplayMode,
  displayModes,
  type SortDirection,
  sortDirections,
  type TcgSortBy,
  type TcgUniqueBy,
  tcgSortBys,
  tcgUniqueBys,
} from '@/parcels/tcg/types.ts';

export const tcgSetParamsDefaults = {
  query: '',
  page: 1,
  sortDirection: 'auto' as SortDirection,
  display: 'grid' as DisplayMode,
  uniqueBy: 'prints' as TcgUniqueBy,
  sortBy: 'set' as TcgSortBy,
};
export const tcgSetParamsSchema = z.object({
  query: z.string().catch(tcgSetParamsDefaults.query),
  page: z.number().catch(tcgSetParamsDefaults.page),
  sortDirection: z.enum(sortDirections).catch(tcgSetParamsDefaults.sortDirection),
  display: z.enum(displayModes).catch(tcgSetParamsDefaults.display),
  uniqueBy: z.enum(tcgUniqueBys).catch(tcgSetParamsDefaults.uniqueBy),
  sortBy: z.enum(tcgSortBys).catch(tcgSetParamsDefaults.sortBy),
});

export const Route = createFileRoute('/$tcg/sets/$setCode/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
  loader: async ({ params }) => {
    const { tcg, setCode } = params;
    const query = `set="${setCode}"`;

    const setRes = await fetchSetByQuery(tcg, query);
    console.log(setRes);
    if (!setRes || !setRes.data || setRes.error) {
      throw notFound();
    }
    return setRes.data.set;
  },
  validateSearch: tcgSetParamsSchema,
  search: {
    middlewares: [stripSearchParams(tcgSetParamsDefaults)],
  },
});

function RouteComponent() {
  const set = Route.useLoaderData();

  return <CardOverview set={set} routeSearch={Route.useSearch()} />;
}
