import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, type ReactElement, useMemo} from 'react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {ExistsInListsBadge} from '@/parcels/lists/ExistsInListsBadge/ExistsInListBadge.tsx';
import styles from '@/parcels/overview/CardTable/CardTable.module.css';
import {useCardMenuStore} from '@/parcels/overview/TcgCardMenu/useTcgCardMenuStore.ts';
import {getIdsInRange} from '@/parcels/selection/getIdsInRange.ts';
import {useSelectionIntegration} from '@/parcels/selection/useSelectionIntegration.ts';
import {useTcgOverviewWorkContext} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkContext.ts';

export function TableRowHorizontal({
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
  const workContext = useTcgOverviewWorkContext();
  const { isSelectionMode, isSelected, checked, setSelection, setMultiSelection } = useSelectionIntegration({
    id: card.id,
    index,
  });
  const columnElements = useMemo(() => {
    return columns.map((column) => <td key={column}>{data[column]}</td>);
  }, [columns, data]);

  const checkbox = useMemo(() => {
    return (
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
    );
  }, [checked, index, setMultiSelection, setSelection, workContext]);

  const openMenu = useCardMenuStore((state) => state.openMenu);
  const actionIcon = useMemo(() => {
    return (
      <ActionIcon
        style={{ pointerEvents: 'auto' }}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => openMenu(card, event.currentTarget)}
        color="var(--gourmet-neutral-dark-4)"
        size={'1.25rem'}
      >
        <IconDotsVertical size={18} color={'var(--gourmet-neutral-8)'} />
      </ActionIcon>
    );
  }, [card, openMenu]);

  return (
    <tr key={card.print.id} data-selected={isSelected}>
      <td>
        <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>{checkbox}</Activity>
      </td>
      {columnElements}
      <td>
        <Activity mode={!toolsEnabled || isSelectionMode ? 'hidden' : 'visible'}>
          <Group justify={'end'} wrap={'nowrap'} gap={'0.2rem'}>
            <ExistsInListsBadge type={'card'} resourceId={card.print.id} />

            {actionIcon}
          </Group>
        </Activity>
      </td>
    </tr>
  );
}
