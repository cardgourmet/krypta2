import {createFileRoute, stripSearchParams} from '@tanstack/react-router';
import {cardDetailDefaults, cardDetailSearchSchema,} from '@/parcels/details/CardDetailsSearch.ts';
import {loadTcgPrintAndSet} from '@/parcels/details/loadTcgPrintAndSet.ts';
import {TcgPrintDetails} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {constructMtgPageTitle, constructMtgPrintFaces, constructMtgPrintMeta, findMtgParamsByLanguage} from "@/parcels/tcg/mtg/details/renderer.tsx";

export const Route = createFileRoute('/mtg/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  validateSearch: cardDetailSearchSchema,
  search: {
    middlewares: [stripSearchParams(cardDetailDefaults)],
  },
  loader: async ({params}) => {
    return loadTcgPrintAndSet('mtg', params);
  },
});

function RouteComponent() {
  return (
    <TcgPrintDetails
      findParamsByLanguage={findMtgParamsByLanguage}
      constructPageTitle={constructMtgPageTitle}
      constructPrintFaces={constructMtgPrintFaces}
      constructPrintMeta={constructMtgPrintMeta}
    />
  )
}
