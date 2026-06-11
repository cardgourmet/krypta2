import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router';
import { cardDetailDefaults, cardDetailSearchSchema } from '@/parcels/details/CardDetailsSearch.ts';
import { loadTcgPrintAndSet } from '@/parcels/details/loadTcgPrintAndSet.ts';
import { TcgPrintDetails } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export const Route = createFileRoute('/$tcg/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  validateSearch: cardDetailSearchSchema,
  search: {
    middlewares: [stripSearchParams(cardDetailDefaults)],
  },
  loader: async ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });

    return loadTcgPrintAndSet(params.tcg as Tcg, params);
  },
});

function RouteComponent() {
  return <TcgPrintDetails />;
}
