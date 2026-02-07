import 'react-loading-skeleton/dist/skeleton.css';
import {createFileRoute, stripSearchParams, useNavigate} from '@tanstack/react-router';
import {constructCardOverview} from "@/parcels/tcg/constructCardOverview.tsx";
import {useDlcMemoizedDisplaySettings, useDlcMemoizedQuerySettings} from '@/parcels/tcg/dlc/query.ts';
import {
  type DlcSearchDisplaySettings,
  type DlcSearchParams,
  dlcSearchParamsDefaults,
  dlcSearchParamsSchema,
  type DlcSearchQuerySettings,
} from '@/parcels/tcg/dlc/types.ts';

export const Route = createFileRoute('/dlc/cards/')({
  component: DlcCardsOverview,
  validateSearch: dlcSearchParamsSchema,
  search: {
    middlewares: [stripSearchParams(dlcSearchParamsDefaults)],
  },
});

function DlcCardsOverview() {
  const searchParams = Route.useSearch() as DlcSearchParams;
  const searchQuerySettings: DlcSearchQuerySettings = useDlcMemoizedQuerySettings();
  const searchDisplaySettings: DlcSearchDisplaySettings = useDlcMemoizedDisplaySettings();
  const navigate = useNavigate({ from: Route.fullPath });

  return constructCardOverview(searchParams, searchQuerySettings, searchDisplaySettings, navigate);
}
