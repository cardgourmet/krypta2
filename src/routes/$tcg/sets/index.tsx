import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router';
import type { GourmetApiResponse } from '@/parcels/api/handleApiCall.tsx';
import { SetsOverview } from '@/parcels/overview/sets/SetsOverview.tsx';
import { fetchDlcSets } from '@/parcels/tcg/dlc/api.ts';
import { fetchMtgSets } from '@/parcels/tcg/mtg/api.ts';
import { fetchPcgEras, fetchPcgSets, type PcgDataEras } from '@/parcels/tcg/pcg/api.ts';
import { type TcgDataSets, tcgSetsParamsDefaults, tcgSetsParamsSchema } from '@/parcels/tcg/types.ts';

export const Route = createFileRoute('/$tcg/sets/')({
  component: RouteComponent,
  beforeLoad: ({ params }) => {
    const allowed = ['mtg', 'dlc', 'pcg'];
    if (!allowed.includes(params.tcg)) throw notFound({ data: { tcg: params.tcg } });
  },
  loader: async ({ params }) => {
    let res: GourmetApiResponse<TcgDataSets> | undefined;
    if (params.tcg === 'mtg') {
      res = await fetchMtgSets();
    } else if (params.tcg === 'pcg') {
      res = await fetchPcgSets();
    } else if (params.tcg === 'dlc') {
      res = await fetchDlcSets();
    }

    let erasRes: GourmetApiResponse<PcgDataEras> | undefined;
    if (params.tcg === 'pcg') {
      erasRes = await fetchPcgEras();
    }
    return { setsRes: res, erasRes: erasRes };
  },
  validateSearch: tcgSetsParamsSchema,
  search: {
    middlewares: [stripSearchParams(tcgSetsParamsDefaults)],
  },
});

function RouteComponent() {
  return <SetsOverview />;
}
