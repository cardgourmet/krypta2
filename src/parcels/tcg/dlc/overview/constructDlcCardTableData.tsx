import {Link} from '@tanstack/react-router';
import {type ReactElement, useCallback, useMemo} from 'react';
import {slugify} from '@/parcels/slugify.ts';
import type {DlcDataCard, DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import {DlcInkSymbolSVG} from '@/parcels/tcg/dlc/details/DlcInkSymbolSVG.tsx';
import type {TcgCardTableData} from '@/parcels/tcg/types.ts';

export function constructDlcCardTableData(cardItems: DlcSearchDataCard[]) {
  const constructDlcTableData = useCallback((card: DlcDataCard) => {
    return {
      Set: <>{card.print.setCode}</>,
      Number: <>{card.print.collectorNumber}</>,
      Name: (
        <Link
          to={`/$tcg/sets/$setCode/$collectorNumber/{-$any}`}
          params={{
            tcg: 'dlc',
            setCode: card.print.setCode?.toLowerCase() as string,
            collectorNumber: card.print.collectorNumber?.toLowerCase() as string,
            any: slugify(card.name ?? ''),
          }}
          preload={false}
        >
          {card.name}
        </Link>
      ),
      Ink: (
        <>
          {card.inkTypes.map((i) => (
            <DlcInkSymbolSVG key={i} symbol={i} size={32} />
          ))}
        </>
      ),
      Cost: <>{card.cost}</>,
      Type: <>{card.type}</>,
      Rarity: <>{card.print.rarity}</>,
      Artist: <>{card.print.artist}</>,
    } as Record<string, ReactElement>;
  }, []);
  const dlcTableData = useMemo(() => {
    return {
      columns: ['Set', 'Number', 'Name', 'Ink', 'Cost', 'Type', 'Rarity', 'Artist'],
      rows:
        cardItems?.map((card, _) => {
          if (!('inkTypes' in card.card)) return { card: card.card, data: [] };

          return {
            card: card.card,
            data: constructDlcTableData(card.card as DlcDataCard),
          };
        }) ?? [],
    };
  }, [cardItems, constructDlcTableData]);

  return dlcTableData as TcgCardTableData;
}
