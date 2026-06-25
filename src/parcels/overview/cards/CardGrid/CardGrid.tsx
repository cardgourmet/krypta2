import { SimpleGrid } from '@mantine/core';
import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import CardGridEntry from '@/parcels/overview/cards/CardGrid/CardGridEntry/CardGridEntry.tsx';
import { CardGridSelectionOverlay } from '@/parcels/selection/OverviewSelectionDisplay/CardGridSelectionOverlay.tsx';
import type { DlcSearchCardsResult } from '@/parcels/tcg/dlc/api.ts';
import type { MtgSearchCardsResult, MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { PcgSearchCardsResult, PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './CardGrid.module.css';

type CardGridProps = {
  tcg: Tcg;
  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
  toolsEnabled: boolean;
};

export function CardGrid({ tcg, cards, isLoading, toolsEnabled }: CardGridProps) {
  const cardItems: TcgSearchDataCard[] | null = useMemo(() => {
    if (!cards) return null;

    if (tcg === 'dlc') {
      return (cards as DlcSearchCardsResult).data.items;
    } else if (tcg === 'pcg') {
      return (cards as PcgSearchCardsResult).data.items as PcgSearchDataCard[];
    } else if (tcg === 'mtg') {
      return (cards as MtgSearchCardsResult).data.items as MtgSearchDataCard[];
    }
    return null;
  }, [tcg, cards]);

  const isRotated = tcg === 'mtg';
  const cardElements = useMemo(() => {
    return (
      cardItems?.map((card, index) => {
        const entry = (
          <CardGridEntry
            key={`grid_${index}_${card.card.print.id}`}
            tcg={tcg}
            card={card}
            index={index}
            toolsEnabled={toolsEnabled}
            rotated={isRotated}
          />
        );

        if (isRotated) {
          return (
            <div key={entry.key} className={styles.cardRotateWrapper}>
              {entry}
            </div>
          );
        }
        return entry;
      }) ?? []
    );
  }, [cardItems, tcg, toolsEnabled, isRotated]);

  return (
    <SimpleGrid cols={isRotated ? 4 : 6} spacing={isRotated ? '1rem' : '1rem'} verticalSpacing={'1rem'}>
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
