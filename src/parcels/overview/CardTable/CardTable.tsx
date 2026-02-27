import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, type ReactElement, useMemo, useState} from 'react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/mantine/GourmetText.tsx';
import {MoreActionsMenu} from '@/parcels/overview/CardGrid/ImageCard/MoreActionsMenu/MoreActionsMenu.tsx';
import {getIdsInRange} from '@/parcels/selection/getIdsInRange.ts';
import {useSelectionIntegration} from '@/parcels/selection/useSelectionIntegration.ts';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import type {DlcSearchCardsResult, DlcSearchDataCard} from '@/parcels/tcg/dlc/api.ts';
import {constructDlcCardTableData} from '@/parcels/tcg/dlc/overview/constructDlcCardTableData.tsx';
import type {MtgSearchCardsResult, MtgSearchDataCard} from '@/parcels/tcg/mtg/api.ts';
import {constructMtgCardTableData} from '@/parcels/tcg/mtg/overview/constructMtgCardTableData.tsx';
import type {PcgSearchCardsResult, PcgSearchDataCard} from '@/parcels/tcg/pcg/api.ts';
import {constructPcgCardTableData} from '@/parcels/tcg/pcg/overview/constructPcgCardTableData.tsx';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
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

function TableRowVertical({
  card,
  index,
  data,
  columns,
  toolsEnabled,
}: {
  card: TcgDataCard;
  index: number;
  data: Record<string, ReactElement>;
  columns: string[];
  toolsEnabled: boolean;
}) {
  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const workContext = useTcgOverviewWorkContext();
  const { isSelectionMode, isSelected, checked, setSelection, setMultiSelection } = useSelectionIntegration({
    id: card.id,
    index,
  });

  return (
    <>
      {columns.map((column) => (
        <tr key={`${card.print.id}_${column}`} data-cell={'not-last'}>
          <th style={{ width: '5.25rem' }}>{column}</th>
          <td data-selected={isSelected}>{data[column]}</td>
        </tr>
      ))}
      <tr data-selected={isSelected} data-cell={'last'}>
        <th>
          <GourmetText cgmc={'neutral-5'}>Tools</GourmetText>
        </th>
        <td data-selected={isSelected}>
          <Group justify={'space-between'}>
            <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
              <Checkbox
                style={{ pointerEvents: 'auto' }}
                onClick={(event) => {
                  // if shift key, calculate range of cards to add or remove
                  const anchorIndex = workContext?.data?.selection?.anchorIndex;
                  if (event.shiftKey && anchorIndex !== undefined && anchorIndex > -1) {
                    window.getSelection()?.removeAllRanges();

                    const ids = getIdsInRange(anchorIndex, index, workContext!);
                    setMultiSelection(ids, !checked);
                    return;
                  }

                  setSelection(!checked);
                }}
                color={'var(--gourmet-orange-1)'}
                checked={checked}
                classNames={{ root: styles.overlayCheckbox }}
              />
            </Activity>
            <Activity mode={!toolsEnabled || isSelectionMode ? 'hidden' : 'visible'}>
              <Group justify={'end'}>
                <MoreActionsMenu
                  menuOpened={menuOpened}
                  setMenuOpened={setMenuOpened}
                  submenuOpened={submenuOpened}
                  setSubmenuOpened={setSubmenuOpened}
                  target={
                    <ActionIcon
                      style={{ pointerEvents: 'auto' }}
                      onClick={() => setMenuOpened((v) => !v)}
                      color="var(--gourmet-neutral-dark-4)"
                      size={'1.25rem'}
                      data-menu-opened={menuOpened}
                    >
                      <IconDotsVertical size={16} />
                    </ActionIcon>
                  }
                />
              </Group>
            </Activity>
          </Group>
        </td>
      </tr>
    </>
  );
}

function TableRowHorizontal({
  card,
  index,
  data,
  columns,
  toolsEnabled,
}: {
  card: TcgDataCard;
  index: number;
  data: Record<string, ReactElement>;
  columns: string[];
  toolsEnabled: boolean;
}) {
  const [menuOpened, setMenuOpened] = useState(false);
  const [submenuOpened, setSubmenuOpened] = useState(false);

  const workContext = useTcgOverviewWorkContext();
  const { isSelectionMode, isSelected, checked, setSelection, setMultiSelection } = useSelectionIntegration({
    id: card.id,
    index,
  });

  return (
    <tr key={card.print.id} data-selected={isSelected}>
      <td>
        <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
          <Checkbox
            style={{ pointerEvents: 'auto' }}
            onClick={(event) => {
              // if shift key, calculate range of cards to add or remove
              const anchorIndex = workContext?.data?.selection?.anchorIndex;
              if (event.shiftKey && anchorIndex !== undefined && anchorIndex > -1) {
                window.getSelection()?.removeAllRanges();

                const ids = getIdsInRange(anchorIndex, index, workContext!);
                setMultiSelection(ids, !checked);
                return;
              }

              setSelection(!checked);
            }}
            color={'var(--gourmet-orange-1)'}
            checked={checked}
            classNames={{ root: styles.overlayCheckbox }}
          />
        </Activity>
      </td>
      {columns.map((column) => (
        <td key={column}>{data[column]}</td>
      ))}
      <td>
        <Activity mode={!toolsEnabled || isSelectionMode ? 'hidden' : 'visible'}>
          <Group justify={'end'}>
            <MoreActionsMenu
              menuOpened={menuOpened}
              setMenuOpened={setMenuOpened}
              submenuOpened={submenuOpened}
              setSubmenuOpened={setSubmenuOpened}
              target={
                <ActionIcon
                  style={{ pointerEvents: 'auto' }}
                  onClick={() => setMenuOpened((v) => !v)}
                  color="var(--gourmet-neutral-dark-4)"
                  size={'1.25rem'}
                  data-menu-opened={menuOpened}
                >
                  <IconDotsVertical size={16} />
                </ActionIcon>
              }
            />
          </Group>
        </Activity>
      </td>
    </tr>
  );
}
