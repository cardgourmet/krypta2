import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, useCallback, useEffect, useMemo, useState} from 'react';
import {type CardProperties, createProps} from '@/parcels/overview/CardGrid/CardGridEntry/createProps.ts';
import {ToolsOverlay} from '@/parcels/overview/CardGrid/ToolsOverlay/ToolsOverlay.tsx';
import {ImageCard} from '@/parcels/overview/ImageCard/ImageCard.tsx';
import {useCardMenuStore} from '@/parcels/overview/TcgCardMenu/useTcgCardMenuStore.ts';
import {useTcgOverviewWorkStore} from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkStore.ts';
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

  const isSelectionMode = useTcgOverviewWorkStore((state) => state.isSelectionMode);
  const isSelected = useTcgOverviewWorkStore((state) => {
    const thisId = card.card.print.id;
    return state.data?.selection?.elementDataById?.[thisId] !== undefined;
  });
  const getIdsInRange = useTcgOverviewWorkStore((state) => state.getIdsInRange);
  const checkSelection = useTcgOverviewWorkStore((state) => state.checkSelection);

  const setSelection = useTcgOverviewWorkStore((state) => state.setSelection);
  const setSelectionMode = useTcgOverviewWorkStore((state) => state.setSelectionMode);
  const setSelectionModeLoading = useTcgOverviewWorkStore((state) => state.setSelectionModeLoading);
  const setSelectionWithCheck = useCallback(
    (ids: string[], select: boolean, shift: boolean) => {
      const thisId = card.card.print.id;

      let mustIds = ids;
      if (shift) {
        // if shift key, calculate range of cards to add or remove
        mustIds = getIdsInRange(index);
      }
      if (mustIds.length === 0) return;

      const { success: allowed, toggledMode, newMode } = checkSelection(mustIds, select);
      if (!allowed) return;

      setChecked(select);
      setSelection(mustIds, select, index, thisId);

      if (toggledMode) {
        setSelectionModeLoading(true);

        setTimeout(() => {
          setSelectionMode(newMode ?? false);
        }, 0);
      }
    },
    [card.card.print.id, checkSelection, getIdsInRange, index, setSelection, setSelectionMode, setSelectionModeLoading],
  );
  const setSelectionWrapper = useCallback(
    (select: boolean) => {
      const thisId = card.card.print.id;
      setSelectionWithCheck([thisId], select, false);
    },
    [card.card.print.id, setSelectionWithCheck],
  );

  const [checked, setChecked] = useState<boolean>(false);
  useEffect(() => {
    setChecked((prev) => {
      if (prev === isSelected) return prev;
      return !prev;
    });
  }, [isSelected]);

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
        onClick: (event) => {
          event.preventDefault();
          const thisId = card.card.print.id;

          setSelectionWithCheck([thisId], !checked, event.shiftKey);
        },
        //tabIndex: isSelectionMode ? 0 : undefined,
        className: `${styles.cardLink} ${isSelectionMode && !isSelected && !checked ? styles.cardLinkSelectable : ''}`,
      }}
      imageDivProps={{
        //className: isSelectionMode ? styles.cardSelectionOverlay : '',
        /* @ts-expect-error */
        'data-selected': checked,
      }}
      style={{
        zIndex: checked ? 1 : 0,
      }}
    >
      {isTouchDevice && (
        <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
          <Group p={'0.5rem'} justify={'space-between'}>
            <Checkbox
              style={{ pointerEvents: 'auto' }}
              onChange={(event) => {
                const thisId = card.card.print.id;
                setSelectionWithCheck([thisId], event.currentTarget.checked, false);
              }}
              color={'var(--gourmet-orange-1)'}
              checked={checked}
            />
            <Activity mode={'hidden'}>{actionIcon}</Activity>
          </Group>
        </Activity>
      )}

      {!isTouchDevice && (
        <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
          <ToolsOverlay
            card={card.card}
            checked={checked}
            isSelectionMode={checked || isSelectionMode}
            setSelection={setSelectionWrapper}
            menuButton={actionIcon}
          />
        </Activity>
      )}
    </ImageCard>
  );
}
