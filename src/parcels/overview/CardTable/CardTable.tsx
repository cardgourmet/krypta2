import {useMediaQuery} from '@mantine/hooks';
import {useMemo} from 'react';
import type {DlcSearchCardsResult, DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import {constructDlcCardTableData} from '@/parcels/tcg/dlc/overview/constructDlcCardTableData.tsx';
import type {MtgSearchCardsResult, MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import {constructMtgCardTableData} from '@/parcels/tcg/mtg/overview/constructMtgCardTableData.tsx';
import type {PcgSearchCardsResult, PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import {constructPcgCardTableData} from '@/parcels/tcg/pcg/overview/constructPcgCardTableData.tsx';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './CardTable.module.css';

type CardTableProps = {
  tcg: Tcg;
  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
};

export function CardTable({ tcg, cards, isLoading }: CardTableProps) {
  const smallScreen = useMediaQuery('(max-width: 800px)');
  const cardItems: MtgSearchDataCard[] | DlcSearchDataCard[] | PcgSearchDataCard[] | null = useMemo(() => {
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
    <>
      {!smallScreen && (
        <table className={styles.table}>
          <thead>
            <tr>
              {tableData?.columns.map((column) => (
                <th key={column}>{column}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {!isLoading
              && (tableData?.rows?.length ?? 0) > 0
              && tableData?.rows.map(({ card, data }) => {
                return (
                  <tr key={card.print.id}>
                    {tableData.columns.map((column) => (
                      <td key={column}>{data[column]}</td>
                    ))}
                  </tr>
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
              && tableData?.rows.map(({ card, data }) => (
                <>
                  {tableData?.columns.map((column, index) => (
                    <tr
                      key={`${card.print.id}_${column}`}
                      data-cell={index === tableData?.columns.length - 1 ? 'last' : 'not-last'}
                    >
                      <th>{column}</th>
                      <td>{data[column]}</td>
                    </tr>
                  ))}
                </>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}
