import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, useCallback, useMemo} from 'react';
import {type CardProperties, createProps} from '@/parcels/overview/CardGrid/CardGridEntry/createProps.ts';
import {useSetSelectionWithCheck} from '@/parcels/overview/CardGrid/CardGridEntry/useSetSelectionWithCheck.ts';
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

  const setSelectionWithCheck = useSetSelectionWithCheck({ thisId: card.card.print.id, index });
  const setSelectionWrapper = useCallback(
    (select: boolean) => {
      const thisId = card.card.print.id;
      setSelectionWithCheck([thisId], select, false);
    },
    [card.card.print.id, setSelectionWithCheck],
  );

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
        'data-selected': isSelected,
        onClick: (event) => {
          event.preventDefault();
          const thisId = card.card.print.id;

          setSelectionWithCheck([thisId], !isSelected, event.shiftKey);
        },
        tabIndex: isSelectionMode ? 0 : undefined,
        className: `${styles.cardLink} ${isSelectionMode && !isSelected ? styles.cardLinkSelectable : ''}`,
      }}
      imageDivProps={{
        /* @ts-expect-error */
        'data-selected': isSelected,
      }}
      style={{
        zIndex: isSelected ? 1 : 0,
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
              checked={isSelected}
            />
            <Activity mode={'hidden'}>{actionIcon}</Activity>
          </Group>
        </Activity>
      )}

      {!isTouchDevice && (
        <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
          <ToolsOverlay
            card={card.card}
            checked={isSelected}
            isSelectionMode={isSelected || isSelectionMode}
            setSelection={setSelectionWrapper}
            menuButton={actionIcon}
          />
        </Activity>
      )}
    </ImageCard>
  );
}
