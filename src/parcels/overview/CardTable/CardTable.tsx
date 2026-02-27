import { useMediaQuery } from '@mantine/hooks';
import { useMemo } from 'react';
import type { TcgDataCard } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import { TableRowHorizontal } from '@/parcels/overview/CardTable/TableRowHorizontal/TableRowHorizontal.tsx';
import { TableRowVertical } from '@/parcels/overview/CardTable/TableRowHorizontal/TableRowVertical.tsx';
import type { DlcSearchCardsResult, DlcSearchDataCard } from '@/parcels/tcg/dlc/api.ts';
import { constructDlcCardTableData } from '@/parcels/tcg/dlc/overview/constructDlcCardTableData.tsx';
import type { MtgSearchCardsResult, MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import { constructMtgCardTableData } from '@/parcels/tcg/mtg/overview/constructMtgCardTableData.tsx';
import type { PcgSearchCardsResult, PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import { constructPcgCardTableData } from '@/parcels/tcg/pcg/overview/constructPcgCardTableData.tsx';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './CardTable.module.css';

type CardTableProps = {
  tcg: Tcg;
  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
  toolsEnabled: boolean;
};

export function CardTable({ tcg, cards, isLoading, toolsEnabled }: CardTableProps) {
  const smallScreen = useMediaQuery('(max-width: 800px)');
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

  const mtgData = constructMtgCardTableData((cardItems ?? []) as MtgSearchDataCard[]);
  const dlcData = constructDlcCardTableData((cardItems ?? []) as DlcSearchDataCard[]);
  const pcgData = constructPcgCardTableData((cardItems ?? []) as PcgSearchDataCard[]);
  const tableData = useMemo(() => {
    if (tcg === 'mtg') return mtgData;
    else if (tcg === 'dlc') return dlcData;
    else if (tcg === 'pcg') return pcgData;
    return null;
  }, [mtgData, dlcData, pcgData, tcg]);

  return (
    <div>
      {!smallScreen && (
        <table className={styles.table} style={{ tableLayout: 'fixed' }}>
          <thead style={{ position: 'sticky', zIndex: 'var(--sticky-layer)' }}>
            <tr>
              <th>{''}</th>
              {tableData?.columns.map((column, index) => {
                const size = tableData?.colSizes?.[index];
                const sizeRem = size ? (size === 'auto' ? 'auto' : `${size}rem`) : '';

                return (
                  <th key={column} style={{ width: sizeRem }}>
                    {column}
                  </th>
                );
              })}
              <th>{''}</th>
            </tr>
          </thead>
          <tbody>
            {!isLoading
              && (tableData?.rows?.length ?? 0) > 0
              && tableData?.rows.map(({ card, data }, index) => {
                return (
                  <TableRowHorizontal
                    key={card.id}
                    card={card as TcgDataCard}
                    index={index}
                    data={data}
                    columns={tableData?.columns ?? []}
                    toolsEnabled={toolsEnabled}
                  />
                );
              })}
          </tbody>
        </table>
      )}
      {smallScreen && (
        <table className={styles.table}>
          <tbody>
            {!isLoading
              && (tableData?.rows?.length ?? 0) > 0
              && tableData?.rows.map(({ card, data }, index) => (
                <>
                  <TableRowVertical
                    card={card}
                    data={data}
                    columns={tableData?.columns ?? []}
                    index={index}
                    toolsEnabled={toolsEnabled}
                  />
                </>
              ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
