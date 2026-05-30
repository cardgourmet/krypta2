import { Group, SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { type ReactElement, useMemo } from 'react';
import type { DlcDataCard } from '@/parcels/tcg/dlc/api.ts';
import { DlcPrintContentRenderer } from '@/parcels/tcg/dlc/details/DlcPrintContentRenderer/DlcPrintContentRenderer.tsx';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import { MtgPrintFaceContentRenderer } from '@/parcels/tcg/mtg/details/MtgPrintFaceContentRenderer.tsx';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
import { PcgPrintContentRenderer } from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentRenderer.tsx';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

export function TcgPrintContent({ tcg, card }: { tcg: Tcg; card: TcgDataCard }) {
  const renderer = useMemo(() => {
    if (tcg === 'mtg') {
      const cardWithPrints = card as MtgDataCard;

      const elements: ReactElement[] = [];
      for (const face of cardWithPrints.print.faces) {
        elements.push(
          <MtgPrintFaceContentRenderer print={face} maw={'26rem'} miw={'16rem'} align={'start'} gap={'lg'} p={'sm'} />,
        );
      }
      return elements;
    } else if (tcg === 'pcg') {
      const cardWithPrints = card as PcgDataCard;

      return [<PcgPrintContentRenderer key={card.id} card={cardWithPrints} print={cardWithPrints.print} />];
    } else if (tcg === 'dlc') {
      const cardWithPrints = card as DlcDataCard;

      return [<DlcPrintContentRenderer key={card.id} card={cardWithPrints} print={cardWithPrints.print} />];
    }

    return [];
  }, [tcg, card]);

  const smallerScreen = useMediaQuery('(max-width: 1110px)');
  return (
    <SimpleGrid cols={smallerScreen ? 1 : 2}>
      {renderer.map((e, index) => {
        return (
          <Group
            key={index}
            p={'sm'}
            align={'start'} /* maw={'26rem'} miw={'16rem'} align={'start'} gap={'lg'} p={'sm'}*/
          >
            {e}
          </Group>
        );
      })}
    </SimpleGrid>
  );
}
