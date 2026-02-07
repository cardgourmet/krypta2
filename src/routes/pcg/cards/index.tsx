import 'react-loading-skeleton/dist/skeleton.css';
import {createFileRoute, stripSearchParams, useNavigate} from '@tanstack/react-router';
import {constructCardOverview} from '@/parcels/overview/CardOverview/constructCardOverview.tsx';
import {usePcgMemoizedDisplaySettings, usePcgMemoizedQuerySettings} from '@/parcels/tcg/pcg/query.ts';
import {
  type PcgSearchDisplaySettings,
  type PcgSearchParams,
  pcgSearchParamsDefaults,
  pcgSearchParamsSchema,
  type PcgSearchQuerySettings,
} from '@/parcels/tcg/pcg/types.ts';

export const Route = createFileRoute('/pcg/cards/')({
  component: PcgCardsOverview,
  validateSearch: pcgSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(pcgSearchParamsDefaults)],
  },
});

function PcgCardsOverview() {
  const searchParams = Route.useSearch() as PcgSearchParams;
  const searchQuerySettings: PcgSearchQuerySettings = usePcgMemoizedQuerySettings();
  const searchDisplaySettings: PcgSearchDisplaySettings = usePcgMemoizedDisplaySettings();
  const navigate = useNavigate({ from: Route.fullPath });

  return constructCardOverview(searchParams, searchQuerySettings, searchDisplaySettings, navigate);
}
