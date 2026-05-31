import { Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import type { DlcDataCard, DlcDataSet } from '@/parcels/tcg/dlc/api.ts';
import { DlcPrintMetaRenderer } from '@/parcels/tcg/dlc/details/DlcPrintMetaRenderer/DlcPrintMetaRenderer.tsx';
import type { MtgDataCard, MtgDataSet } from '@/parcels/tcg/mtg/api.ts';
import { MtgPrintMetaRenderer } from '@/parcels/tcg/mtg/details/MtgPrintMetaRenderer/MtgPrintMetaRenderer.tsx';
import type { PcgDataCard, PcgDataSet } from '@/parcels/tcg/pcg/api.ts';
import { PcgPrintMetaRenderer } from '@/parcels/tcg/pcg/details/PcgPrintMetaRenderer/PcgPrintMetaRenderer.tsx';
import type { TcgDataCard, TcgDataSet } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function TcgPrintMeta({
  tcg,
  card,
  set,
  lang,
  setLang,
}: {
  tcg: Tcg;
  card: TcgDataCard;
  set: TcgDataSet;
  lang: string;
  setLang: (lang: string, _: string) => void;
}) {
  const renderer = useMemo(() => {
    if (tcg === 'mtg') {
      const cardWithPrints = card as MtgDataCard;

      return (
        <MtgPrintMetaRenderer
          card={cardWithPrints}
          print={cardWithPrints.print}
          set={set as MtgDataSet}
          language={lang}
          setLanguage={setLang}
        />
      );
    } else if (tcg === 'pcg') {
      const cardWithPrints = card as PcgDataCard;

      return (
        <PcgPrintMetaRenderer
          card={cardWithPrints}
          print={cardWithPrints.print}
          set={set as PcgDataSet}
          language={lang}
          setLanguage={setLang}
        />
      );
    } else if (tcg === 'dlc') {
      const cardWithPrints = card as DlcDataCard;

      return (
        <DlcPrintMetaRenderer
          card={cardWithPrints}
          print={cardWithPrints.print}
          set={set as DlcDataSet}
          language={lang}
          setLanguage={setLang}
        />
      );
    }
  }, [card, lang, set, setLang, tcg]);

  const smallScreen = useMediaQuery('(max-width: 950px)');
  return (
    <Group
      align={'start'}
      ml={smallScreen ? '' : 'auto'}
      maw={smallScreen ? '' : '16rem'}
      miw={'19rem'}
      mih={'32rem'}
      w={smallScreen ? '100%' : ''}
      justify={smallScreen ? 'center' : 'start'}
    >
      {renderer}
    </Group>
  );
}
