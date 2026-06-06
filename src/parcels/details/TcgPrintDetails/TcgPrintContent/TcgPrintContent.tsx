import { Group, Pill, SimpleGrid, Stack, UnstyledButton } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { type ReactElement, useMemo } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import type { DlcDataCard } from '@/parcels/tcg/dlc/api.ts';
import { DlcPrintContentRenderer } from '@/parcels/tcg/dlc/details/DlcPrintContentRenderer/DlcPrintContentRenderer.tsx';
import type { MtgDataCard } from '@/parcels/tcg/mtg/api.ts';
import { MtgPrintFaceContentRenderer } from '@/parcels/tcg/mtg/details/MtgPrintFaceContentRenderer.tsx';
import type { PcgDataCard } from '@/parcels/tcg/pcg/api.ts';
import { PcgPrintContentRenderer } from '@/parcels/tcg/pcg/details/PcgPrintContentRenderer/PcgPrintContentRenderer.tsx';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './TcgPrintContent.module.css';

export function TcgPrintContent({ tcg, card }: { tcg: Tcg; card: TcgDataCard }) {
  const facesCount = useMemo(() => {
    let faces = 1;
    if (tcg === 'mtg') {
      faces = (card as MtgDataCard).print.faces.length;
    }

    return faces;
  }, [card, tcg]);

  const renderer = useMemo(() => {
    if (tcg === 'mtg') {
      const cardWithPrints = card as MtgDataCard;

      const elements: ReactElement[] = [];
      for (const face of cardWithPrints.print.faces) {
        elements.push(<MtgPrintFaceContentRenderer key={face.id} print={face} />);
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
  const mechanicTags = useMemo(() => {
    if (tcg === 'mtg') {
      const cardWithPrints = card as MtgDataCard;

      return cardWithPrints.print.faces[0].mechanicTags ?? [];
    } else if (tcg === 'pcg') {
      const cardWithPrints = card as PcgDataCard;

      return cardWithPrints.print.mechanicTags ?? [];
    } else if (tcg === 'dlc') {
      const cardWithPrints = card as DlcDataCard;

      return cardWithPrints.print.mechanicTags ?? [];
    }

    return [];
  }, [card, tcg]);

  const smallerScreen = useMediaQuery('(max-width: 1110px)');
  return (
    <Stack>
      <SimpleGrid cols={smallerScreen || facesCount === 1 ? 1 : 2}>
        {renderer.map((e, index) => {
          return (
            <Group
              key={index}
              p={'0.5rem 1rem'}
              align={'start'}
              style={{
                maxWidth: !smallerScreen && facesCount === 1 ? '26rem' : undefined,
              }}
            >
              {e}
            </Group>
          );
        })}
      </SimpleGrid>

      <Stack p={'0 0.5rem'}>
        <Group gap={'0.25rem'}>
          {mechanicTags.map((m) => {
            return (
              <UnstyledButton key={m} className={styles.mechanicPill}>
                <Pill>
                  <GourmetText cgmff={'ui'} fz={'0.9rem'}>
                    {m}
                  </GourmetText>
                </Pill>
              </UnstyledButton>
            );
          })}
        </Group>
      </Stack>
    </Stack>
  );
}
