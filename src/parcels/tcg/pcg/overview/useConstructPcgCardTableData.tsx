import { Group, Tooltip } from '@mantine/core';
import { Link } from '@tanstack/react-router';
import { type ReactElement, useCallback, useMemo } from 'react';
import { CursorImageHover } from '@/parcels/generic/CursorImageHover/CursorImageHover.tsx';
import { getImagesByTcgCard } from '@/parcels/generic/CursorImageHover/getImagesByTcgCard.ts';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { slugify } from '@/parcels/slugify.ts';
import type { PcgDataCard, PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import { PcgSymbolSVG } from '@/parcels/tcg/pcg/details/PcgSymbolSVG.tsx';
import type { TcgCardTableData } from '@/parcels/tcg/types.ts';

export function useConstructPcgCardTableData(cardItems: PcgSearchDataCard[]) {
  const constructPcgTableData = useCallback((card: PcgDataCard) => {
    return {
      Set: (
        <Tooltip label={card.print.setCode} openDelay={500}>
          <GourmetText cgmc={'neutral-9'}>{card.print.setCode}</GourmetText>
        </Tooltip>
      ),
      Number: (
        <Tooltip label={card.print.collectorNumber} openDelay={500}>
          <GourmetText cgmc={'neutral-9'}>{card.print.collectorNumber}</GourmetText>
        </Tooltip>
      ),
      Name: (
        <CursorImageHover images={getImagesByTcgCard('pcg', card)}>
          <Link
            to={`/$tcg/sets/$setCode/$collectorNumber/{-$any}`}
            params={{
              tcg: 'pcg',
              setCode: card.print.setCode?.toLowerCase() as string,
              collectorNumber: card.print.collectorNumber?.toLowerCase() as string,
              any: slugify(card.name ?? ''),
            }}
            preload={false}
          >
            {card.name}
          </Link>
        </CursorImageHover>
      ),
      Energy: (
        <Group align={'center'}>
          {card.types.map((s) => (
            <PcgSymbolSVG key={s} symbol={s} size={20} />
          ))}
        </Group>
      ),
      Rarity: <>{card.print.rarity}</>,
      Artist: <>{card.print.illustrators}</>,
    } as Record<string, ReactElement>;
  }, []);
  const pcgTableData = useMemo(() => {
    return {
      columns: ['Set', 'Number', 'Name', 'Energy', 'Rarity', 'Artist'],
      colSizes: ['3.5', '5', 'auto', '6', '18', 'auto'],
      rows:
        cardItems?.map((card, _) => {
          if (!('superType' in card.card)) return { card: card.card, data: [] };

          return {
            entry: card.card,
            data: constructPcgTableData(card.card as PcgDataCard),
          };
        }) ?? [],
    };
  }, [cardItems, constructPcgTableData]);

  return pcgTableData as TcgCardTableData;
}
