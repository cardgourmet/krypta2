import { useCallback, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import type { TcgDataCard } from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {
  GourmetTable,
  type GourmetTableData,
  type GourmetTableDataRow,
} from '@/parcels/generic/GourmetTable/GourmetTable.tsx';
import { TableRowHorizontal } from '@/parcels/overview/cards/CardTable/TableRowHorizontal/TableRowHorizontal.tsx';
import { TableRowVertical } from '@/parcels/overview/cards/CardTable/TableRowHorizontal/TableRowVertical.tsx';
import type { DlcDataCard, DlcSearchCardsResult, DlcSearchDataCard } from '@/parcels/tcg/dlc/api.ts';
import { useConstructDlcCardTableData } from '@/parcels/tcg/dlc/overview/useConstructDlcCardTableData.tsx';
import type { MtgDataCard, MtgSearchCardsResult, MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import { useConstructMtgCardTableData } from '@/parcels/tcg/mtg/overview/useConstructMtgCardTableData.tsx';
import type { PcgDataCard, PcgSearchCardsResult, PcgSearchDataCard } from '@/parcels/tcg/pcg/api.ts';
import { useConstructPcgCardTableData } from '@/parcels/tcg/pcg/overview/useConstructPcgCardTableData.tsx';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';

type CardTableProps = {
  tcg: Tcg;
  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
  toolsEnabled: boolean;
};

export function CardTable({ tcg, cards, isLoading, toolsEnabled }: CardTableProps) {
  const { t } = useTranslation('cards', { keyPrefix: 'table.cols' });
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
  const mtgData = useConstructMtgCardTableData((cardItems ?? []) as MtgSearchDataCard[]);
  const dlcData = useConstructDlcCardTableData((cardItems ?? []) as DlcSearchDataCard[]);
  const pcgData = useConstructPcgCardTableData((cardItems ?? []) as PcgSearchDataCard[]);
  const tableData = useMemo(() => {
    let data: GourmetTableData<MtgDataCard | DlcDataCard | PcgDataCard> | null = null;
    if (tcg === 'mtg') data = mtgData as GourmetTableData<MtgDataCard | DlcDataCard | PcgDataCard>;
    else if (tcg === 'dlc') data = dlcData;
    else if (tcg === 'pcg') data = pcgData;

    if (!data) return null;
    return data;
  }, [mtgData, dlcData, pcgData, tcg]);

  const constructHorTableRow = useCallback(
    (row: GourmetTableDataRow<TcgDataCard>, index: number) => {
      return (
        <TableRowHorizontal
          key={`hor_${row.entry.print.id}`}
          card={row.entry}
          index={index}
          data={row.data}
          columns={tableData?.columns ?? []}
          toolsEnabled={toolsEnabled}
        />
      );
    },
    [tableData?.columns, toolsEnabled],
  );
  const constructVerTableRow = useCallback(
    (row: GourmetTableDataRow<TcgDataCard>, index: number) => {
      return (
        <TableRowVertical
          key={`ver_${row.entry.print.id}`}
          card={row.entry}
          index={index}
          data={row.data}
          columns={tableData?.columns ?? []}
          toolsEnabled={toolsEnabled}
        />
      );
    },
    [tableData?.columns, toolsEnabled],
  );

  return (
    <div>
      {tableData && (
        <GourmetTable
          t={t}
          isLoading={isLoading}
          tableData={tableData}
          constructHorTableRow={constructHorTableRow}
          constructVerTableRow={constructVerTableRow}
        />
      )}
    </div>
  );
}
