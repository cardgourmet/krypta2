import {createFileRoute, stripSearchParams, useNavigate} from '@tanstack/react-router';
import {constructCardOverview} from '@/parcels/overview/CardOverview/constructCardOverview.tsx';
import {useMtgMemoizedDisplaySettings, useMtgMemoizedQuerySettings} from '@/parcels/tcg/mtg/query.ts';
import {type MtgSearchParams, mtgSearchParamsDefaults, mtgSearchParamsSchema} from '@/parcels/tcg/mtg/types.ts';

export const Route = createFileRoute('/mtg/cards/')({
  component: MtgCardsOverview,
  validateSearch: mtgSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(mtgSearchParamsDefaults)],
  },
});

function MtgCardsOverview() {
  const searchParams = Route.useSearch() as MtgSearchParams;
  const searchQuerySettings = useMtgMemoizedQuerySettings();
  const searchDisplaySettings = useMtgMemoizedDisplaySettings();
  const navigate = useNavigate({ from: Route.fullPath });

  return constructCardOverview(searchParams, searchQuerySettings, searchDisplaySettings, navigate);
}
