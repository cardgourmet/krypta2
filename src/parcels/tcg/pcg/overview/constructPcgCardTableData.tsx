import {Link} from '@tanstack/react-router';
import {type ReactElement, useCallback, useMemo} from 'react';
import {slugify} from '@/parcels/slugify.ts';
import type {PcgDataCard, PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import type {TcgCardTableData} from '@/parcels/tcg/types.ts';

export function constructPcgCardTableData(cardItems: PcgSearchDataCard[]) {
  const constructPcgTableData = useCallback((card: PcgDataCard) => {
    return {
      Set: <>{card.print.setCode}</>,
      Number: <>{card.print.collectorNumber}</>,
      Name: (
        <Link
          to={`/pcg/sets/$setCode/$collectorNumber/{-$any}`}
          params={{
            setCode: card.print.setCode?.toLowerCase() as string,
            collectorNumber: card.print.collectorNumber?.toLowerCase() as string,
            any: slugify(card.name ?? ''),
          }}
        >
          {card.name}
        </Link>
      ),
      Cost: <>{card.retreatCost}</>,
      Type: <>{card.superType}</>,
      Rarity: <>{card.print.rarity}</>,
      Artist: <>{card.print.illustrators}</>,
    } as Record<string, ReactElement>;
  }, []);
  const pcgTableData = useMemo(() => {
    return {
      columns: ['Set', 'Number', 'Name', 'Cost', 'Type', 'Rarity', 'Artist'],
      rows:
        cardItems?.map((card, _) => {
          if (!('superType' in card.card)) return { card: card.card, data: [] };

          return {
            card: card.card,
            data: constructPcgTableData(card.card as PcgDataCard),
          };
        }) ?? [],
    };
  }, [cardItems, constructPcgTableData]);

  return pcgTableData as TcgCardTableData;
}
