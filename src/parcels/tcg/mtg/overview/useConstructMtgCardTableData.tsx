import { Group } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { type ReactElement, useCallback, useMemo } from 'react';
import { CursorImageHover } from '@/parcels/generic/CursorImageHover/CursorImageHover.tsx';
import { getImagesByTcgCard } from '@/parcels/generic/CursorImageHover/getImagesByTcgCard.ts';
import { slugify } from '@/parcels/slugify.ts';
import type { MtgDataCard, MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import { renderRichMtgText } from '@/parcels/tcg/mtg/renderRichMtgText.tsx';
import type { TcgCardTableData } from '@/parcels/tcg/types.ts';

export function useConstructMtgCardTableData(cardItems: MtgSearchDataCard[]) {
  const constructMtgTableData = useCallback((card: MtgDataCard) => {
    return {
      Set: <>{card.print.setCode}</>,
      Number: <>{card.print.collectorNumber}</>,
      Name: (
        <CursorImageHover images={getImagesByTcgCard('mtg', card)}>
          <Link
            to={`/$tcg/sets/$setCode/$collectorNumber/{-$any}`}
            params={{
              tcg: 'mtg',
              setCode: card.print.setCode?.toLowerCase() as string,
              collectorNumber: card.print.collectorNumber?.toLowerCase() as string,
              any: slugify(card.name ?? ''),
            }}
            preload={false}
          >
            <span title={card.name}>{card.name}</span>
          </Link>
        </CursorImageHover>
      ),
      Cost: (
        <Group wrap={'nowrap'} gap={'0'}>
          {renderRichMtgText(card.print.faces[0].manaDisplay ?? '')}
        </Group>
      ),
      Type: (
        <span title={card.print.faces[0].translations.en.typeLine}>{card.print.faces[0].translations.en.typeLine}</span>
      ),
      Rarity: <>{card.print.rarity}</>,
      Artist: <span title={card.print.artist ?? ''}>{card.print.artist}</span>,
    } as Record<string, ReactElement>;
  }, []);
  const mtgTableData = useMemo(() => {
    return {
      columns: ['Set', 'Number', 'Name', 'Cost', 'Type', 'Rarity', 'Artist'],
      colSizes: ['3.5', '5', 'auto', '8', 'auto', '6', 'auto'],
      rows:
        cardItems?.map((card, _) => {
          if (!('colorIdentity' in card.card)) return { card: card.card, data: [] };
          return {
            entry: card.card,
            data: constructMtgTableData(card.card as MtgDataCard),
          };
        }) ?? [],
    };
  }, [cardItems, constructMtgTableData]);

  return mtgTableData as TcgCardTableData;
}
