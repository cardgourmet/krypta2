import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import type {ResolvedUserListResource} from '@/parcels/lists/types.ts';
import {createProps} from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import {ImageCard} from '@/parcels/overview/cards/ImageCard/ImageCard.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function RendererCardResources({ resources }: { resources: ResolvedUserListResource[] }) {
  return (
    <>
      {resources.map((resource) => {
        const data = resource.resourceData as unknown as TcgDataCard;
        const cardTcg = resource.listResource.game as Tcg;

        const prop = createProps(cardTcg, {
          card: data,
          preferredDisplayLanguage: 'en',
          preferredDisplayFaceIndex: 0,
        } as TcgSearchDataCard);

        return (
          <ImageCard key={resource.listResource.resourceId} tcg={cardTcg} prop={prop} style={{ height: '100%' }} />
        );
      })}
    </>
  );
}
