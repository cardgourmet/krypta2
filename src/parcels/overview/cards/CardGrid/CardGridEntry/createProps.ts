import type { DlcSearchDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export type CardProperties = {
  id: string;
  name?: string;
  thumbnailUrl?: string;
  backfaceThumbnailUrl?: string;
  cropUrl?: string;
  backupImageUrl: string;

  setCode?: string;
  collectorNumber?: string;

  printTranslationId?: string; // main one, so "en"
};

// const backupImageUrl = 'https://f.2by.es/mox_cigarettes';
export const backupImageUrl = 'https://f.2by.es/gMQJc';
export const errorBackupImageUrl = 'https://f.2by.es/FqV7Z';

export const createProps = (tcg: Tcg, card: TcgSearchDataCard) => {
  const preferredLanguage = card.preferredDisplayLanguage;
  const preferredIndex = card.preferredDisplayFaceIndex ?? 0;

  if (tcg === 'dlc') {
    const dlcCard = card as DlcSearchDataCard;

    return {
      id: dlcCard.card.print.id,
      name: dlcCard.card.name,
      thumbnailUrl: dlcCard.card.print.translations?.[preferredLanguage]?.imageUrls?.thumbnail ?? '',
      backfaceThumbnailUrl: undefined,
      cropUrl: dlcCard.card.print.translations?.[preferredLanguage]?.imageUrls?.artCrop ?? '',
      backupImageUrl: backupImageUrl,
      setCode: dlcCard.card.print.setCode,
      collectorNumber: dlcCard.card.print.collectorNumber,
      printTranslationId:
        dlcCard.card.print.translations?.[preferredLanguage]?.id ?? dlcCard.card.print.translations?.en?.id,
    };
  } else if (tcg === 'pcg') {
    const pcgCard = card as PcgSearchDataCard;

    return {
      id: pcgCard.card.print.id,
      name: pcgCard.card.name,
      thumbnailUrl: pcgCard.card.print.translations?.[preferredLanguage]?.imageUrls?.thumbnail ?? '',
      backfaceThumbnailUrl: undefined,
      cropUrl: pcgCard.card.print.translations?.[preferredLanguage]?.imageUrls?.artCrop ?? '',
      backupImageUrl: backupImageUrl,
      setCode: pcgCard.card.print.setCode ?? undefined,
      collectorNumber: pcgCard.card.print.collectorNumber,
      printTranslationId:
        pcgCard.card.print.translations?.[preferredLanguage]?.id ?? pcgCard.card.print.translations?.en?.id,
    };
  } else if (tcg === 'mtg') {
    const frontIndex = preferredIndex;
    const backIndex = preferredIndex === 0 ? 1 : 0;

    const mtgCard = card as MtgSearchDataCard;
    const frontTranslations = mtgCard?.card?.print?.faces?.[frontIndex]?.translations;
    const backTranslations = mtgCard?.card?.print?.faces?.[backIndex]?.translations;

    const frontFace = frontTranslations?.[preferredLanguage] ?? frontTranslations?.en;
    const backFace = backTranslations?.[preferredLanguage] ?? backTranslations?.en;
    return {
      id: mtgCard.card.print.id,
      name: mtgCard.card.name,
      thumbnailUrl: frontFace?.imageUrls?.thumbnail ?? frontFace?.imageUrls?.full ?? '',
      backfaceThumbnailUrl: backFace?.imageUrls?.thumbnail ?? backFace?.imageUrls?.full ?? undefined,
      cropUrl: frontFace?.imageUrls?.thumbnail ?? frontFace?.imageUrls?.artCrop ?? '',
      backupImageUrl: backupImageUrl,
      setCode: mtgCard.card.print.setCode,
      collectorNumber: mtgCard.card.print.collectorNumber,
      printTranslationId: frontFace.id,
    };
  }
  return {} as CardProperties;
};
