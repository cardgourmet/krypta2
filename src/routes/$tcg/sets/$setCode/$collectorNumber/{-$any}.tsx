import { createFileRoute, notFound, stripSearchParams } from '@tanstack/react-router';
import { useMemo } from 'react';
import { cardDetailDefaults, cardDetailSearchSchema } from '@/parcels/details/CardDetailsSearch.ts';
import { loadTcgPrintAndSet } from '@/parcels/details/loadTcgPrintAndSet.ts';
import { TcgPrintDetails } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {
  constructDlcPageTitle,
  constructDlcPrintFaces,
  constructDlcPrintMeta,
  findDlcParamsByLanguage,
} from '@/parcels/tcg/dlc/details/renderer.tsx';
import {
  constructMtgPageTitle,
  constructMtgPrintFaces,
  constructMtgPrintMeta,
  findMtgParamsByLanguage,
} from '@/parcels/tcg/mtg/details/renderer.tsx';
import {
  constructPcgPageTitle,
  constructPcgPrintFaces,
  constructPcgPrintMeta,
  findPcgParamsByLanguage,
} from '@/parcels/tcg/pcg/details/renderer.tsx';
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
  const { tcg } = Route.useParams();

  const findParamsByLanguage = useMemo(() => {
    if (tcg === 'mtg') return findMtgParamsByLanguage;
    else if (tcg === 'dlc') return findDlcParamsByLanguage;
    return findPcgParamsByLanguage;
  }, [tcg]);
  const constructPageTitle = useMemo(() => {
    if (tcg === 'mtg') return constructMtgPageTitle;
    else if (tcg === 'dlc') return constructDlcPageTitle;
    return constructPcgPageTitle;
  }, [tcg]);
  const constructPrintFaces = useMemo(() => {
    if (tcg === 'mtg') return constructMtgPrintFaces;
    else if (tcg === 'dlc') return constructDlcPrintFaces;
    return constructPcgPrintFaces;
  }, [tcg]);
  const constructPrintMeta = useMemo(() => {
    if (tcg === 'mtg') return constructMtgPrintMeta;
    else if (tcg === 'dlc') return constructDlcPrintMeta;
    return constructPcgPrintMeta;
  }, [tcg]);

  return (
    <TcgPrintDetails
      findParamsByLanguage={findParamsByLanguage}
      constructPageTitle={constructPageTitle}
      constructPrintFaces={constructPrintFaces}
      constructPrintMeta={constructPrintMeta}
    />
  );
}
