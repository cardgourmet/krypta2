import { ActionIcon, Checkbox, Group } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconDotsVertical } from '@tabler/icons-react';
import { Activity, useMemo } from 'react';
import { type CardProperties, createProps } from '@/parcels/overview/cards/CardGrid/CardGridEntry/createProps.ts';
import { ToolsOverlay } from '@/parcels/overview/cards/CardGrid/ToolsOverlay/ToolsOverlay.tsx';
import { ImageCard } from '@/parcels/overview/cards/ImageCard/ImageCard.tsx';
import { useCardMenuStore } from '@/parcels/overview/cards/TcgCardMenu/useTcgCardMenuStore.ts';
import { useTcgOverviewWorkStore } from '@/parcels/selection/TcgOverviewWorkContext/useTcgOverviewWorkStore.ts';
import type { MtgSearchDataCard } from '@/parcels/tcg/mtg/api.ts';
import type { TcgSearchDataCard } from '@/parcels/tcg/types.ts';
import type { Tcg } from '@/parcels/tcg/useTcgByLocation.ts';
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

  // currently only scryfall is supported
  const dragData: { url: string; name: string; html: string } | undefined = useMemo(() => {
    if (tcg !== 'mtg') return undefined;

    const mtgCard = card as MtgSearchDataCard;
    const scryfallId = mtgCard.card.print.identifiers?.scryfallId;
    if (!scryfallId) return undefined;

    const dragData = {
      url: `https://cards.scryfall.io/large/front/${scryfallId[0]}/${scryfallId[1]}/${scryfallId}.jpg?1764118239`,
      name: `${mtgCard.card.name} (${mtgCard.card.print.setCode} #${mtgCard.card.print.collectorNumber})`,
    };

    return {
      url: dragData.url,
      name: dragData.name,
      html: `<img class="card dft border-black " title="${dragData.name}" alt="${dragData.name}" loading="eager" src="${dragData.url}">`,
    };
  }, [card, tcg]);

  return (
    <ImageCard
      tcg={tcg}
      prop={prop}
      linkProps={{
        /* @ts-expect-error */
        'data-selected': isSelected,
        onClick: (event) => {
          if (!isSelectionMode) return;

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
      onDragStart={(event) => {
        if (!dragData) return;

        event.dataTransfer.setData('text/plain', dragData.url);
        event.dataTransfer.setData('text/uri-list', dragData.url);
        event.dataTransfer.setData('text/html', dragData.html);
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
