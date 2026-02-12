import {createFileRoute, stripSearchParams} from '@tanstack/react-router';
import {cardDetailDefaults, cardDetailSearchSchema} from '@/parcels/details/CardDetailsSearch.ts';
import {loadTcgPrintAndSet} from '@/parcels/details/loadTcgPrintAndSet.ts';
import {TcgPrintDetails} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {constructPcgPageTitle, constructPcgPrintFaces, constructPcgPrintMeta, findPcgParamsByLanguage,} from '@/parcels/tcg/pcg/details/renderer.tsx';

export const Route = createFileRoute('/pcg/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  validateSearch: cardDetailSearchSchema,
  search: {
    middlewares: [stripSearchParams(cardDetailDefaults)],
  },
  loader: async ({ params }) => {
    return loadTcgPrintAndSet('pcg', params);
  },
});

function RouteComponent() {
  return (
    <TcgPrintDetails
      findParamsByLanguage={findPcgParamsByLanguage}
      constructPageTitle={constructPcgPageTitle}
      constructPrintFaces={constructPcgPrintFaces}
      constructPrintMeta={constructPcgPrintMeta}
    />
  );
}
