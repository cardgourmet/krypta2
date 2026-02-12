import {cardDetailDefaults, cardDetailSearchSchema} from "@/parcels/details/CardDetailsSearch.ts";
import {loadTcgPrintAndSet} from "@/parcels/details/loadTcgPrintAndSet.ts";
import {TcgPrintDetails} from "@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx";
import {createFileRoute, stripSearchParams} from "@tanstack/react-router";
import {constructDlcPageTitle, constructDlcPrintFaces, constructDlcPrintMeta, findDlcParamsByLanguage} from "@/parcels/tcg/dlc/details/renderer.tsx";

export const Route = createFileRoute('/dlc/sets/$setCode/$collectorNumber/{-$any}')({
  component: RouteComponent,
  validateSearch: cardDetailSearchSchema,
  search: {
    middlewares: [stripSearchParams(cardDetailDefaults)],
  },
  loader: async ({params}) => {
    return loadTcgPrintAndSet('dlc', params);
  },
});

function RouteComponent() {
  return (
    <TcgPrintDetails
      findParamsByLanguage={findDlcParamsByLanguage}
      constructPageTitle={constructDlcPageTitle}
      constructPrintFaces={constructDlcPrintFaces}
      constructPrintMeta={constructDlcPrintMeta}
    />
  )
}
