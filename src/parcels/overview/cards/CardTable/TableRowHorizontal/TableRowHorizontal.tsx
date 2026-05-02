import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, type ReactElement, useMemo} from 'react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {ExistsInListsBadge} from '@/parcels/lists/ExistsInListsBadge/ExistsInListBadge.tsx';
import styles from '@/parcels/overview/cards/CardTable/CardTable.module.css';
import {useCardMenuStore} from '@/parcels/overview/cards/TcgCardMenu/useTcgCardMenuStore.ts';
import {useTcgOverviewWorkStore} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkStore.ts';

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
  const thisId = card.print.id;

  const isSelectionMode = useTcgOverviewWorkStore((state) => state.isSelectionMode);
  const isSelected = useTcgOverviewWorkStore((state) => {
    return state.data?.selection?.elementDataById?.[thisId] !== undefined;
  });
  const setSelectionWithCheck = useTcgOverviewWorkStore((state) => state.setSelectionWithCheck);

  const columnElements = useMemo(() => {
    return columns.map((column) => <td key={column}>{data[column]}</td>);
  }, [columns, data]);

  const checkbox = useMemo(() => {
    return (
      <Checkbox
        style={{ pointerEvents: 'auto' }}
        onClick={(event) => {
          if (event.shiftKey) {
            window.getSelection()?.removeAllRanges();
          }

          setSelectionWithCheck([thisId], event.currentTarget.checked, event.shiftKey, thisId, index);
        }}
        color={'var(--gourmet-orange-1)'}
        checked={isSelected}
        classNames={{ root: styles.overlayCheckbox }}
      />
    );
  }, [index, isSelected, setSelectionWithCheck, thisId]);

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
