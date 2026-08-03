import { SimpleGrid } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import CardGridEntry from '@/parcels/overview/cards/CardGrid/CardGridEntry/CardGridEntry.tsx';
import { CardGridSelectionOverlay } from '@/parcels/selection/OverviewSelectionDisplay/CardGridSelectionOverlay.tsx';
import type { DlcSearchCardsUser } from '@/parcels/tcg/dlc/api.ts';
import { shouldBeRotated } from '@/parcels/tcg/helpers.ts';
import type { MtgSearchCardsUser, MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgSearchCardsUser, PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { TcgSearchCardsUser, TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type CardGridProps = {
  tcg: Tcg;
  cards: TcgSearchCardsUser | null | undefined;
  isLoading: boolean;
  toolsEnabled: boolean;
};

export function CardGrid({ tcg, cards, isLoading, toolsEnabled }: CardGridProps) {
  const cardItems: TcgSearchDataCard[] | null = useMemo(() => {
    if (!cards) return null;

    if (tcg === 'dlc') {
      return (cards as DlcSearchCardsUser).items;
    } else if (tcg === 'pcg') {
      return (cards as PcgSearchCardsUser).items as PcgSearchDataCard[];
    } else if (tcg === 'mtg') {
      return (cards as MtgSearchCardsUser).items as MtgSearchDataCard[];
    }
    return null;
  }, [tcg, cards]);

  const isRotated = useMemo(() => {
    return cardItems?.every((v) => shouldBeRotated(tcg, v.card)) ?? false;
  }, [tcg, cardItems]);

  const cardElements = useMemo(() => {
    return (
      cardItems?.map((card, index) => {
        return (
          <CardGridEntry
            key={`grid_${index}_${card.card.print.id}`}
            tcg={tcg}
            card={card}
            index={index}
            toolsEnabled={toolsEnabled}
            rotated={isRotated}
          />
        );
      }) ?? []
    );
  }, [cardItems, tcg, toolsEnabled, isRotated]);

  const screen0 = useMediaQuery('(max-width: 1110px)');
  const screen1 = useMediaQuery('(max-width: 930px)');
  const screen2 = useMediaQuery('(max-width: 750px)');
  const screen3 = useMediaQuery('(max-width: 565px)');

  const cols = useMemo(() => {
    if (isRotated) {
      if (screen3) return 1;
      else if (screen2) return 2;
      else if (screen0) return 3;
      else return 4;
    } else {
      if (screen3) return 2;
      else if (screen2) return 3;
      else if (screen1) return 4;
      else if (screen0) return 5;
      else return 6;
    }
  }, [isRotated, screen0, screen1, screen2, screen3]);

  return (
    <SimpleGrid cols={cols} spacing={isRotated ? '1rem' : '1rem'} verticalSpacing={'1rem'}>
      {isLoading
        && Array(60)
          .fill(0)
          .map((_, i) => (
            <div key={i}>
              <Skeleton
                baseColor={'var(--gourmet-neutral-4)'}
                highlightColor={'var(--gourmet-neutral-5)'}
                height={isRotated ? undefined : '100%'}
                width={isRotated ? '100%' : undefined}
                style={{ borderRadius: '15px', aspectRatio: isRotated ? 936 / 672 : 672 / 936 }}
              />
            </div>
          ))}
      {!isLoading && cardElements}

      <CardGridSelectionOverlay />
    </SimpleGrid>
  );
}
