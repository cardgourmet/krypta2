import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import type {ResolvedUserListResource} from '@/parcels/lists/types.ts';
import {createProps} from '@/parcels/overview/CardGrid/ImageCardWithSelection/createProps.ts';
import {ImageCard} from '@/parcels/overview/ImageCard/ImageCard.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

export function CardRenderer({ tcg, data }: { tcg: Tcg; data: ResolvedUserListResource }) {
  const card = data.resourceData as unknown as TcgDataCard;
  const prop = createProps(tcg, {
    card: card,
    preferredDisplayLanguage: 'en',
    preferredDisplayFaceIndex: 0,
  } as TcgSearchDataCard);

  return <ImageCard key={data.listResource.resourceId} tcg={tcg} prop={prop} style={{ height: '100%' }} />;
}
