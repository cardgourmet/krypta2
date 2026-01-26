import { useMemo } from 'react';
import Skeleton from 'react-loading-skeleton';
import ImageCard from '@/parcels/overview/ImageCard/ImageCard.tsx';
import type { DlcSearchCardsResult, DlcSearchDataCard } from '@/parcels/tcg/dlc/api.ts';
import type { PcgSearchCardsResult, PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './CardGrid.module.css';

type CardGridProps = {
  tcg: Tcg;
  cards: DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
};

export function CardGrid({ tcg, cards, isLoading }: CardGridProps) {
  const cardItems: DlcSearchDataCard[] | PcgSearchDataCard[] | null = useMemo(() => {
    if (!cards) return null;

    if (tcg === 'dlc') {
      return (cards as DlcSearchCardsResult).data.items;
    } else if (tcg === 'pcg') {
      return (cards as PcgSearchCardsResult).data.items as PcgSearchDataCard[];
    }
    return null;
  }, [tcg, cards]);

  return (
    <div className={styles.cardsOverview}>
      {isLoading
        && Array(60)
          .fill(0)
          .map((_, i) => (
            <div key={i} className={styles.card}>
              <Skeleton
                baseColor={'var(--gourmet-neutral-4)'}
                highlightColor={'var(--gourmet-neutral-5)'}
                height={'100%'}
                style={{ borderRadius: '15px', aspectRatio: 672 / 936 }}
              />
            </div>
          ))}
      {!isLoading && cardItems && cardItems.map((card, index) => <ImageCard key={index} tcg={tcg} card={card} />)}
    </div>
  );
}
