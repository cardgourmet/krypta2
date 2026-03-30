import type {DlcSearchDataCard} from "@/parcels/tcg/dlc/api.ts";
import type {MtgSearchDataCard} from "@/parcels/tcg/mtg/api.ts";
import type {PcgSearchDataCard} from "@/parcels/tcg/pcg/api.ts";
import type {TcgSearchDataCard} from "@/parcels/tcg/types.ts";
import type {Tcg} from "@/parcels/tcg/useTcgByLocation.ts";

export type CardProperties = {
  id: string;
  name?: string;
  thumbnailUrl?: string;
  backfaceThumbnailUrl?: string;
  backupImageUrl: string;

  setCode?: string;
  collectorNumber?: string;
};

const backupImageUrl = 'https://f.2by.es/mox_cigarettes';

export const createProps = (tcg: Tcg, card: TcgSearchDataCard) => {
  if (tcg === 'dlc') {
    const dlcCard = card as DlcSearchDataCard;

    return {
      id: dlcCard.card.print.id,
      name: dlcCard.card.name,
      thumbnailUrl: dlcCard.card.print.translations?.en?.imageUrls?.thumbnail ?? '',
      backfaceThumbnailUrl: undefined,
      backupImageUrl: backupImageUrl,
      setCode: dlcCard.card.print.setCode,
      collectorNumber: dlcCard.card.print.collectorNumber,
    };
  } else if (tcg === 'pcg') {
    const pcgCard = card as PcgSearchDataCard;

    return {
      id: pcgCard.card.print.id,
      name: pcgCard.card.name,
      thumbnailUrl: pcgCard.card.print.translations?.en?.imageUrls?.thumbnail ?? '',
      backfaceThumbnailUrl: undefined,
      backupImageUrl: backupImageUrl,
      setCode: pcgCard.card.print.setCode ?? undefined,
      collectorNumber: pcgCard.card.print.collectorNumber,
    };
  } else if (tcg === 'mtg') {
    const mtgCard = card as MtgSearchDataCard;
    const frontFace = mtgCard?.card?.print?.faces?.[0]?.translations?.en;
    const backFace = mtgCard?.card?.print?.faces?.[1]?.translations?.en;

    return {
      id: mtgCard.card.print.id,
      name: mtgCard.card.name,
      thumbnailUrl: frontFace?.imageUrls?.thumbnail ?? frontFace?.imageUrls?.full ?? '',
      backfaceThumbnailUrl: backFace?.imageUrls?.thumbnail ?? backFace?.imageUrls?.full ?? undefined,
      backupImageUrl: backupImageUrl,
      setCode: mtgCard.card.print.setCode,
      collectorNumber: mtgCard.card.print.collectorNumber,
    };
  }
  return {} as CardProperties;
};
