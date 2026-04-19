import {ActionIcon, Checkbox, Group} from '@mantine/core';
import {useMediaQuery} from '@mantine/hooks';
import {IconDotsVertical} from '@tabler/icons-react';
import {Activity, useMemo} from 'react';
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
  const thisId = card.card.print.id;

  const isSelectionMode = useTcgOverviewWorkStore((state) => state.isSelectionMode);
  const isSelected = useTcgOverviewWorkStore((state) => {
    return state.data?.selection?.elementDataById?.[thisId] !== undefined;
  });
  const setSelectionWithCheck = useTcgOverviewWorkStore((state) => state.setSelectionWithCheck);

  const openCardMenu = useCardMenuStore((state) => state.openMenu);
  const isCardMenuOpen = useCardMenuStore((state) => state.opened && state.data?.print?.id === card.card.print.id);
  const cardMenuButton = useMemo(() => {
    return (
      <ActionIcon
        style={{ pointerEvents: 'auto' }}
        onMouseDown={(event) => event.stopPropagation()}
        onClick={(event) => {
          openCardMenu(card?.card, event.currentTarget);
        }}
        color="var(--gourmet-neutral-dark-3)"
        size={'1.25rem'}
        classNames={{ root: styles.overlayMenuButton }}
        data-menu-opened={isCardMenuOpen}
        data-toggle-visibility={true}
      >
        <IconDotsVertical size={16} />
      </ActionIcon>
    );
  }, [card, openCardMenu, isCardMenuOpen]);

  return (
    <ImageCard
      tcg={tcg}
      prop={prop}
      linkProps={{
        /* @ts-expect-error */
        'data-selected': isSelected,
        onClick: (event) => {
          event.preventDefault(); // prevent the event from bubbling up
          setSelectionWithCheck([thisId], !isSelected, event.shiftKey, thisId, index);
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
                setSelectionWithCheck([thisId], event.currentTarget.checked, false, thisId, index);
              }}
              color={'var(--gourmet-orange-1)'}
              checked={isSelected}
            />
            <Activity mode={!isSelectionMode ? 'visible' : 'hidden'}>{cardMenuButton}</Activity>
          </Group>
        </Activity>
      )}

      {!isTouchDevice && (
        <Activity mode={toolsEnabled ? 'visible' : 'hidden'}>
          <ToolsOverlay
            card={card.card}
            checked={isSelected}
            isSelectionMode={isSelected || isSelectionMode}
            setSelection={(select) => {
              const thisId = card.card.print.id;
              setSelectionWithCheck([thisId], select, false, thisId, index);
            }}
            menuButton={cardMenuButton}
          />
        </Activity>
      )}
    </ImageCard>
  );
}
