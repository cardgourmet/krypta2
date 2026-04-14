import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, useMemo} from 'react';
import {type CardProperties, createProps} from '@/parcels/overview/CardGrid/CardGridEntry/createProps.ts';
import {ToolsOverlay} from '@/parcels/overview/CardGrid/ToolsOverlay/ToolsOverlay.tsx';
import {ImageCard} from '@/parcels/overview/ImageCard/ImageCard.tsx';
import {useCardMenuStore} from '@/parcels/overview/TcgCardMenu/useTcgCardMenuStore.ts';
import {getIdsInRange} from '@/parcels/selection/getIdsInRange.ts';
import {useSelectionIntegration} from '@/parcels/selection/useSelectionIntegration.ts';
import {useTcgOverviewWorkContext} from '@/parcels/selection/useTcgOverviewWorkContext.ts';
import type {TcgSearchDataCard} from '@/parcels/tcg/types.ts';
import type {Tcg} from '@/parcels/tcg/useTcgByLocation.ts';
import styles from './CardGridEntry.module.css';

interface ImageCardProps {
  tcg: Tcg;
  card: TcgSearchDataCard;
  index: number;
  toolsEnabled: boolean;
}

export default function CardGridEntry({ tcg, card, index, toolsEnabled }: ImageCardProps) {
  const prop: CardProperties = useMemo(() => {
    return createProps(tcg, card) as CardProperties;
  }, [tcg, card]);

  const isTouchDevice = useMediaQuery('(hover: none)');
  const workContext = useTcgOverviewWorkContext();
  const { isSelectionMode, isSelected, checked, setSelection, setMultiSelection } = useSelectionIntegration({
    id: prop.id,
    index,
  });

  const openMenu = useCardMenuStore((state) => state.openMenu);
  const isOpen = useCardMenuStore((state) => state.opened && state.data?.print?.id === card.card.print.id);
  const actionIcon = useMemo(() => {
    return (
      <ActionIcon
        style={{ pointerEvents: 'auto' }}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          openMenu(card?.card, event.currentTarget);
        }}
        color="var(--gourmet-neutral-dark-3)"
        size={'1.25rem'}
        classNames={{ root: styles.overlayMenuButton }}
        data-menu-opened={isOpen}
        data-toggle-visibility={true}
      >
        <IconDotsVertical size={16} />
      </ActionIcon>
    );
  }, [card, openMenu, isOpen]);

  return (
    <ImageCard
      tcg={tcg}
      prop={prop}
      linkProps={{
        /* @ts-expect-error */
        'data-selected': checked,
        disabled: isSelectionMode,
        'data-disabled': isSelectionMode,
        onClick: (event) => {
          if (!isSelectionMode) return;
          event.preventDefault();

          // if shift key, calculate range of cards to add or remove
          const anchorIndex = workContext?.data?.selection?.anchorIndex;
          if (event.shiftKey && anchorIndex !== undefined && anchorIndex > -1) {
            const ids = getIdsInRange(anchorIndex, index, workContext!);
            setMultiSelection(ids, !checked);
            return;
          }

          setSelection(!checked);
        },
        tabIndex: isSelectionMode ? 0 : undefined,
        className: `${styles.cardLink} ${isSelectionMode && !isSelected ? styles.cardLinkSelectable : ''}`,
      }}
      imageDivProps={{
        className: isSelectionMode ? styles.cardSelectionOverlay : '',
        /* @ts-expect-error */
        'data-selected': isSelected,
      }}
    >
      {toolsEnabled && isTouchDevice && (
        <Group p={'0.5rem'} justify={'space-between'}>
          <Checkbox
            style={{ pointerEvents: 'auto' }}
            onChange={(event) => setSelection(event.currentTarget.checked)}
            color={'var(--gourmet-orange-1)'}
            checked={checked}
            /*wrapperProps={{
              'data-menu-opened': menuOpened,
            }}*/
          />
          <Activity mode={!isSelectionMode ? 'visible' : 'hidden'}>{actionIcon}</Activity>
        </Group>
      )}

      {!isTouchDevice && (
        <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
          <ToolsOverlay
            card={card.card}
            checked={checked}
            isSelectionMode={isSelectionMode}
            setSelection={setSelection}
            menuButton={actionIcon}
          />
        </Activity>
      )}
    </ImageCard>
  );
}
