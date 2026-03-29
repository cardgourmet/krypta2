import {useMemo} from 'react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {TableRowHorizontal} from '@/parcels/overview/CardTable/TableRowHorizontal/TableRowHorizontal.tsx';
import {TableRowVertical} from '@/parcels/overview/CardTable/TableRowHorizontal/TableRowVertical.tsx';
import {GourmetTable, type GourmetTableData} from '@/parcels/overview/GourmetTable/GourmetTable.tsx';
import type {DlcDataCard, DlcSearchCardsResult, DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import {constructDlcCardTableData} from '@/parcels/tcg/dlc/overview/constructDlcCardTableData.tsx';
import type {MtgDataCard, MtgSearchCardsResult, MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import {constructMtgCardTableData} from '@/parcels/tcg/mtg/overview/constructMtgCardTableData.tsx';
import type {PcgDataCard, PcgSearchCardsResult, PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import {constructPcgCardTableData} from '@/parcels/tcg/pcg/overview/constructPcgCardTableData.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';

type CardTableProps = {
  tcg: Tcg;
  cards: MtgSearchCardsResult | DlcSearchCardsResult | PcgSearchCardsResult | null | undefined;
  isLoading: boolean;
  toolsEnabled: boolean;
};

export function CardTable({ tcg, cards, isLoading, toolsEnabled }: CardTableProps) {
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
    let data: GourmetTableData<MtgDataCard | DlcDataCard | PcgDataCard> | null = null;
    if (tcg === 'mtg') data = mtgData as GourmetTableData<MtgDataCard | DlcDataCard | PcgDataCard>;
    else if (tcg === 'dlc') data = dlcData;
    else if (tcg === 'pcg') data = pcgData;

    if (!data) return null;
    return data;
  }, [mtgData, dlcData, pcgData, tcg]);

  return (
    <div>
      {tableData && (
        <GourmetTable
          tcg={tcg}
          isLoading={isLoading}
          tableData={tableData}
          constructHorTableRow={({ entry, data }, index) => {
            return (
              <TableRowHorizontal
                key={entry.id}
                card={entry as TcgDataCard}
                index={index}
                data={data}
                columns={tableData?.columns ?? []}
                toolsEnabled={toolsEnabled}
              />
            );
          }}
          constructVerTableRow={({ entry, data }, index) => {
            return (
              <TableRowVertical
                key={entry.id}
                card={entry}
                data={data}
                columns={tableData?.columns ?? []}
                index={index}
                toolsEnabled={toolsEnabled}
              />
            );
          }}
        />
      )}
    </div>
  );
}
