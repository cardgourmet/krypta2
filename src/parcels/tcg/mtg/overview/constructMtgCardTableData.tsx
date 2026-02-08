import {Link} from '@tanstack/react-router';
import {type ReactElement, useCallback, useMemo} from 'react';
import {slugify} from '@/parcels/slugify.ts';
import type {MtgDataCard, MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import {renderRichText} from '@/parcels/tcg/mtg/renderRichText.tsx';
import type {TcgCardTableData} from '@/parcels/tcg/types.ts';

export function constructMtgCardTableData(cardItems: MtgSearchDataCard[]) {
  const constructMtgTableData = useCallback((card: MtgDataCard) => {
    return {
      Set: <>{card.print.setCode}</>,
      Number: <>{card.print.collectorNumber}</>,
      Name: (
        <Link
          to={`/mtg/sets/$setCode/$collectorNumber/{-$any}`}
          params={{
            setCode: card.print.setCode?.toLowerCase() as string,
            collectorNumber: card.print.collectorNumber?.toLowerCase() as string,
            any: slugify(card.name ?? ''),
          }}
        >
          {card.name}
        </Link>
      ),
      Cost: <>{renderRichText(card.print.faces[0].manaDisplay ?? '')}</>,
      Type: <>{card.print.faces[0].translations.en.typeLine}</>,
      Rarity: <>{card.print.rarity}</>,
      Artist: <>{card.print.artist}</>,
    } as Record<string, ReactElement>;
  }, []);
  const mtgTableData = useMemo(() => {
    return {
      columns: ['Set', 'Number', 'Name', 'Cost', 'Type', 'Rarity', 'Artist'],
      rows:
        cardItems?.map((card, _) => {
          if (!('colorIdentity' in card.card)) return { card: card.card, data: [] };
          return {
            card: card.card,
            data: constructMtgTableData(card.card as MtgDataCard),
          };
        }) ?? [],
    };
  }, [cardItems, constructMtgTableData]);

  return mtgTableData as TcgCardTableData;
}
