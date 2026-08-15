import { ActionIcon, Checkbox, Group } from '@mantine/core';
import { IconDotsVertical } from '@tabler/icons-react';
import { Activity, type ReactElement, useMemo } from 'react';
import { GourmetText } from '@/parcels/generic/mantine/GourmetText.tsx';
import { ExistsInListsBadge } from '@/parcels/lists/ExistsInListsBadge/ExistsInListBadge.tsx';
import styles from '@/parcels/overview/cards/CardTable/CardTable.module.css';
import { useCardMenuStore } from '@/parcels/overview/cards/TcgCardMenu/useTcgCardMenuStore.ts';
import { useOverviewWorkStore } from '@/parcels/selection/useOverviewWorkStore.ts';
import type { TcgDataCard } from '@/parcels/tcg/types.ts';

export function TableRowVertical({
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

  const isSelectionMode = useOverviewWorkStore((state) => state.isSelectionMode);
  const isSelected = useOverviewWorkStore((state) => {
    return state.data?.selection?.elementDataById?.[thisId] !== undefined;
  });
  const setSelectionWithCheck = useOverviewWorkStore((state) => state.setSelectionWithCheck);

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
                  if (event.shiftKey) {
                    window.getSelection()?.removeAllRanges();
                  }

                  setSelectionWithCheck([thisId], event.currentTarget.checked, event.shiftKey, thisId, index);
                }}
                color={'var(--gourmet-orange-1)'}
                checked={isSelected}
                classNames={{ root: styles.overlayCheckbox }}
              />
            </Activity>
            <Activity mode={!toolsEnabled || isSelectionMode ? 'hidden' : 'visible'}>
              <Group justify={'end'} wrap={'nowrap'} gap={'0.2rem'}>
                <ExistsInListsBadge resourceId={card.print.id} />

                {actionIcon}
              </Group>
            </Activity>
          </Group>
        </td>
      </tr>
    </>
  );
}
