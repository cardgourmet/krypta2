import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, type ReactElement, useMemo} from 'react';
import type {TcgDataCard} from '@/parcels/details/TcgPrintDetails/TcgPrintDetails.tsx';
import {GourmetText} from '@/parcels/generic/mantine/GourmetText.tsx';
import {ExistsInListsBadge} from '@/parcels/lists/ExistsInListsBadge/ExistsInListBadge.tsx';
import styles from '@/parcels/overview/CardTable/CardTable.module.css';
import {getIdsInRange} from '@/parcels/selection/getIdsInRange.ts';
import {useSelectionIntegration} from '@/parcels/selection/useSelectionIntegration.ts';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';

export function TableRowVertical({
  card,
  index,
  data,
  columns,
  toolsEnabled,
  onOpenMenu,
}: {
  card: TcgDataCard;
  index: number;
  data: Record<string, ReactElement>;
  columns: string[];
  toolsEnabled: boolean;
  onOpenMenu: (card: TcgDataCard, target: HTMLButtonElement) => void;
}) {
  const workContext = useTcgOverviewWorkContext();
  const { isSelectionMode, isSelected, checked, setSelection, setMultiSelection } = useSelectionIntegration({
    id: card.id,
    index,
  });
  const actionIcon = useMemo(() => {
    return (
      <ActionIcon
        style={{ pointerEvents: 'auto' }}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => onOpenMenu(card, event.currentTarget)}
        color="var(--gourmet-neutral-dark-4)"
        size={'1.25rem'}
      >
        <IconDotsVertical size={18} color={'var(--gourmet-neutral-8)'} />
      </ActionIcon>
    );
  }, [card, onOpenMenu]);

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
              <Group justify={'end'} wrap={'nowrap'} gap={'0.2rem'}>
                <ExistsInListsBadge type={'card'} resourceId={card.print.id} />

                {actionIcon}
              </Group>
            </Activity>
          </Group>
        </td>
      </tr>
    </>
  );
}
