import { Flex, Group } from '@mantine/core';
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
      const frontFace = cardWithPrints.print.faces[0];
      const backFace = cardWithPrints.print.faces[1];

      const elements: ReactElement[] = [];
      elements.push(
        <MtgPrintFaceContentRenderer
          print={frontFace}
          maw={'26rem'}
          miw={'16rem'}
          align={'start'}
          gap={'lg'}
          p={'sm'}
        />,
      );
      if (backFace) {
        elements.push(
          <MtgPrintFaceContentRenderer
            print={backFace}
            maw={'26rem'}
            miw={'16rem'}
            align={'start'}
            gap={'lg'}
            p={'sm'}
          />,
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
  const smallScreen = useMediaQuery('(max-width: 950px)');
  return (
    <Flex
      align={smallScreen ? 'center' : 'start'}
      wrap={'nowrap'}
      style={{ flexShrink: 10_000 }}
      direction={smallerScreen ? 'column' : 'row'}
      w={smallScreen ? '100%' : ''}
    >
      {renderer.map((e, index) => {
        return (
          <Group key={index} maw={'26rem'} miw={'16rem'} align={'start'} gap={'lg'} p={'sm'}>
            {e}
          </Group>
        );
      })}
    </Flex>
  );
}
